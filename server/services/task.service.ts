import type Database from 'better-sqlite3';
import type { AuthenticatedUser, TaskPriority, TaskStatus } from '../types';
import { NotificationService } from './notification.service';

interface TaskRow {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  created_by: number | null;
  assignee_id: number | null;
  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  actual_minutes: number | null;
  lead_id: number | null;
  created_at: string;
  updated_at: string;
  created_by_login?: string | null;
  assignee_login?: string | null;
}

export interface TaskView {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdById: number | null;
  assigneeId: number | null;
  dueDate: string | null;
  startedAt: string | null;
  completedAt: string | null;
  actualMinutes: number | null;
  leadId: number | null;
  createdAt: string;
  updatedAt: string;
  createdByLogin: string | null;
  assigneeLogin: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number | null;
  dueDate?: string | null;
  leadId?: number | null;
  createdById?: number | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number | null;
  dueDate?: string | null;
}

export interface ChangeTaskStatusInput {
  status: TaskStatus;
  comment?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueBefore?: string;
  dueAfter?: string;
}

export interface TaskEventView {
  id: number;
  taskId: number;
  actorUserId: number | null;
  actorLogin: string | null;
  eventType: string;
  oldValue: string | null;
  newValue: string | null;
  comment: string | null;
  createdAt: string;
}

export interface TaskCommentView {
  id: number;
  taskId: number;
  authorUserId: number;
  authorLogin: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

function toIso(dateValue: string): string {
  if (dateValue.includes('T')) {
    return new Date(dateValue).toISOString();
  }

  return new Date(`${dateValue.replace(' ', 'T')}Z`).toISOString();
}

function computeMinutes(startAtIso: string, endAtIso: string): number {
  const start = new Date(startAtIso).getTime();
  const end = new Date(endAtIso).getTime();
  const minutes = Math.floor((end - start) / 60000);
  return Math.max(0, minutes);
}

export class TaskService {
  constructor(
    private readonly db: Database.Database,
    private readonly notificationService: NotificationService,
  ) {}

  private mapTask(task: TaskRow): TaskView {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      createdById: task.created_by,
      assigneeId: task.assignee_id,
      dueDate: task.due_date,
      startedAt: task.started_at,
      completedAt: task.completed_at,
      actualMinutes: task.actual_minutes,
      leadId: task.lead_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      createdByLogin: task.created_by_login ?? null,
      assigneeLogin: task.assignee_login ?? null,
    };
  }

  private getTaskById(taskId: number): TaskRow | undefined {
    return this.db
      .prepare(
        `
        SELECT
          t.*,
          creator.login AS created_by_login,
          assignee.login AS assignee_login
        FROM tasks t
        LEFT JOIN users creator ON creator.id = t.created_by
        LEFT JOIN users assignee ON assignee.id = t.assignee_id
        WHERE t.id = ?
      `,
      )
      .get(taskId) as TaskRow | undefined;
  }

  private assertCanManageTask(actor: AuthenticatedUser): void {
    if (actor.role === 'ENGINEER') {
      throw new Error('FORBIDDEN');
    }
  }

  private assertCanViewTask(actor: AuthenticatedUser, task: TaskRow): void {
    if (actor.role !== 'ENGINEER') {
      return;
    }

    if (task.assignee_id !== actor.id && task.created_by !== actor.id) {
      throw new Error('FORBIDDEN');
    }
  }

  private assertCanChangeStatus(actor: AuthenticatedUser, task: TaskRow, status: TaskStatus): void {
    if (actor.role === 'OWNER' || actor.role === 'MANAGER') {
      return;
    }

    if (task.assignee_id !== actor.id) {
      throw new Error('FORBIDDEN');
    }

    if (!['IN_PROGRESS', 'BLOCKED', 'DONE'].includes(status)) {
      throw new Error('FORBIDDEN');
    }
  }

  private resolveCommentRecipients(task: TaskRow, actorId: number): number[] {
    return Array.from(
      new Set(
        [task.created_by, task.assignee_id].filter(
          (userId): userId is number => typeof userId === 'number' && userId > 0 && userId !== actorId,
        ),
      ),
    );
  }

