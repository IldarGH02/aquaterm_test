import { useCallback, useState } from "react";
import { crmApi } from "@shared/api/crm-api/crmApi.ts";
import type {CrmTask, TaskPriority, TaskStatus} from "@features/crm-auth/types";

export type DeadlineFilter = 'ALL' | 'OVERDUE' | 'TODAY' | 'WEEK';

interface TaskFiltersState {
    status: TaskStatus | '';
    priority: TaskPriority | '';
    assigneeId: string;
    search: string;
    deadline: DeadlineFilter;
}

export const UseTasks = () => {
    const [tasks, setTasks] = useState<CrmTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState<TaskFiltersState>({
        status: '',
        priority: '',
        assigneeId: '',
        search: '',
        deadline: 'ALL',
    });

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

    return {
        tasks, isLoading, error, setError, setFilters, loadTasks, filters
    }
}