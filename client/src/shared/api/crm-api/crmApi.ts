import { crmRequest } from './http.ts';
import type {
  CrmNotification,
  CrmTask,
  CrmUser,
  DashboardCompletionItem,
  DashboardOverview,
  DashboardWorkloadItem,
  TaskComment,
  TaskEvent,
  TaskPriority,
  TaskStatus,
  UserRole,
} from '@features/crm-auth/types';

export interface LoginInput {
  login: string;
  password: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number | null;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number | null;
  dueDate?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueBefore?: string;
  dueAfter?: string;
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

function buildQuery(filters: TaskFilters): string {
  const params = new URLSearchParams();

  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.assigneeId) params.set('assigneeId', String(filters.assigneeId));
  if (filters.dueBefore) params.set('dueBefore', filters.dueBefore);
  if (filters.dueAfter) params.set('dueAfter', filters.dueAfter);

  const query = params.toString();
  return query.length > 0 ? `?${query}` : '';
}

export const crmApi = {
  login: (input: LoginInput) =>
    crmRequest<{ user: CrmUser }>('/api/crm/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  logout: () =>
    crmRequest<{ ok: true }>('/api/crm/auth/logout', {
      method: 'POST',
    }),

  me: () => crmRequest<{ user: CrmUser }>('/api/crm/auth/me'),

  changePassword: (oldPassword: string, newPassword: string) =>
    crmRequest<{ ok: true }>('/api/crm/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  listTasks: (filters: TaskFilters = {}) =>
    crmRequest<{ tasks: CrmTask[] }>(`/api/crm/tasks${buildQuery(filters)}`),

  createTask: (input: CreateTaskInput) =>
    crmRequest<{ task: CrmTask }>('/api/crm/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  updateTask: (taskId: number, input: UpdateTaskInput) =>
    crmRequest<{ task: CrmTask }>(`/api/crm/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  changeTaskStatus: (taskId: number, status: TaskStatus, comment?: string) =>
    crmRequest<{ task: CrmTask }>(`/api/crm/tasks/${taskId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, comment }),
    }),

  getTaskHistory: (taskId: number) =>
    crmRequest<{ events: TaskEvent[] }>(`/api/crm/tasks/${taskId}/history`),

  listTaskComments: (taskId: number) =>
    crmRequest<{ comments: TaskComment[] }>(`/api/crm/tasks/${taskId}/comments`),

  createTaskComment: (taskId: number, message: string) =>
    crmRequest<{ comment: TaskComment }>(`/api/crm/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  dashboardOverview: () => crmRequest<{ overview: DashboardOverview }>('/api/crm/dashboard/overview'),

  dashboardWorkload: () => crmRequest<{ workload: DashboardWorkloadItem[] }>('/api/crm/dashboard/workload'),

  dashboardCompletion: () => crmRequest<{ completion: DashboardCompletionItem[] }>('/api/crm/dashboard/completion'),

  listUsers: () => crmRequest<{ users: CrmUser[] }>('/api/crm/users'),

  createUser: (input: CreateUserInput) =>
    crmRequest<{ user: CrmUser }>('/api/crm/users', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  updateUser: (userId: number, input: UpdateUserInput) =>
    crmRequest<{ user: CrmUser }>(`/api/crm/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  listNotifications: () =>
    crmRequest<{ notifications: CrmNotification[]; unreadCount: number }>('/api/crm/notifications'),

  markNotificationRead: (notificationId: number) =>
    crmRequest<{ ok: true }>(`/api/crm/notifications/${notificationId}/read`, {
      method: 'POST',
    }),
};
