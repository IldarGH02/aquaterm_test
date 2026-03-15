export const USER_ROLES = ['OWNER', 'MANAGER', 'ENGINEER'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const TASK_STATUSES = ['NEW', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const NOTIFICATION_TYPES = ['TASK_ASSIGNED', 'TASK_STATUS_CHANGED', 'TASK_COMPLETED', 'TASK_COMMENT', 'SYSTEM'] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface CrmUser {
  id: number;
  login: string;
  role: UserRole;
  is_active: number;
  telegram_chat_id: string | null;
  must_change_password: number;
  created_at: string;
  updated_at: string;
}

export interface CrmTask {
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
}

export interface AuthenticatedUser {
  id: number;
  login: string;
  role: UserRole;
  isActive: boolean;
  telegramChatId: string | null;
  mustChangePassword: boolean;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueBefore?: string;
  dueAfter?: string;
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
