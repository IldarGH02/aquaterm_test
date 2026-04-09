import type Database from 'better-sqlite3';
import type { DashboardCompletionItem, DashboardOverview, DashboardWorkloadItem } from '../types';

export class DashboardService {
  constructor(private readonly db: Database.Database) {}

  getOverview(): DashboardOverview {
    const row = this.db
      .prepare(
        `
        SELECT
          SUM(CASE WHEN status IN ('NEW', 'IN_PROGRESS', 'BLOCKED') THEN 1 ELSE 0 END) AS open,
          SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress,
          SUM(CASE WHEN status = 'BLOCKED' THEN 1 ELSE 0 END) AS blocked,
          SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END) AS done_total,
          SUM(CASE WHEN status = 'DONE' AND date(completed_at) = date('now') THEN 1 ELSE 0 END) AS done_today,
          SUM(
            CASE
              WHEN status IN ('NEW', 'IN_PROGRESS', 'BLOCKED')
                   AND due_date IS NOT NULL
                   AND due_date < datetime('now') THEN 1
              ELSE 0
            END
          ) AS overdue
        FROM tasks
      `,
      )
      .get() as {
      open: number | null;
      in_progress: number | null;
      blocked: number | null;
      overdue: number | null;
      done_today: number | null;
      done_total: number | null;
    };

    return {
      open: row.open ?? 0,
      inProgress: row.in_progress ?? 0,
      blocked: row.blocked ?? 0,
      overdue: row.overdue ?? 0,
      doneToday: row.done_today ?? 0,
      doneTotal: row.done_total ?? 0,
    };
  }

  getWorkload(): DashboardWorkloadItem[] {
    const rows = this.db
      .prepare(
        `
        SELECT
          u.id AS user_id,
          u.login,
          u.role,
          SUM(CASE WHEN t.status = 'NEW' THEN 1 ELSE 0 END) AS new_tasks,
          SUM(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_tasks,
          SUM(CASE WHEN t.status = 'BLOCKED' THEN 1 ELSE 0 END) AS blocked_tasks
        FROM users u
        LEFT JOIN tasks t ON t.assignee_id = u.id AND t.status IN ('NEW', 'IN_PROGRESS', 'BLOCKED')
        WHERE u.is_active = 1
        GROUP BY u.id, u.login, u.role
        ORDER BY (new_tasks + in_progress_tasks + blocked_tasks) DESC, u.login ASC
      `,
      )
      .all() as {
      user_id: number;
      login: string;
      role: 'OWNER' | 'MANAGER' | 'ENGINEER';
      new_tasks: number | null;
      in_progress_tasks: number | null;
      blocked_tasks: number | null;
    }[];

    return rows.map((row) => ({
      userId: row.user_id,
      login: row.login,
      role: row.role,
      openTasks: row.new_tasks ?? 0,
      inProgressTasks: row.in_progress_tasks ?? 0,
      blockedTasks: row.blocked_tasks ?? 0,
    }));
  }

  getCompletion(): DashboardCompletionItem[] {
    const rows = this.db
      .prepare(
        `
        SELECT
          u.id AS user_id,
          u.login,
          COUNT(t.id) AS completed_tasks,
          AVG(t.actual_minutes) AS avg_minutes
        FROM users u
        LEFT JOIN tasks t ON t.assignee_id = u.id AND t.status = 'DONE'
        WHERE u.is_active = 1
        GROUP BY u.id, u.login
        ORDER BY completed_tasks DESC, u.login ASC
      `,
      )
      .all() as {
      user_id: number;
      login: string;
      completed_tasks: number | null;
      avg_minutes: number | null;
    }[];

    return rows.map((row) => ({
      userId: row.user_id,
      login: row.login,
      completedTasks: row.completed_tasks ?? 0,
      avgMinutes: row.avg_minutes === null ? null : Math.round(row.avg_minutes),
    }));
  }
}
