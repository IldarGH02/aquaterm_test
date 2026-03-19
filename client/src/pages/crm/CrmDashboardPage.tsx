import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Clock3, Loader2, OctagonAlert, RefreshCcw, SquareCheck, Timer } from 'lucide-react';
import { Button } from '@shared/ui';
import { crmApi } from '@shared/api/crm-api/crmApi.ts';
import type { DashboardCompletionItem, DashboardOverview, DashboardWorkloadItem } from '@features/crm-auth/types';

const emptyOverview: DashboardOverview = {
  open: 0,
  inProgress: 0,
  blocked: 0,
  overdue: 0,
  doneToday: 0,
  doneTotal: 0,
};

interface MetricCardProps {
  title: string;
  value: number;
  tone: 'neutral' | 'blue' | 'amber' | 'red' | 'green';
  icon: React.ReactNode;
}

const toneClassMap: Record<MetricCardProps['tone'], string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-800',
  blue: 'border-blue-200 bg-blue-50 text-blue-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  red: 'border-red-200 bg-red-50 text-red-800',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, tone, icon }) => {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClassMap[tone]}`}>
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide opacity-90">
        {icon}
        {title}
      </div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  );
};

export const CrmDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview>(emptyOverview);
  const [workload, setWorkload] = useState<DashboardWorkloadItem[]>([]);
  const [completion, setCompletion] = useState<DashboardCompletionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [overviewResponse, workloadResponse, completionResponse] = await Promise.all([
        crmApi.dashboardOverview(),
        crmApi.dashboardWorkload(),
        crmApi.dashboardCompletion(),
      ]);

      setOverview(overviewResponse.overview);
      setWorkload(workloadResponse.workload);
      setCompletion(completionResponse.completion);
    } catch {
      setError('Не удалось загрузить дашборд.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const topPerformer = useMemo(() => {
    return completion.reduce<DashboardCompletionItem | null>((best, item) => {
      if (!best) {
        return item;
      }

      if (item.completedTasks > best.completedTasks) {
        return item;
      }

      return best;
    }, null);
  }, [completion]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wide text-[#1a224f]">Дашборд руководителя</h1>
            <p className="text-sm text-slate-500">Висящие задачи, просрочки, скорость команды и загрузка по ролям.</p>
          </div>

          <Button variant="secondary" leftIcon={<RefreshCcw className="h-4 w-4" />} onClick={() => void loadDashboard()}>
            Обновить
          </Button>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Открытые" value={overview.open} tone="blue" icon={<Activity className="h-4 w-4" />} />
        <MetricCard title="В работе" value={overview.inProgress} tone="neutral" icon={<Clock3 className="h-4 w-4" />} />
        <MetricCard title="Блокеры" value={overview.blocked} tone="amber" icon={<OctagonAlert className="h-4 w-4" />} />
        <MetricCard title="Просроченные" value={overview.overdue} tone="red" icon={<Timer className="h-4 w-4" />} />
        <MetricCard title="Сделано сегодня" value={overview.doneToday} tone="green" icon={<SquareCheck className="h-4 w-4" />} />
        <MetricCard title="Сделано всего" value={overview.doneTotal} tone="neutral" icon={<SquareCheck className="h-4 w-4" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Нагрузка по сотрудникам</h2>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загрузка...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-2">Сотрудник</th>
                    <th className="pb-2">Роль</th>
                    <th className="pb-2">Новые</th>
                    <th className="pb-2">В работе</th>
                    <th className="pb-2">Блокер</th>
                  </tr>
                </thead>
                <tbody>
                  {workload.map((item) => (
                    <tr key={item.userId} className="border-t border-slate-100">
                      <td className="py-2 font-semibold text-slate-800">{item.login}</td>
                      <td className="py-2 text-slate-500">{item.role}</td>
                      <td className="py-2">{item.openTasks}</td>
                      <td className="py-2">{item.inProgressTasks}</td>
                      <td className="py-2">{item.blockedTasks}</td>
                    </tr>
                  ))}

                  {workload.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-slate-500">
                        Данных пока нет.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Скорость выполнения</h2>
            <div className="space-y-2">
              {completion.map((item) => (
                <div key={item.userId} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-800">{item.login}</div>
                  <div className="mt-1 text-xs text-slate-500">Выполнено: {item.completedTasks}</div>
                  <div className="text-xs text-slate-500">Среднее время: {item.avgMinutes ?? '—'} мин</div>
                </div>
              ))}

              {completion.length === 0 && <div className="text-sm text-slate-500">Данных пока нет.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Лучший результат</h2>
            {topPerformer ? (
              <>
                <div className="text-lg font-black text-[#1a224f]">{topPerformer.login}</div>
                <div className="mt-1 text-sm text-slate-600">Закрыто задач: {topPerformer.completedTasks}</div>
                <div className="text-sm text-slate-600">Среднее время: {topPerformer.avgMinutes ?? '—'} мин</div>
              </>
            ) : (
              <div className="text-sm text-slate-500">Недостаточно данных для расчета.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrmDashboardPage;
