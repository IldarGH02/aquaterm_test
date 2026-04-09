import crypto from 'node:crypto';
import type Database from 'better-sqlite3';
import argon2 from 'argon2';
import { config } from '../config';
import type { AuthenticatedUser, UserRole } from '../types';

interface UserWithPassword {
  id: number;
  login: string;
  password_hash: string;
  role: UserRole;
  is_active: number;
  telegram_chat_id: string | null;
  must_change_password: number;
}

export interface LoginMeta {
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginResult {
  sid: string;
  user: AuthenticatedUser;
}

export interface CreateUserInput {
  login: string;
  password: string;
  role: UserRole;
  telegramChatId?: string | null;
  mustChangePassword?: boolean;
}

export interface UpdateUserInput {
  role?: UserRole;
  isActive?: boolean;
  telegramChatId?: string | null;
  password?: string;
  mustChangePassword?: boolean;
}

export class AuthService {
  constructor(private readonly db: Database.Database) {}

  async bootstrapOwner(): Promise<void> {
    const ownerExists = this.db
      .prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'OWNER'")
      .get() as { count: number };

    if (ownerExists.count > 0) {
      return;
    }

    await this.createUser({
      login: config.ownerLogin,
      password: config.ownerPassword,
      role: 'OWNER',
      mustChangePassword: true,
    });
  }

  private mapUser(user: Omit<UserWithPassword, 'password_hash'>): AuthenticatedUser {
    return {
      id: user.id,
      login: user.login,
      role: user.role,
      isActive: Boolean(user.is_active),
      telegramChatId: user.telegram_chat_id,
      mustChangePassword: Boolean(user.must_change_password),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  async createUser(input: CreateUserInput): Promise<AuthenticatedUser> {
    const passwordHash = await this.hashPassword(input.password);

    const transaction = this.db.transaction(() => {
      const result = this.db
        .prepare(
          `
          INSERT INTO users (login, password_hash, role, telegram_chat_id, must_change_password)
          VALUES (?, ?, ?, ?, ?)
        `,
        )
        .run(
          input.login,
          passwordHash,
          input.role,
          input.telegramChatId ?? null,
          input.mustChangePassword ? 1 : 0,
        );

      const row = this.db
        .prepare(
          `
          SELECT id, login, role, is_active, telegram_chat_id, must_change_password
          FROM users
          WHERE id = ?
        `,
        )
        .get(result.lastInsertRowid) as Omit<UserWithPassword, 'password_hash'>;

      return row;
    });

    return this.mapUser(transaction());
  }

  listUsers(): AuthenticatedUser[] {
    const rows = this.db
      .prepare(
        `
        SELECT id, login, role, is_active, telegram_chat_id, must_change_password
        FROM users
        ORDER BY created_at ASC
      `,
      )
      .all() as Omit<UserWithPassword, 'password_hash'>[];

    return rows.map((row) => this.mapUser(row));
  }

  async updateUser(userId: number, input: UpdateUserInput): Promise<AuthenticatedUser | null> {
    const existing = this.db
      .prepare(
        `
        SELECT id, login, password_hash, role, is_active, telegram_chat_id, must_change_password
        FROM users
        WHERE id = ?
      `,
      )
      .get(userId) as UserWithPassword | undefined;

    if (!existing) {
      return null;
    }

    const nextRole = input.role ?? existing.role;
    const nextActive = input.isActive === undefined ? existing.is_active : Number(input.isActive);
    const nextTelegram = input.telegramChatId === undefined ? existing.telegram_chat_id : input.telegramChatId;
    const nextMustChangePassword =
      input.mustChangePassword === undefined ? existing.must_change_password : Number(input.mustChangePassword);

    const nextPasswordHash = input.password
      ? await this.hashPassword(input.password)
      : existing.password_hash;

    this.db
      .prepare(
        `
        UPDATE users
        SET role = ?,
            is_active = ?,
            telegram_chat_id = ?,
            must_change_password = ?,
            password_hash = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `,
      )
      .run(nextRole, nextActive, nextTelegram ?? null, nextMustChangePassword, nextPasswordHash, userId);

    const updated = this.db
      .prepare(
        `
        SELECT id, login, role, is_active, telegram_chat_id, must_change_password
        FROM users
        WHERE id = ?
      `,
      )
      .get(userId) as Omit<UserWithPassword, 'password_hash'>;

    return this.mapUser(updated);
  }

  async login(login: string, password: string, meta: LoginMeta): Promise<LoginResult> {
    const user = this.db
      .prepare(
        `
        SELECT id, login, password_hash, role, is_active, telegram_chat_id, must_change_password
        FROM users
        WHERE login = ?
      `,
      )
      .get(login) as UserWithPassword | undefined;

    if (!user || !user.is_active) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const passwordOk = await argon2.verify(user.password_hash, password);
    if (!passwordOk) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const sid = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + config.sessionTtlHours * 60 * 60 * 1000).toISOString();

    this.db
      .prepare(
        `
        INSERT INTO sessions (sid, user_id, expires_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `,
      )
      .run(sid, user.id, expiresAt, meta.ipAddress ?? null, meta.userAgent ?? null);

    return {
      sid,
      user: this.mapUser(user),
    };
  }

  logoutBySid(sid: string): void {
    this.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
  }

  logoutAllForUser(userId: number): void {
    this.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = this.db
      .prepare(
        `
        SELECT id, password_hash
        FROM users
        WHERE id = ?
      `,
      )
      .get(userId) as { id: number; password_hash: string } | undefined;

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const passwordOk = await argon2.verify(user.password_hash, oldPassword);
    if (!passwordOk) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const newHash = await this.hashPassword(newPassword);

    this.db
      .prepare(
        `
        UPDATE users
        SET password_hash = ?,
            must_change_password = 0,
            updated_at = datetime('now')
        WHERE id = ?
      `,
      )
      .run(newHash, userId);
  }
}