  listTasks(actor: AuthenticatedUser, filters: TaskFilters): TaskView[] {
    const whereParts: string[] = [];
    const params: Array<string | number> = [];

    if (actor.role === 'ENGINEER') {
      whereParts.push('t.assignee_id = ?');
      params.push(actor.id);
    }

    if (filters.status) {
      whereParts.push('t.status = ?');
      params.push(filters.status);
    }

    if (filters.priority) {
      whereParts.push('t.priority = ?');
      params.push(filters.priority);
    }

    if (filters.assigneeId) {
      whereParts.push('t.assignee_id = ?');
      params.push(filters.assigneeId);
    }

    if (filters.dueBefore) {
      whereParts.push('t.due_date IS NOT NULL AND t.due_date <= ?');
      params.push(filters.dueBefore);
    }

    if (filters.dueAfter) {
      whereParts.push('t.due_date IS NOT NULL AND t.due_date >= ?');
      params.push(filters.dueAfter);
    }

    const whereSql = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    const rows = this.db
      .prepare(
        `
        SELECT
          t.*,
          creator.login AS created_by_login,
          assignee.login AS assignee_login
        FROM tasks t
        LEFT JOIN users creator ON creator.id = t.created_by
        LEFT JOIN users assignee ON assignee.id = t.assignee_id
        ${whereSql}
        ORDER BY
          CASE t.priority
            WHEN 'URGENT' THEN 1
            WHEN 'HIGH' THEN 2
            WHEN 'NORMAL' THEN 3
            ELSE 4
          END,
          CASE t.status
            WHEN 'IN_PROGRESS' THEN 1
            WHEN 'BLOCKED' THEN 2
            WHEN 'NEW' THEN 3
            ELSE 4
          END,
          t.created_at DESC
      `,
      )
      .all(...params) as TaskRow[];

    return rows.map((row) => this.mapTask(row));
  }

  createTask(actor: AuthenticatedUser | null, input: CreateTaskInput): TaskView {
    if (actor) {
      this.assertCanManageTask(actor);
    }

    const nowIso = new Date().toISOString();

    const transaction = this.db.transaction(() => {
      const result = this.db
        .prepare(
          `
          INSERT INTO tasks (title, description, priority, status, created_by, assignee_id, due_date, lead_id, created_at, updated_at)
          VALUES (?, ?, ?, 'NEW', ?, ?, ?, ?, ?, ?)
        `,
        )
        .run(
          input.title,
          input.description ?? null,
          input.priority ?? 'NORMAL',
          actor?.id ?? input.createdById ?? null,
          input.assigneeId ?? null,
          input.dueDate ?? null,
          input.leadId ?? null,
          nowIso,
          nowIso,
        );

      const taskId = Number(result.lastInsertRowid);

      this.db
        .prepare(
          `
          INSERT INTO task_events (task_id, actor_user_id, event_type, new_value)
          VALUES (?, ?, 'TASK_CREATED', ?)
        `,
        )
        .run(taskId, actor?.id ?? null, JSON.stringify({ title: input.title, priority: input.priority ?? 'NORMAL' }));

      return taskId;
    });

    const taskId = transaction();
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    if (task.assignee_id && actor?.id !== task.assignee_id) {
      this.notificationService.notifyUsers(
        [task.assignee_id],
        {
          type: 'TASK_ASSIGNED',
          title: 'Новая задача',
          message: `Вам назначена задача: ${task.title}`,
          payload: { taskId: task.id, status: task.status, priority: task.priority },
        },
        'task.assigned',
        (targetUserId) => ({
          text: `Новая задача: ${task.title}. Приоритет: ${task.priority}.`,
          taskId: task.id,
          targetUserId,
        }),
      );
    }

    return this.mapTask(task);
  }

