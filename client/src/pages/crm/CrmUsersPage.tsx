import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyRound, Loader2, ShieldUser, UserPlus2 } from 'lucide-react';
import { Button, Input, Select } from '@shared/ui';
import { crmApi } from '@shared/api/crm-api/crmApi.ts';
import { USER_ROLE_OPTIONS, type CrmUser, type UserRole } from '@features/crm-auth/types';

interface CreateUserFormState {
  login: string;
  password: string;
  role: UserRole;
  telegramChatId: string;
  mustChangePassword: boolean;
}

export const CrmUsersPage: React.FC = () => {
  const [users, setUsers] = useState<CrmUser[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPasswords, setResetPasswords] = useState<Record<number, string>>({});

  const [form, setForm] = useState<CreateUserFormState>({
    login: '',
    password: '',
    role: 'ENGINEER',
    telegramChatId: '',
    mustChangePassword: true,
  });

  const roleOptions = useMemo(
    () => USER_ROLE_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
    [],
  );

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await crmApi.listUsers();
      setUsers(response.users);
    } catch {
      setError('Не удалось загрузить пользователей.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleCreateUser = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError('');
      setIsSubmitting(true);

      try {
        await crmApi.createUser({
          login: form.login.trim(),
          password: form.password,
          role: form.role,
          telegramChatId: form.telegramChatId.trim() || null,
          mustChangePassword: form.mustChangePassword,
        });

        setForm({
          login: '',
          password: '',
          role: 'ENGINEER',
          telegramChatId: '',
          mustChangePassword: true,
        });

        await loadUsers();
      } catch {
        setError('Не удалось создать пользователя. Проверьте логин и пароль.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, loadUsers],
  );

  const updateUser = useCallback(
    async (
      userId: number,
      payload: {
        role?: UserRole;
        isActive?: boolean;
        telegramChatId?: string | null;
        password?: string;
        mustChangePassword?: boolean;
      },
    ) => {
      setError('');
      try {
        await crmApi.updateUser(userId, payload);
        await loadUsers();
      } catch {
        setError('Не удалось обновить пользователя.');
      }
    },
    [loadUsers],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#1a224f]/10 p-2 text-[#1a224f]">
            <ShieldUser className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wide text-[#1a224f]">Управление аккаунтами</h1>
            <p className="text-sm text-slate-500">Ручная выдача доступов, роли, активность и Telegram chat_id.</p>
          </div>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <UserPlus2 className="h-4 w-4" />
            Новый сотрудник
          </div>

          <form className="space-y-3" onSubmit={handleCreateUser}>
            <Input
              id="create-user-login"
              label="Логин"
              value={form.login}
              onChange={(event) => setForm((prev) => ({ ...prev, login: event.target.value }))}
              required
              fullWidth
            />

            <Input
              id="create-user-password"
              label="Пароль"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
              fullWidth
            />

            <Select
              id="create-user-role"
              label="Роль"
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
              options={roleOptions}
              fullWidth
            />

            <Input
              id="create-user-telegram"
              label="Telegram chat_id"
              value={form.telegramChatId}
              onChange={(event) => setForm((prev) => ({ ...prev, telegramChatId: event.target.value }))}
              fullWidth
            />

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.mustChangePassword}
                onChange={(event) => setForm((prev) => ({ ...prev, mustChangePassword: event.target.checked }))}
              />
              Требовать смену пароля при первом входе
            </label>

            <Button type="submit" variant="primary" isLoading={isSubmitting} fullWidth>
              Создать аккаунт
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Список сотрудников</div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загрузка пользователей...
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((crmUser) => (
                <div key={crmUser.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-900">{crmUser.login}</div>
                      <div className="text-xs text-slate-500">ID: {crmUser.id}</div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={crmUser.isActive}
                        onChange={(event) =>
                          void updateUser(crmUser.id, {
                            isActive: event.target.checked,
                          })
                        }
                      />
                      {crmUser.isActive ? 'Активен' : 'Отключен'}
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <Select
                      id={`role-${crmUser.id}`}
                      label="Роль"
                      value={crmUser.role}
                      onChange={(event) =>
                        void updateUser(crmUser.id, {
                          role: event.target.value as UserRole,
                        })
                      }
                      options={roleOptions}
                      size="sm"
                      fullWidth
                    />

                    <Input
                      id={`telegram-${crmUser.id}`}
                      label="Telegram chat_id"
                      value={crmUser.telegramChatId || ''}
                      onChange={(event) =>
                        setUsers((prev) =>
                          prev.map((item) =>
                            item.id === crmUser.id
                              ? {
                                  ...item,
                                  telegramChatId: event.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                      onBlur={(event) =>
                        void updateUser(crmUser.id, {
                          telegramChatId: event.target.value.trim() || null,
                        })
                      }
                      size="sm"
                      fullWidth
                    />

                    <div>
                      <label className="mb-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <KeyRound className="h-3.5 w-3.5" />
                        Сброс пароля
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id={`reset-password-${crmUser.id}`}
                          type="password"
                          value={resetPasswords[crmUser.id] || ''}
                          onChange={(event) =>
                            setResetPasswords((prev) => ({
                              ...prev,
                              [crmUser.id]: event.target.value,
                            }))
                          }
                          placeholder="Новый пароль"
                          size="sm"
                          fullWidth
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const password = resetPasswords[crmUser.id];
                            if (!password || password.length < 8) {
                              setError('Пароль для сброса должен быть не короче 8 символов.');
                              return;
                            }

                            void updateUser(crmUser.id, {
                              password,
                              mustChangePassword: true,
                            });
                            setResetPasswords((prev) => ({ ...prev, [crmUser.id]: '' }));
                          }}
                        >
                          Применить
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {users.length === 0 && <div className="text-sm text-slate-500">Пользователей пока нет.</div>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CrmUsersPage;
