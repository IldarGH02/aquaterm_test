import type Database from 'better-sqlite3';

interface OutboxRow {
  id: number;
  event_type: string;
  target_user_id: number | null;
  target_chat_id: string | null;
  payload: string;
  attempts: number;
}

export class TelegramAdapter {
  constructor(
    private readonly db: Database.Database,
    private readonly botToken: string,
  ) {}

  private async sendMessage(chatId: string, text: string): Promise<void> {
    if (!this.botToken) {
      throw new Error('TELEGRAM_DISABLED');
    }

    const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`TELEGRAM_API_ERROR:${response.status}:${body}`);
    }
  }

  private resolveTargetChatId(row: OutboxRow): string | null {
    if (row.target_chat_id) {
      return row.target_chat_id;
    }

    if (!row.target_user_id) {
      return null;
    }

    const user = this.db
      .prepare('SELECT telegram_chat_id FROM users WHERE id = ?')
      .get(row.target_user_id) as { telegram_chat_id: string | null } | undefined;

    return user?.telegram_chat_id ?? null;
  }

  async flushOutbox(limit = 20): Promise<{ sent: number; failed: number }> {
    const rows = this.db
      .prepare(
        `
        SELECT id, event_type, target_user_id, target_chat_id, payload, attempts
        FROM event_outbox
        WHERE status = 'PENDING' AND attempts < 5
        ORDER BY created_at ASC
        LIMIT ?
      `,
      )
      .all(limit) as OutboxRow[];

    let sent = 0;
    let failed = 0;

    for (const row of rows) {
      const payload = JSON.parse(row.payload) as { text?: string; taskId?: number };
      const chatId = this.resolveTargetChatId(row);

      if (!chatId) {
        this.db
          .prepare(
            `
            UPDATE event_outbox
            SET status = 'FAILED',
                attempts = attempts + 1,
                last_error = ?,
                sent_at = datetime('now')
            WHERE id = ?
          `,
          )
          .run('CHAT_ID_NOT_FOUND', row.id);
        failed += 1;
        continue;
      }

      try {
        await this.sendMessage(chatId, payload.text ?? 'У вас новое CRM-событие');

        this.db
          .prepare(
            `
            UPDATE event_outbox
            SET status = 'SENT',
                sent_at = datetime('now')
            WHERE id = ?
          `,
          )
          .run(row.id);

        sent += 1;
      } catch (error) {
        this.db
          .prepare(
            `
            UPDATE event_outbox
            SET attempts = attempts + 1,
                last_error = ?,
                status = CASE WHEN attempts + 1 >= 5 THEN 'FAILED' ELSE 'PENDING' END
            WHERE id = ?
          `,
          )
          .run(error instanceof Error ? error.message : 'UNKNOWN_ERROR', row.id);
        failed += 1;
      }
    }

    return { sent, failed };
  }
}
