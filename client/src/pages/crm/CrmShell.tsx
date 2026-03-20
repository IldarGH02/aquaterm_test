import { useCallback, useEffect, useMemo, useState, FC } from 'react';
import { Bell, ChartColumnStacked, LogOut, SquareKanban, UserCog2, X } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { crmApi } from '@shared/api/crm-api/crmApi.ts';
import { useCrmAuth } from '@shared/lib/hooks/crm/useCrmAuth';
import type { CrmNotification } from '@features/crm-auth/types';

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(new Date(value));
}

function navClass(isActive: boolean): string {
  return isActive
    ? 'flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#1a224f] to-[#3a4585] px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#1a224f]/20 transition-all duration-300'
    : 'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all duration-300';
}

export const CrmShell: FC = () => {
  const { user, logout } = useCrmAuth();
  const [notifications, setNotifications] = useState<CrmNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await crmApi.listNotifications();
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const id = setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => clearInterval(id);
  }, [loadNotifications]);

  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        await crmApi.markNotificationRead(notificationId);
        await loadNotifications();
      } catch (error) {
        console.error('Failed to mark notification as read', error);
      }
    },
    [loadNotifications],
  );

  const navItems = useMemo(() => {
    if (!user) {
      return [];
    }

    const items = [
      { to: '/crm', label: 'Задачи', icon: SquareKanban, end: true },
    ];

    if (user.role === 'OWNER' || user.role === 'MANAGER') {
      items.push({ to: '/crm/dashboard', label: 'Дашборд', icon: ChartColumnStacked, end: false });
    }

    if (user.role === 'OWNER') {
      items.push({ to: '/crm/users', label: 'Пользователи', icon: UserCog2, end: false });
    }

    return items;
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Inter'] selection:bg-[#1a224f]/10 selection:text-[#1a224f]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200/60 bg-white/80 backdrop-blur-xl p-5 lg:flex lg:flex-col lg:justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navClass(isActive)}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <button
            type="button"
            onClick={() => {
              void logout();
            }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl lg:px-8 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-['Outfit'] font-bold uppercase tracking-widest text-[#1a224f]">АКВАТЕРМ CRM</div>
                <div className="truncate text-xs font-medium text-slate-500 mt-0.5">{user?.login} <span className="text-slate-300 px-1">•</span> {user?.role}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-slate-300 hover:text-[#1a224f] hover:shadow-md"
                  aria-label="Уведомления"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d71e1e] px-1 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void logout();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:hidden"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => navClass(isActive)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm transition-all duration-300 flex justify-end" onClick={() => setIsNotificationsOpen(false)}>
          <div
            className="flex h-full w-full max-w-md flex-col bg-white shadow-[[-20px_0_40px_rgba(0,0,0,0.05)]] transition-transform duration-300"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-800">Уведомления</div>
                <div className="text-xs text-slate-500">Непрочитанных: {unreadCount}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {notifications.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">Уведомлений пока нет.</div>
              )}

              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    if (!notification.readAt) {
                      void markAsRead(notification.id);
                    }
                  }}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    notification.readAt
                      ? 'border-slate-200 bg-slate-50 text-slate-500'
                      : 'border-[#1a224f]/20 bg-[#1a224f]/5 text-slate-800'
                  }`}
                >
                  <div className="text-sm font-semibold">{notification.title}</div>
                  <div className="mt-1 text-xs">{notification.message}</div>
                  <div className="mt-2 text-[11px] text-slate-400">{formatDateTime(notification.createdAt)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmShell;
