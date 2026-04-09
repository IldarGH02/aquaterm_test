import path from 'node:path';
import { fileURLToPath } from 'node:url';

const _serverDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)));

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

export const config = {
  host: process.env.CRM_HOST || '0.0.0.0',
  port: parseNumber(process.env.CRM_PORT, 8787),
  dbPath: process.env.CRM_DB_PATH || path.resolve(_serverDir, '..', 'data', 'crm.sqlite'),
  sessionTtlHours: parseNumber(process.env.CRM_SESSION_TTL_HOURS, 24 * 7),
  ownerLogin: process.env.CRM_OWNER_LOGIN || 'owner',
  ownerPassword: process.env.CRM_OWNER_PASSWORD ?? 'ChangeMe123!',
  cookieName: 'crm_sid',
  timezone: process.env.CRM_TIMEZONE || 'Europe/Moscow',
  corsOrigin: process.env.CRM_CORS_ORIGIN || 'http://localhost:3000',
  telegramBotToken: process.env.CRM_TELEGRAM_BOT_TOKEN || '',
  telegramPollIntervalMs: parseNumber(process.env.CRM_TELEGRAM_POLL_MS, 15000),
  crmBaseUrl: process.env.CRM_BASE_URL || 'http://localhost:3000/crm',
};
