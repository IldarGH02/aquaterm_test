import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  CircleAlert,
  Clock3,
  Filter,
  ListTodo,
  Loader2,
  MessageSquareText,
  Plus,
  Search,
  SendHorizontal,
  UserRound,
} from 'lucide-react';
import { Button, Input, Modal, Select } from '@/components/ui';
import { crmApi } from '@/crm/api/crmApi';
import type { CreateTaskInput } from '@/crm/api/crmApi';
import { useCrmAuth } from '@/crm/contexts/CrmAuthContext';
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  type CrmTask,
  type CrmUser,
  type TaskComment,
  type TaskEvent,
  type TaskPriority,
  type TaskStatus,
} from '@/crm/types';

type DeadlineFilter = 'ALL' | 'OVERDUE' | 'TODAY' | 'WEEK';
type DetailTab = 'CHAT' | 'HISTORY';

interface TaskFiltersState {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  assigneeId: string;
  search: string;
  deadline: DeadlineFilter;
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(new Date(value));
}

function formatDateShort(value: string | null): string {
  if (!value) {
    return 'Без дедлайна';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(new Date(value));
}

function isTaskOpen(task: CrmTask): boolean {
  return task.status === 'NEW' || task.status === 'IN_PROGRESS' || task.status === 'BLOCKED';
}

function isOverdue(task: CrmTask): boolean {
  if (!task.dueDate || !isTaskOpen(task)) {
    return false;
  }

  return new Date(task.dueDate).getTime() < Date.now();
}

function isDueToday(task: CrmTask): boolean {
  if (!task.dueDate) {
    return false;
  }

  const due = new Date(task.dueDate);
  const now = new Date();

  return due.getFullYear() === now.getFullYear() && due.getMonth() === now.getMonth() && due.getDate() === now.getDate();
}

function isDueThisWeek(task: CrmTask): boolean {
  if (!task.dueDate) {
    return false;
  }

  const dueTime = new Date(task.dueDate).getTime();
  const now = Date.now();
  const week = now + 7 * 24 * 60 * 60 * 1000;

  return dueTime >= now && dueTime <= week;
}

function statusClasses(status: TaskStatus): string {
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

function priorityClasses(priority: TaskPriority): string {
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

function getStatusLabel(status: TaskStatus): string {
  return TASK_STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

function getPriorityLabel(priority: TaskPriority): string {
  return TASK_PRIORITY_OPTIONS.find((item) => item.value === priority)?.label ?? priority;
}

function eventLabel(eventType: string): string {
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

export const CrmTasksPage: React.FC = () => {
  const { user } = useCrmAuth();
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [users, setUsers] = useState<CrmUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [history, setHistory] = useState<TaskEvent[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<DetailTab>('CHAT');
  const [statusComment, setStatusComment] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);

  const [filters, setFilters] = useState<TaskFiltersState>({
    status: '',
    priority: '',
    assigneeId: '',
    search: '',
    deadline: 'ALL',
  });

  const [createTaskForm, setCreateTaskForm] = useState<CreateTaskInput>({
    title: '',
    description: '',
    priority: 'NORMAL',
    assigneeId: null,
    dueDate: null,
  });

  const canManageTasks = user?.role === 'OWNER' || user?.role === 'MANAGER';

  const assigneeOptions = useMemo(
    () => [
      { value: '', label: 'Все исполнители' },
      ...users.map((crmUser) => ({ value: String(crmUser.id), label: `${crmUser.login} (${crmUser.role})` })),
    ],
    [users],
  );

  const createAssigneeOptions = useMemo(
    () => [{ value: '', label: 'Без назначения' }, ...users.map((crmUser) => ({ value: String(crmUser.id), label: crmUser.login }))],
    [users],
  );

  const loadUsers = useCallback(async () => {
    try {
      const response = await crmApi.listUsers();
      setUsers(response.users);
    } catch {
      setUsers([]);
    }
  }, []);

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

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

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

  useEffect(() => {
    if (!selectedTaskId) {
      return;
    }

    void loadTaskDetails(selectedTaskId);
  }, [selectedTaskId, loadTaskDetails]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks],
  );

  const visibleTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const bySearch =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query) ||
        (task.assigneeLogin || '').toLowerCase().includes(query);

      if (!bySearch) {
        return false;
      }

      if (filters.deadline === 'OVERDUE') {
        return isOverdue(task);
      }

      if (filters.deadline === 'TODAY') {
        return isDueToday(task);
      }

      if (filters.deadline === 'WEEK') {
        return isDueThisWeek(task);
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const aOverdue = isOverdue(a) ? 1 : 0;
      const bOverdue = isOverdue(b) ? 1 : 0;
      if (aOverdue !== bOverdue) {
        return bOverdue - aOverdue;
      }

      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      if (aDue !== bDue) {
        return aDue - bDue;
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filters.deadline, filters.search, tasks]);

  const summary = useMemo(() => {
    return {
      all: tasks.length,
      open: tasks.filter((task) => isTaskOpen(task)).length,
      overdue: tasks.filter((task) => isOverdue(task)).length,
      done: tasks.filter((task) => task.status === 'DONE').length,
    };
  }, [tasks]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadTasks(), loadUsers()]);
    if (selectedTaskId) {
      await loadTaskDetails(selectedTaskId);
    }
  }, [loadTaskDetails, loadTasks, loadUsers, selectedTaskId]);

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

  const isChatAllowed = useMemo(() => {
    if (!selectedTask || !user) {
      return false;
    }

    if (user.role === 'OWNER' || user.role === 'MANAGER') {
      return true;
    }

    return selectedTask.createdById === user.id || selectedTask.assigneeId === user.id;
  }, [selectedTask, user]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wide text-[#1a224f]">Задачи CRM</h1>
            <p className="text-sm text-slate-500">Минималистичный рабочий контур: приоритеты, дедлайны, чат, история.</p>
          </div>

          {canManageTasks && (
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsCreateOpen(true)}>
              Создать задачу
            </Button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Всего</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{summary.all}</div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-blue-500">Открытые</div>
            <div className="mt-1 text-2xl font-black text-blue-700">{summary.open}</div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-red-500">Просрочено</div>
            <div className="mt-1 text-2xl font-black text-red-700">{summary.overdue}</div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-emerald-500">Завершено</div>
            <div className="mt-1 text-2xl font-black text-emerald-700">{summary.done}</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="h-4 w-4" />
          Фильтры
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          <Input
            id="task-search"
            label="Поиск"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Название, описание, исполнитель"
            leftIcon={<Search className="h-4 w-4" />}
            fullWidth
          />

          <Select
            id="task-filter-status"
            label="Статус"
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value as TaskStatus | '' }))}
            options={TASK_STATUS_OPTIONS}
            placeholder="Все статусы"
            fullWidth
          />

          <Select
            id="task-filter-priority"
            label="Приоритет"
            value={filters.priority}
            onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value as TaskPriority | '' }))}
            options={TASK_PRIORITY_OPTIONS}
            placeholder="Все приоритеты"
            fullWidth
          />

          <Select
            id="task-filter-assignee"
            label="Исполнитель"
            value={filters.assigneeId}
            onChange={(event) => setFilters((prev) => ({ ...prev, assigneeId: event.target.value }))}
            options={assigneeOptions}
            placeholder="Все исполнители"
            fullWidth
          />

          <Select
            id="task-filter-deadline"
            label="Дедлайны"
            value={filters.deadline}
            onChange={(event) => setFilters((prev) => ({ ...prev, deadline: event.target.value as DeadlineFilter }))}
            options={[
              { value: 'ALL', label: 'Все' },
              { value: 'OVERDUE', label: 'Просроченные' },
              { value: 'TODAY', label: 'На сегодня' },
              { value: 'WEEK', label: 'На неделю' },
            ]}
            fullWidth
          />
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ListTodo className="h-4 w-4" />
              Лента задач ({visibleTasks.length})
            </div>
          </div>

          <div className="max-h-[72vh] overflow-y-auto p-3">
            {isLoading && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Загрузка задач...
              </div>
            )}

            {!isLoading && visibleTasks.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                По текущим фильтрам задач нет.
              </div>
            )}

            <div className="space-y-2">
              {visibleTasks.map((task) => {
                const selected = task.id === selectedTaskId;
                const overdue = isOverdue(task);

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setActiveTab('CHAT');
                    }}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selected
                        ? 'border-[#1a224f] bg-[#1a224f]/5 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-900">{task.title}</div>
                      {overdue && <CircleAlert className="mt-0.5 h-4 w-4 text-red-600" />}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClasses(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                      <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${priorityClasses(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <div className="inline-flex items-center gap-1">
                        <UserRound className="h-3.5 w-3.5" />
                        {task.assigneeLogin || 'Без исполнителя'}
                      </div>
                      <div className={`inline-flex items-center gap-1 ${overdue ? 'font-semibold text-red-600' : ''}`}>
                        <CalendarClock className="h-3.5 w-3.5" />
                        {formatDateShort(task.dueDate)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!selectedTask && (
            <div className="flex min-h-[320px] items-center justify-center p-6 text-center text-sm text-slate-500">
              Выберите задачу из списка, чтобы увидеть детали, чат и историю.
            </div>
          )}

          {selectedTask && (
            <div className="flex h-full max-h-[72vh] flex-col">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-[#1a224f]">{selectedTask.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedTask.description || 'Описание отсутствует'}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(selectedTask.status)}`}>
                      {getStatusLabel(selectedTask.status)}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClasses(selectedTask.priority)}`}>
                      {getPriorityLabel(selectedTask.priority)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                    <div className="font-semibold text-slate-700">Постановщик</div>
                    <div className="mt-1">{selectedTask.createdByLogin || 'Система'}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                    <div className="font-semibold text-slate-700">Исполнитель</div>
                    <div className="mt-1">{selectedTask.assigneeLogin || 'Не назначен'}</div>
                  </div>
                  <div className={`rounded-lg p-3 text-xs ${isOverdue(selectedTask) ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-600'}`}>
                    <div className="font-semibold">Дедлайн</div>
                    <div className="mt-1">{formatDateTime(selectedTask.dueDate)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                    <div className="font-semibold text-slate-700">Время выполнения</div>
                    <div className="mt-1">{selectedTask.actualMinutes ?? '—'} мин</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select
                      id="detail-status"
                      label="Статус"
                      value={selectedTask.status}
                      onChange={(event) => void handleChangeStatus(event.target.value as TaskStatus)}
                      options={TASK_STATUS_OPTIONS}
                      fullWidth
                    />

                    {canManageTasks ? (
                      <Select
                        id="detail-priority"
                        label="Приоритет"
                        value={selectedTask.priority}
                        onChange={(event) =>
                          void handleUpdateTask({
                            priority: event.target.value as TaskPriority,
                          })
                        }
                        options={TASK_PRIORITY_OPTIONS}
                        fullWidth
                      />
                    ) : (
                      <Input id="detail-priority-readonly" label="Приоритет" value={getPriorityLabel(selectedTask.priority)} disabled fullWidth />
                    )}

                    {canManageTasks ? (
                      <Select
                        id="detail-assignee"
                        label="Исполнитель"
                        value={selectedTask.assigneeId ? String(selectedTask.assigneeId) : ''}
                        onChange={(event) =>
                          void handleUpdateTask({
                            assigneeId: event.target.value ? Number(event.target.value) : null,
                          })
                        }
                        options={createAssigneeOptions}
                        fullWidth
                      />
                    ) : (
                      <Input id="detail-assignee-readonly" label="Исполнитель" value={selectedTask.assigneeLogin || 'Не назначен'} disabled fullWidth />
                    )}

                    {canManageTasks ? (
                      <Input
                        id="detail-due-date"
                        label="Дедлайн"
                        type="datetime-local"
                        value={selectedTask.dueDate ? selectedTask.dueDate.slice(0, 16) : ''}
                        onChange={(event) =>
                          void handleUpdateTask({
                            dueDate: event.target.value ? new Date(event.target.value).toISOString() : null,
                          })
                        }
                        fullWidth
                      />
                    ) : (
                      <Input id="detail-due-date-readonly" label="Дедлайн" value={formatDateShort(selectedTask.dueDate)} disabled fullWidth />
                    )}
                  </div>

                  <div>
                    <Input
                      id="detail-status-comment"
                      label="Комментарий к смене статуса"
                      value={statusComment}
                      onChange={(event) => setStatusComment(event.target.value)}
                      placeholder="Опционально: причина, контекст, договоренности"
                      fullWidth
                    />
                    <p className="mt-2 text-xs text-slate-500">Комментарий привяжется к следующему изменению статуса.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('CHAT')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    activeTab === 'CHAT' ? 'bg-[#1a224f] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4" />
                    Чат
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('HISTORY')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    activeTab === 'HISTORY' ? 'bg-[#1a224f] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" />
                    История
                  </span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {isDetailLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Загрузка деталей задачи...
                  </div>
                )}

                {!isDetailLoading && activeTab === 'CHAT' && (
                  <div className="space-y-3">
                    {comments.length === 0 && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        В чате пока нет сообщений.
                      </div>
                    )}

                    {comments.map((comment) => {
                      const mine = comment.authorUserId === user?.id;

                      return (
                        <div key={comment.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                              mine ? 'bg-[#1a224f] text-white' : 'border border-slate-200 bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className={`mb-1 text-[11px] ${mine ? 'text-slate-200' : 'text-slate-500'}`}>
                              {comment.authorLogin} · {formatDateTime(comment.createdAt)}
                            </div>
                            <div className="whitespace-pre-wrap">{comment.message}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isDetailLoading && activeTab === 'HISTORY' && (
                  <div className="space-y-3">
                    {history.length === 0 && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        История изменений пока пуста.
                      </div>
                    )}

                    {history.map((event) => (
                      <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-800">{eventLabel(event.eventType)}</div>
                          <div className="text-[11px] text-slate-500">{formatDateTime(event.createdAt)}</div>
                        </div>

                        <div className="mt-1 text-xs text-slate-500">{event.actorLogin || 'Система'}</div>
                        {(event.oldValue || event.newValue) && (
                          <div className="mt-2 text-xs text-slate-600">
                            {event.oldValue || '—'} → {event.newValue || '—'}
                          </div>
                        )}
                        {event.comment && <div className="mt-2 text-xs text-slate-700">Комментарий: {event.comment}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 px-5 py-3">
                {activeTab === 'CHAT' ? (
                  isChatAllowed ? (
                    <div className="flex items-end gap-2">
                      <textarea
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        placeholder="Сообщение в чат задачи"
                        rows={2}
                        className="min-h-[44px] w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#1a224f] focus:ring-2 focus:ring-[#1a224f]/20"
                      />
                      <Button
                        variant="primary"
                        onClick={() => void handleSendComment()}
                        isLoading={isCommentSubmitting}
                        leftIcon={<SendHorizontal className="h-4 w-4" />}
                      >
                        Отправить
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">Комментирование доступно участникам задачи и руководителям.</div>
                  )
                ) : (
                  <div className="text-xs text-slate-500">История обновляется автоматически после изменения параметров задачи.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} size="lg" labelledBy="create-task-title">
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
              <label htmlFor="create-task-description" className="mb-1 block text-sm font-semibold text-gray-700">
                Описание
              </label>
              <textarea
                id="create-task-description"
                value={createTaskForm.description || ''}
                onChange={(event) => setCreateTaskForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#1a224f] focus:ring-2 focus:ring-[#1a224f]/20"
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
    </div>
  );
};

export default CrmTasksPage;
