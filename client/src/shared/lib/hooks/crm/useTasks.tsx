import {useCallback, useEffect, useMemo, useState} from "react";
import { crmApi } from "@shared/api/crm-api/crmApi.ts";
import type {CrmTask, TaskComment, TaskEvent, TaskPriority, TaskStatus} from "@features/crm-auth/types";
import {UseUsers} from "@shared/lib/hooks/crm/useUsers.tsx";
import {isOverdue, isTaskOpen} from "@shared/functions/crm";

export type DeadlineFilter = 'ALL' | 'OVERDUE' | 'TODAY' | 'WEEK';

interface TaskFiltersState {
    status: TaskStatus | '';
    priority: TaskPriority | '';
    assigneeId: string;
    search: string;
    deadline: DeadlineFilter;
}

export const useTasks = () => {
    const { loadUsers } = UseUsers()

    const [comments, setComments] = useState<TaskComment[]>([]);
    const [statusComment, setStatusComment] = useState('');
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const [tasks, setTasks] = useState<CrmTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [history, setHistory] = useState<TaskEvent[]>([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    const [filters, setFilters] = useState<TaskFiltersState>({
        status: '',
        priority: '',
        assigneeId: '',
        search: '',
        deadline: 'ALL',
    });
    const selectedTask = useMemo(
        () => tasks.find((task) => task.id === selectedTaskId) ?? null,
        [selectedTaskId, tasks],
    );

    const loadTasks = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await crmApi.listTasks({
                status: filters.status || undefined,
                priority: filters.priority || undefined,
                assigneeId: filters.assigneeId ? Number(filters.assigneeId) : undefined,
            });
            setTasks(response.tasks);
        } catch {
            setError('Не удалось загрузить задачи.');
        } finally {
            setIsLoading(false);
        }
    }, [filters.assigneeId, filters.priority, filters.status]);
    const loadTaskDetails = useCallback(async (taskId: number) => {
        setIsDetailLoading(true);

        try {
            const [historyResponse, commentsResponse] = await Promise.all([
                crmApi.getTaskHistory(taskId),
                crmApi.listTaskComments(taskId),
            ]);
            setHistory(historyResponse.events);
            setComments(commentsResponse.comments);
        } catch {
            setHistory([]);
            setComments([]);
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    const refreshAll = useCallback(async () => {
        await Promise.all([loadTasks(), loadUsers()]);
        if (selectedTaskId) {
            await loadTaskDetails(selectedTaskId);
        }
    }, [loadTaskDetails, loadTasks, loadUsers, selectedTaskId]);

    const handleUpdateTask = useCallback(
        async (payload: { priority?: TaskPriority; assigneeId?: number | null; dueDate?: string | null }) => {
            if (!selectedTask) {
                return;
            }

            try {
                await crmApi.updateTask(selectedTask.id, payload);
                await refreshAll();
            } catch {
                setError('Не удалось обновить параметры задачи.');
            }
        },
        [refreshAll, selectedTask],
    );

    const handleChangeStatus = useCallback(
        async (status: TaskStatus) => {
            if (!selectedTask) {
                return;
            }

            try {
                await crmApi.changeTaskStatus(selectedTask.id, status, statusComment.trim() || undefined);
                setStatusComment('');
                await refreshAll();
            } catch {
                setError('Не удалось изменить статус задачи.');
            }
        },
        [refreshAll, selectedTask, statusComment],
    );

    const handleSendComment = useCallback(async () => {
        if (!selectedTask || !chatInput.trim()) {
            return;
        }

        setIsCommentSubmitting(true);
        try {
            await crmApi.createTaskComment(selectedTask.id, chatInput.trim());
            setChatInput('');
            const response = await crmApi.listTaskComments(selectedTask.id);
            setComments(response.comments);
        } catch {
            setError('Не удалось отправить комментарий.');
        } finally {
            setIsCommentSubmitting(false);
        }
    }, [chatInput, selectedTask]);

    const summary = useMemo(() => {
        return {
            all: tasks.length,
            open: tasks.filter((task) => isTaskOpen(task)).length,
            overdue: tasks.filter((task) => isOverdue(task)).length,
            done: tasks.filter((task) => task.status === 'DONE').length,
        };
    }, [tasks]);

    useEffect(() => {
        if (!selectedTaskId) {
            return;
        }

        void loadTaskDetails(selectedTaskId);
    }, [selectedTaskId, loadTaskDetails]);
    useEffect(() => {
        if (tasks.length === 0) {
            setSelectedTaskId(null);
            return;
        }

        const exists = tasks.some((task) => task.id === selectedTaskId);
        if (!exists) {
            setSelectedTaskId(tasks[0].id);
        }
    }, [selectedTaskId, tasks]);

    return {
        tasks,
        isLoading,
        error,
        setError,
        setFilters,
        loadTasks,
        loadTaskDetails,
        filters,
        selectedTaskId,
        setSelectedTaskId,
        selectedTask,
        handleUpdateTask,
        handleChangeStatus,
        handleSendComment,
        summary,
        history,
        isDetailLoading,
        comments,
        statusComment,
        setStatusComment,
        isCommentSubmitting,
        chatInput,
        setChatInput,
    }
}