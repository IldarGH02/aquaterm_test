import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input } from '@shared/ui';
import { ApiError } from '../api/http';
import { useCrmAuth } from '../contexts/CrmAuthContext';

export const CrmLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useCrmAuth();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/crm', { replace: true });
    }
  }, [navigate, user]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(loginValue, password);
      const next = searchParams.get('next');
      navigate(next || '/crm', { replace: true });
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 401) {
        setError('Неверный логин или пароль.');
      } else {
        setError('Не удалось войти. Попробуйте снова.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black uppercase tracking-wide text-[#1a224f]">Вход в CRM</h1>
          <p className="mt-1 text-sm text-slate-500">АКВАТЕРМ · внутренний кабинет сотрудников</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            id="crm-login"
            label="Логин"
            value={loginValue}
            onChange={(event) => setLoginValue(event.target.value)}
            autoComplete="username"
            required
            fullWidth
          />

          <Input
            id="crm-password"
            label="Пароль"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            fullWidth
          />

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CrmLoginPage;