  updateTask(actor: AuthenticatedUser, taskId: number, input: UpdateTaskInput): TaskView {
    this.assertCanManageTask(actor);
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    const nextTitle = input.title ?? task.title;
    const nextDescription = input.description ?? task.description;
    const nextPriority = input.priority ?? task.priority;
    const nextAssigneeId = input.assigneeId === undefined ? task.assignee_id : input.assigneeId;
    const nextDueDate = input.dueDate === undefined ? task.due_date : input.dueDate;
    const nowIso = new Date().toISOString();

    const transaction = this.db.transaction(() => {
      this.db
        .prepare(
          `
          UPDATE tasks
          SET title = ?,
              description = ?,
              priority = ?,
              assignee_id = ?,
              due_date = ?,
              updated_at = ?
          WHERE id = ?
        `,
        )
        .run(nextTitle, nextDescription, nextPriority, nextAssigneeId ?? null, nextDueDate ?? null, nowIso, taskId);

      if (task.priority !== nextPriority) {
        this.db
          .prepare(
            `
            INSERT INTO task_events (task_id, actor_user_id, event_type, old_value, new_value)
            VALUES (?, ?, 'PRIORITY_CHANGED', ?, ?)
          `,
          )
          .run(taskId, actor.id, task.priority, nextPriority);
      }

      if (task.assignee_id !== nextAssigneeId) {
        this.db
          .prepare(
            `
            INSERT INTO task_events (task_id, actor_user_id, event_type, old_value, new_value)
            VALUES (?, ?, 'ASSIGNEE_CHANGED', ?, ?)
          `,
          )
          .run(taskId, actor.id, task.assignee_id?.toString() ?? null, nextAssigneeId?.toString() ?? null);
      }
    });

    transaction();

    const updated = this.getTaskById(taskId);
    if (!updated) {
      throw new Error('TASK_NOT_FOUND');
    }

    if (nextAssigneeId && nextAssigneeId !== actor.id && nextAssigneeId !== task.assignee_id) {
      this.notificationService.notifyUsers(
        [nextAssigneeId],
        {
          type: 'TASK_ASSIGNED',
          title: 'Изменено назначение задачи',
          message: `Вам назначена задача: ${updated.title}`,
          payload: { taskId: updated.id, status: updated.status, priority: updated.priority },
        },
        'task.assigned',
        (targetUserId) => ({
          text: `Вам назначена задача: ${updated.title}`,
          taskId: updated.id,
          targetUserId,
        }),
      );
    }

    return this.mapTask(updated);
  }

  changeStatus(actor: AuthenticatedUser, taskId: number, input: ChangeTaskStatusInput): TaskView {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    this.assertCanViewTask(actor, task);
    this.assertCanChangeStatus(actor, task, input.status);

    if (task.status === input.status && !input.comment) {
      return this.mapTask(task);
    }

    const nowIso = new Date().toISOString();
    let startedAt = task.started_at;
    let completedAt = task.completed_at;
    let actualMinutes = task.actual_minutes;

    if (input.status === 'IN_PROGRESS' && !startedAt) {
      startedAt = nowIso;
    }

    if (input.status === 'DONE') {
      completedAt = nowIso;
      const startReference = startedAt ?? task.created_at;
      actualMinutes = computeMinutes(startReference, completedAt);
    }

    if (input.status !== 'DONE' && task.status === 'DONE') {
      completedAt = null;
      actualMinutes = null;
    }

    const transaction = this.db.transaction(() => {
      this.db
        .prepare(
          `
          UPDATE tasks
          SET status = ?,
              started_at = ?,
              completed_at = ?,
              actual_minutes = ?,
              updated_at = ?
          WHERE id = ?
        `,
        )
        .run(input.status, startedAt ?? null, completedAt ?? null, actualMinutes ?? null, nowIso, taskId);

      this.db
        .prepare(
          `
          INSERT INTO task_events (task_id, actor_user_id, event_type, old_value, new_value, comment)
          VALUES (?, ?, 'STATUS_CHANGED', ?, ?, ?)
        `,
        )
        .run(taskId, actor.id, task.status, input.status, input.comment ?? null);
    });

    transaction();

    const updated = this.getTaskById(taskId);
    if (!updated) {
      throw new Error('TASK_NOT_FOUND');
    }

    if (input.status === 'DONE') {
      const ownerRows = this.db
        .prepare(`SELECT id FROM users WHERE role = 'OWNER' AND is_active = 1`)
        .all() as { id: number }[];

      const recipients = [task.created_by, ...ownerRows.map((row) => row.id)].filter(
        (userId): userId is number => typeof userId === 'number' && userId !== actor.id,
      );

      this.notificationService.notifyUsers(
        recipients,
        {
          type: 'TASK_COMPLETED',
          title: 'Задача завершена',
          message: `Задача «${updated.title}» переведена в DONE`,
          payload: {
            taskId: updated.id,
            completedBy: actor.login,
            actualMinutes: updated.actual_minutes,
          },
        },
        'task.completed',
        (targetUserId) => ({
          text: `Задача завершена: ${updated.title}. Исполнитель: ${actor.login}. Время: ${updated.actual_minutes ?? 0} мин.`,
          taskId: updated.id,
          targetUserId,
        }),
      );
    } else if (input.status !== task.status) {
      const recipients = [task.created_by, task.assignee_id].filter(
        (userId): userId is number => typeof userId === 'number' && userId !== actor.id,
      );

      this.notificationService.notifyUsers(
        recipients,
        {
          type: 'TASK_STATUS_CHANGED',
          title: 'Статус задачи обновлен',
          message: `Задача «${updated.title}»: ${task.status} → ${input.status}`,
          payload: { taskId: updated.id, oldStatus: task.status, newStatus: input.status },
        },
        'task.status.changed',
        (targetUserId) => ({
          text: `Статус задачи «${updated.title}»: ${task.status} → ${input.status}`,
          taskId: updated.id,
          targetUserId,
        }),
      );
    }

    return this.mapTask(updated);
  }

