import React, {FC, useCallback, useMemo, useState} from "react";

import { Button, Input, Modal, Select } from "@shared/ui";
import { TASK_PRIORITY_OPTIONS, TaskPriority } from "@features/crm-auth/types";
import type { CreateTaskInput } from "@shared/api/types";
import { crmApi } from "@shared/api/crm-api/crmApi.ts";
import {UseUsers} from "@shared/lib/hooks/crm/useUsers.tsx";
import { UseTasks } from "@/shared/lib/hooks/crm/useTasks";
import {UseTaskDetails} from "@shared/lib/hooks/crm/useTaskDetails.tsx";

interface ICreateTaskModal {
    isCreateOpen: boolean,
    setIsCreateOpen: (bool:boolean) => void
    selectedTaskId: number
}

export const CreateTaskModal: FC<ICreateTaskModal> =
    ({
        isCreateOpen,
        setIsCreateOpen,
         selectedTaskId
     }) => {

    const [createTaskForm, setCreateTaskForm] = useState<CreateTaskInput>({
        title: '',
        description: '',
        priority: 'NORMAL',
        assigneeId: null,
        dueDate: null,
    });
        const [error, setError] = useState('');
        const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);

        const { loadUsers, users } = UseUsers()
        const { loadTasks } = UseTasks()
        const { loadTaskDetails } = UseTaskDetails()

        const createAssigneeOptions = useMemo(
            () => [{ value: '', label: 'Без назначения' }, ...users.map((crmUser) => ({ value: String(crmUser.id), label: crmUser.login }))],
            [users],
        );

        const refreshAll = useCallback(async () => {
            await Promise.all([loadTasks(), loadUsers()]);
            if (selectedTaskId) {
                await loadTaskDetails(selectedTaskId);
            }
        }, [loadTaskDetails, loadTasks, loadUsers, selectedTaskId]);

        const handleCreateTask = useCallback(
            async (event: React.FormEvent) => {
                event.preventDefault();
                setIsCreateSubmitting(true);
                setError('');

                try {
                    await crmApi.createTask({
                        title: createTaskForm.title.trim(),
                        description: createTaskForm.description?.trim() || undefined,
                        priority: createTaskForm.priority,
                        assigneeId: createTaskForm.assigneeId || null,
                        dueDate: createTaskForm.dueDate || null,
                    });

                    setCreateTaskForm({
                        title: '',
                        description: '',
                        priority: 'NORMAL',
                        assigneeId: null,
                        dueDate: null,
                    });
                    setIsCreateOpen(false);
                    await refreshAll();
                } catch {
                    setError('Не удалось создать задачу.');
                } finally {
                    setIsCreateSubmitting(false);
                }
            },
            [createTaskForm, refreshAll],
        );

        return (
        <Modal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            size="lg"
            labelledBy="create-task-title">
            <div className="space-y-4">
                <h2 id="create-task-title" className="text-xl font-black uppercase text-[#1a224f]">
                    Новая задача
                </h2>

                <form className="space-y-4" onSubmit={handleCreateTask}>
                    <Input
                        id="create-task-title-input"
                        label="Название"
                        value={createTaskForm.title}
                        onChange={(event) => setCreateTaskForm((prev) => ({ ...prev, title: event.target.value }))}
                        required
                        fullWidth
                    />

                    <div>
                        <label htmlFor="create-task-description" className="mb-1.5 block text-sm font-semibold font-['Inter'] text-slate-700">
                            Описание
                        </label>
                        <textarea
                            id="create-task-description"
                            value={createTaskForm.description || ''}
                            onChange={(event) => setCreateTaskForm((prev) => ({ ...prev, description: event.target.value }))}
                            rows={4}
                            className="w-full rounded-xl border border-slate-200/60 font-['Inter'] px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-[#1a224f] focus:ring-2 focus:ring-[#1a224f]/20 shadow-sm hover:border-slate-300"
                        />
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <Select
                            id="create-task-priority"
                            label="Приоритет"
                            value={createTaskForm.priority || 'NORMAL'}
                            onChange={(event) => setCreateTaskForm((prev) => ({ ...prev, priority: event.target.value as TaskPriority }))}
                            options={TASK_PRIORITY_OPTIONS}
                            fullWidth
                        />

                        <Select
                            id="create-task-assignee"
                            label="Исполнитель"
                            value={createTaskForm.assigneeId ? String(createTaskForm.assigneeId) : ''}
                            onChange={(event) =>
                                setCreateTaskForm((prev) => ({
                                    ...prev,
                                    assigneeId: event.target.value ? Number(event.target.value) : null,
                                }))
                            }
                            options={createAssigneeOptions}
                            fullWidth
                        />

                        <Input
                            id="create-task-due"
                            label="Дедлайн"
                            type="datetime-local"
                            value={createTaskForm.dueDate ? createTaskForm.dueDate.slice(0, 16) : ''}
                            onChange={(event) =>
                                setCreateTaskForm((prev) => ({
                                    ...prev,
                                    dueDate: event.target.value ? new Date(event.target.value).toISOString() : null,
                                }))
                            }
                            fullWidth
                        />
                    </div>

                    <Button type="submit" variant="primary" isLoading={isCreateSubmitting} fullWidth>
                        Создать задачу
                    </Button>
                </form>
            </div>
        </Modal>
    )
}