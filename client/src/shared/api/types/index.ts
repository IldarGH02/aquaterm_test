import type {TaskPriority, TaskStatus, UserRole} from "@features/crm-auth/types";

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