  getTaskHistory(actor: AuthenticatedUser, taskId: number): TaskEventView[] {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    this.assertCanViewTask(actor, task);

    const rows = this.db
      .prepare(
        `
        SELECT
          e.id,
          e.task_id,
          e.actor_user_id,
          u.login AS actor_login,
          e.event_type,
          e.old_value,
          e.new_value,
          e.comment,
          e.created_at
        FROM task_events e
        LEFT JOIN users u ON u.id = e.actor_user_id
        WHERE e.task_id = ?
        ORDER BY e.created_at DESC
      `,
      )
      .all(taskId) as {
      id: number;
      task_id: number;
      actor_user_id: number | null;
      actor_login: string | null;
      event_type: string;
      old_value: string | null;
      new_value: string | null;
      comment: string | null;
      created_at: string;
    }[];

    return rows.map((row) => ({
      id: row.id,
      taskId: row.task_id,
      actorUserId: row.actor_user_id,
      actorLogin: row.actor_login,
      eventType: row.event_type,
      oldValue: row.old_value,
      newValue: row.new_value,
      comment: row.comment,
      createdAt: toIso(row.created_at),
    }));
  }

  getTaskComments(actor: AuthenticatedUser, taskId: number): TaskCommentView[] {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    this.assertCanViewTask(actor, task);

    const rows = this.db
      .prepare(
        `
        SELECT
          c.id,
          c.task_id,
          c.author_user_id,
          u.login AS author_login,
          c.message,
          c.created_at,
          c.updated_at
        FROM task_comments c
        INNER JOIN users u ON u.id = c.author_user_id
        WHERE c.task_id = ?
        ORDER BY c.created_at ASC, c.id ASC
      `,
      )
      .all(taskId) as {
      id: number;
      task_id: number;
      author_user_id: number;
      author_login: string;
      message: string;
      created_at: string;
      updated_at: string;
    }[];

    return rows.map((row) => ({
      id: row.id,
      taskId: row.task_id,
      authorUserId: row.author_user_id,
      authorLogin: row.author_login,
      message: row.message,
      createdAt: toIso(row.created_at),
      updatedAt: toIso(row.updated_at),
    }));
  }

  addTaskComment(actor: AuthenticatedUser, taskId: number, message: string): TaskCommentView {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    this.assertCanViewTask(actor, task);

    const normalizedMessage = message.trim();
    if (!normalizedMessage) {
      throw new Error('INVALID_COMMENT');
    }

    const insertResult = this.db
      .prepare(
        `
        INSERT INTO task_comments (task_id, author_user_id, message)
        VALUES (?, ?, ?)
      `,
      )
      .run(taskId, actor.id, normalizedMessage);

    const comment = this.db
      .prepare(
        `
        SELECT
          c.id,
          c.task_id,
          c.author_user_id,
          u.login AS author_login,
          c.message,
          c.created_at,
          c.updated_at
        FROM task_comments c
        INNER JOIN users u ON u.id = c.author_user_id
        WHERE c.id = ?
      `,
      )
      .get(insertResult.lastInsertRowid) as {
      id: number;
      task_id: number;
      author_user_id: number;
      author_login: string;
      message: string;
      created_at: string;
      updated_at: string;
    };

    const recipients = this.resolveCommentRecipients(task, actor.id);
    if (recipients.length > 0) {
      this.notificationService.notifyUsers(
        recipients,
        {
          type: 'TASK_COMMENT',
          title: 'Новый комментарий в задаче',
          message: `${actor.login}: ${normalizedMessage.slice(0, 120)}`,
          payload: { taskId, commentId: comment.id },
        },
        'task.comment',
        (targetUserId) => ({
          text: `Комментарий к задаче «${task.title}»: ${normalizedMessage.slice(0, 200)}`,
          taskId,
          commentId: comment.id,
          targetUserId,
        }),
      );
    }

    return {
      id: comment.id,
      taskId: comment.task_id,
      authorUserId: comment.author_user_id,
      authorLogin: comment.author_login,
      message: comment.message,
      createdAt: toIso(comment.created_at),
      updatedAt: toIso(comment.updated_at),
    };
  }
}
