import type Database from 'better-sqlite3';
import type { NotificationType } from '../types';

export interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
}

export interface NotificationRecord {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  payload: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface OutboxMessageInput {
  eventType: string;
  targetUserId?: number;
  targetChatId?: string;
  payload: Record<string, unknown>;
}

export class NotificationService {
  constructor(private readonly db: Database.Database) {}

  private normalizeDate(value: string | null): string | null {
    if (!value) {
      return null;
    }

    if (value.includes('T')) {
      return new Date(value).toISOString();
    }

    return new Date(`${value.replace(' ', 'T')}Z`).toISOString();
  }

  createNotification(input: CreateNotificationInput): number {
    const result = this.db
      .prepare(
        `
        INSERT INTO notifications (user_id, type, title, message, payload)
        VALUES (?, ?, ?, ?, ?)
      `,
      )
      .run(
        input.userId,
        input.type,
        input.title,
        input.message,
        input.payload ? JSON.stringify(input.payload) : null,
      );

    return Number(result.lastInsertRowid);
  }

  enqueueOutbox(input: OutboxMessageInput): number {
    const result = this.db
      .prepare(
        `
        INSERT INTO event_outbox (event_type, target_user_id, target_chat_id, payload)
        VALUES (?, ?, ?, ?)
      `,
      )
      .run(input.eventType, input.targetUserId ?? null, input.targetChatId ?? null, JSON.stringify(input.payload));

    return Number(result.lastInsertRowid);
  }

  notifyUsers(
    userIds: number[],
    notification: Omit<CreateNotificationInput, 'userId'>,
    outboxEventType: string,
    outboxPayloadFactory: (userId: number) => Record<string, unknown>,
  ): void {
    const uniqueUserIds = Array.from(new Set(userIds.filter((userId) => Number.isInteger(userId) && userId > 0)));
    if (uniqueUserIds.length === 0) {
      return;
    }

    const transaction = this.db.transaction(() => {
      for (const userId of uniqueUserIds) {
        this.createNotification({ ...notification, userId });
        this.enqueueOutbox({
          eventType: outboxEventType,
          targetUserId: userId,
          payload: outboxPayloadFactory(userId),
        });
      }
    });

    transaction();
  }

  listForUser(userId: number): { notifications: NotificationRecord[]; unreadCount: number } {
    const rows = this.db
      .prepare(
        `
        SELECT id, user_id, type, title, message, payload, read_at, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 100
      `,
      )
      .all(userId) as {
      id: number;
      user_id: number;
      type: NotificationType;
      title: string;
      message: string;
      payload: string | null;
      read_at: string | null;
      created_at: string;
    }[];

    const unread = this.db
      .prepare(
        `
        SELECT COUNT(*) AS count
        FROM notifications
        WHERE user_id = ? AND read_at IS NULL
      `,
      )
      .get(userId) as { count: number };

    return {
      notifications: rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        type: row.type,
        title: row.title,
        message: row.message,
        payload: row.payload ? (JSON.parse(row.payload) as Record<string, unknown>) : null,
        readAt: this.normalizeDate(row.read_at),
        createdAt: this.normalizeDate(row.created_at) ?? new Date().toISOString(),
      })),
      unreadCount: unread.count,
    };
  }

  markAsRead(userId: number, notificationId: number): boolean {
    const result = this.db
      .prepare(
        `
        UPDATE notifications
        SET read_at = datetime('now')
        WHERE id = ? AND user_id = ? AND read_at IS NULL
      `,
      )
      .run(notificationId, userId);

    return result.changes > 0;
  }
}
