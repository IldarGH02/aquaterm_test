import {CrmTask, TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS, TaskPriority, TaskStatus} from "@features/crm-auth/types";

export function formatDateShort(value: string | null): string {
    if (!value) {
        return 'Без дедлайна';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Europe/Moscow',
    }).format(new Date(value));
}

export function isTaskOpen(task: CrmTask): boolean {
    return task.status === 'NEW' || task.status === 'IN_PROGRESS' || task.status === 'BLOCKED';
}

export function isOverdue(task: CrmTask): boolean {
    if (!task.dueDate || !isTaskOpen(task)) {
        return false;
    }

    return new Date(task.dueDate).getTime() < Date.now();
}

export function isDueToday(task: CrmTask): boolean {
    if (!task.dueDate) {
        return false;
    }

    const due = new Date(task.dueDate);
    const now = new Date();

    return due.getFullYear() === now.getFullYear() && due.getMonth() === now.getMonth() && due.getDate() === now.getDate();
}

export function isDueThisWeek(task: CrmTask): boolean {
    if (!task.dueDate) {
        return false;
    }

    const dueTime = new Date(task.dueDate).getTime();
    const now = Date.now();
    const week = now + 7 * 24 * 60 * 60 * 1000;

    return dueTime >= now && dueTime <= week;
}

export function statusClasses(status: TaskStatus): string {
    switch (status) {
        case 'NEW':
            return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'IN_PROGRESS':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'BLOCKED':
            return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'DONE':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'CANCELED':
            return 'bg-rose-100 text-rose-700 border-rose-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
}

export function priorityClasses(priority: TaskPriority): string {
    switch (priority) {
        case 'LOW':
            return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'NORMAL':
            return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        case 'HIGH':
            return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'URGENT':
            return 'bg-red-100 text-red-700 border-red-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
}

export function getStatusLabel(status: TaskStatus): string {
    return TASK_STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

export function getPriorityLabel(priority: TaskPriority): string {
    return TASK_PRIORITY_OPTIONS.find((item) => item.value === priority)?.label ?? priority;
}

export function eventLabel(eventType: string): string {
    switch (eventType) {
        case 'TASK_CREATED':
            return 'Задача создана';
        case 'STATUS_CHANGED':
            return 'Статус изменен';
        case 'PRIORITY_CHANGED':
            return 'Приоритет изменен';
        case 'ASSIGNEE_CHANGED':
            return 'Исполнитель изменен';
        default:
            return eventType;
    }
}

export function formatDateTime(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Moscow',
    }).format(new Date(value));
}