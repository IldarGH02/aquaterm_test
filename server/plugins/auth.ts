import type { FastifyReply, FastifyRequest } from 'fastify';
import type Database from 'better-sqlite3';
import type { AuthenticatedUser, UserRole } from '../types';
import { config } from '../config';

interface SessionRow {
  sid: string;
  user_id: number;
  expires_at: string;
  login: string;
  role: UserRole;
  is_active: number;
  telegram_chat_id: string | null;
  must_change_password: number;
}

export function createAuthHook(db: Database.Database) {
  const sessionQuery = db.prepare(`
    SELECT
      s.sid,
      s.user_id,
      s.expires_at,
      u.login,
      u.role,
      u.is_active,
      u.telegram_chat_id,
      u.must_change_password
    FROM sessions s
    INNER JOIN users u ON u.id = s.user_id
    WHERE s.sid = ?
  `);

  const deleteSessionQuery = db.prepare('DELETE FROM sessions WHERE sid = ?');

  return async function authHook(request: FastifyRequest): Promise<void> {
    const sid = request.cookies[config.cookieName];
    if (!sid) {
      request.currentUser = null;
      return;
    }

    const session = sessionQuery.get(sid) as SessionRow | undefined;
    if (!session) {
      request.currentUser = null;
      return;
    }

    const now = Date.now();
    const expiresAt = new Date(session.expires_at).getTime();
    if (Number.isNaN(expiresAt) || expiresAt <= now) {
      deleteSessionQuery.run(sid);
      request.currentUser = null;
      return;
    }

    if (!session.is_active) {
      request.currentUser = null;
      return;
    }

    request.currentUser = {
      id: session.user_id,
      login: session.login,
      role: session.role,
      isActive: Boolean(session.is_active),
      telegramChatId: session.telegram_chat_id,
      mustChangePassword: Boolean(session.must_change_password),
    };
  };
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!request.currentUser) {
    reply.code(401).send({ error: 'AUTH_REQUIRED' });
    return;
  }
}

export function requireRole(roles: UserRole[]) {
  return async function roleGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.currentUser) {
      reply.code(401).send({ error: 'AUTH_REQUIRED' });
      return;
    }

    if (!roles.includes(request.currentUser.role)) {
      reply.code(403).send({ error: 'FORBIDDEN' });
      return;
    }
  };
}

declare module 'fastify' {
  interface FastifyRequest {
    currentUser: AuthenticatedUser | null;
  }
}
