export type UserRole = 'OWNER' | 'MANAGER' | 'ENGINEER';

export type TaskStatus = 'NEW' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELED';

export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type NotificationType = 'TASK_ASSIGNED' | 'TASK_STATUS_CHANGED' | 'TASK_COMPLETED' | 'TASK_COMMENT' | 'SYSTEM';

export interface CrmUser {
  id: number;
  login: string;
  role: UserRole;
  isActive: boolean;
  telegramChatId: string | null;
  mustChangePassword: boolean;
}

export interface CrmTask {
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

export interface TaskEvent {
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

export interface TaskComment {
  id: number;
  taskId: number;
  authorUserId: number;
  authorLogin: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmNotification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  payload: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface DashboardOverview {
  open: number;
  inProgress: number;
  blocked: number;
  overdue: number;
  doneToday: number;
  doneTotal: number;
}

export interface DashboardWorkloadItem {
  userId: number;
  login: string;
  role: UserRole;
  openTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
}

export interface DashboardCompletionItem {
  userId: number;
  login: string;
  completedTasks: number;
  avgMinutes: number | null;
}

export const TASK_STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: 'NEW', label: 'Новая' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'BLOCKED', label: 'Блокер' },
  { value: 'DONE', label: 'Выполнена' },
  { value: 'CANCELED', label: 'Отменена' },
];

export const TASK_PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: 'LOW', label: 'Низкий' },
  { value: 'NORMAL', label: 'Обычный' },
  { value: 'HIGH', label: 'Высокий' },
  { value: 'URGENT', label: 'Срочный' },
];

export const USER_ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: 'OWNER', label: 'Руководитель' },
  { value: 'MANAGER', label: 'Менеджер' },
  { value: 'ENGINEER', label: 'Инженер' },
];
