import React, { useEffect, useMemo, useState } from 'react';
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
import { Button, Input, Select } from '@shared/ui';
import { useCrmAuth } from '@shared/lib/hooks/crm/useCrmAuth';
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  type TaskPriority,
  type TaskStatus,
} from '@features/crm-auth/types';
import { useTasks } from "@shared/lib/hooks/crm/useTasks.tsx";
import { UseUsers } from "@shared/lib/hooks/crm/useUsers.tsx";
import type { DeadlineFilter } from '@shared/lib/hooks/crm/useTasks.tsx'
import {
  eventLabel,
  formatDateShort,
  formatDateTime,
  getPriorityLabel,
  getStatusLabel,
  isDueThisWeek,
  isDueToday,
  isOverdue,
  priorityClasses,
  statusClasses
} from '@/shared/functions/crm';
import {CreateTaskModal} from "@entities/crm/CreateTaskModal.tsx";
import { Section } from '@/shared/ui/Section';

type DetailTab = 'CHAT' | 'HISTORY';

export const CrmTasksPage = () => {
  const { user } = useCrmAuth();
  const { users, loadUsers } = UseUsers()
  const {
      tasks,
      isLoading,
      error,
      setFilters,
      loadTasks,
      filters,
      selectedTask,
      selectedTaskId,
      setSelectedTaskId,
      summary,
      isDetailLoading,
      history,
      comments,
      statusComment,
      setStatusComment,
      isCommentSubmitting,
      chatInput,
      setChatInput,
      handleChangeStatus,
      handleSendComment,
      handleUpdateTask,

  } = useTasks()

  const [activeTab, setActiveTab] = useState<DetailTab>('CHAT');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);
  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

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

      <div className="space-y-6">
        <Section className='rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-['Outfit'] font-bold tracking-tight text-[#1a224f]">Задачи CRM</h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">Рабочий контур: приоритеты, дедлайны, чат, история.</p>
            </div>

            {canManageTasks && (
                <Button
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setIsCreateOpen(true)}
                >
                  Создать задачу
                </Button>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="group rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 px-5 py-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Всего</div>
              <div className="mt-2 text-3xl font-['Outfit'] font-bold text-slate-900">{summary.all}</div>
            </div>
            <div className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 px-5 py-4 shadow-sm transition-all hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">Открытые</div>
              <div className="mt-2 text-3xl font-['Outfit'] font-bold text-blue-700">{summary.open}</div>
            </div>
            <div className="group rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50/30 px-5 py-4 shadow-sm transition-all hover:shadow-md hover:border-red-200 hover:-translate-y-0.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-red-600">Просрочено</div>
              <div className="mt-2 text-3xl font-['Outfit'] font-bold text-red-600">{summary.overdue}</div>
            </div>
            <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 px-5 py-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Завершено</div>
              <div className="mt-2 text-3xl font-['Outfit'] font-bold text-emerald-600">{summary.done}</div>
            </div>
          </div>
        </Section>
        <Section className='rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4 text-[#1a224f]" />
            Фильтрация задач
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
        </Section>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <Section className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)] items-start">
          <div className="flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-[calc(100vh-140px)] sticky top-24">
            <div className="border-b border-slate-100 bg-white/50 px-5 py-4 backdrop-blur-md">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <ListTodo className="h-4 w-4 text-[#1a224f]" />
                Список задач ({visibleTasks.length})
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
                          className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                              selected
                                  ? 'border-[#1a224f]/40 bg-gradient-to-br from-[#1a224f]/[0.03] to-transparent shadow-md ring-1 ring-[#1a224f]/10 translate-x-1'
                                  : 'border-slate-200/60 bg-white hover:border-[#1a224f]/30 hover:shadow-[0_8px_24px_rgba(26,34,79,0.06)] hover:-translate-y-0.5'
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
                          {task.leadId !== null && (
                              <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
                          Лид #{task.leadId}
                        </span>
                          )}
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
          <div className="flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-[calc(100vh-140px)] sticky top-24">
            {!selectedTask && (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm text-slate-500">
                  <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    <ListTodo className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="max-w-[250px]">Выберите задачу из списка, чтобы увидеть детали, чат и историю.</p>
                </div>
            )}

            {selectedTask && (
                <div className="flex h-full flex-col">
                  <div className="border-b border-slate-100 bg-white/50 backdrop-blur-md px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-['Outfit'] font-bold text-[#1a224f] break-words leading-tight">{selectedTask.title}</h2>
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
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                            activeTab === 'CHAT' ? 'bg-gradient-to-r from-[#1a224f] to-[#3a4585] shadow-md shadow-[#1a224f]/20 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                    >
                  <span className="inline-flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4" />
                    Чат
                  </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('HISTORY')}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                            activeTab === 'HISTORY' ? 'bg-gradient-to-r from-[#1a224f] to-[#3a4585] shadow-md shadow-[#1a224f]/20 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                    >
                  <span className="inline-flex items-center gap-2">
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

                  <div className="border-t border-slate-100 bg-white/50 backdrop-blur-md px-6 py-4">
                    {activeTab === 'CHAT' ? (
                        isChatAllowed ? (
                            <div className="flex items-end gap-2">
                      <textarea
                          value={chatInput}
                          onChange={(event) => setChatInput(event.target.value)}
                          placeholder="Сообщение в чат задачи..."
                          rows={2}
                          className="min-h-[44px] w-full font-['Inter'] resize-y rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm outline-none transition-all duration-300 focus:border-[#1a224f] focus:ring-2 focus:ring-[#1a224f]/20 focus:bg-white shadow-sm hover:border-slate-300"
                      />
                              <Button
                                  variant="primary"
                                  onClick={() => void handleSendComment()}
                                  isLoading={isCommentSubmitting}
                                  leftIcon={<SendHorizontal className="h-4 w-4" />}
                                  className="shrink-0"
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
        </Section>
      <CreateTaskModal
          isCreateOpen={isCreateOpen}
          setIsCreateOpen={setIsCreateOpen}
          selectedTaskId={selectedTaskId}
      />
    </div>
  );
};

export default CrmTasksPage;
