import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { crmApi} from '../api/crmApi';
import { ApiError } from '../api/http';
import type { CrmUser } from '../types';

interface CrmAuthContextValue {
  user: CrmUser | null;
  isLoading: boolean;
  login: (loginValue: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CrmAuthContext = createContext<CrmAuthContextValue | null>(null);

function shouldInitAuth(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.pathname.startsWith('/crm');
}

export const CrmAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CrmUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(shouldInitAuth());

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await crmApi.me();
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 500)) {
        setUser(null);
      } else {
        console.error('Failed to refresh CRM session', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (loginValue: string, password: string) => {
    const response = await crmApi.login({ login: loginValue, password });
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await crmApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!shouldInitAuth()) {
      return;
    }

    void refresh();
  }, [refresh]);

  const value = useMemo<CrmAuthContextValue>(() => ({
    user,
    isLoading,
    login,
    logout,
    refresh,
  }), [user, isLoading, login, logout, refresh]);

  return <CrmAuthContext.Provider value={value}>{children}</CrmAuthContext.Provider>;
};

export function useCrmAuth(): CrmAuthContextValue {
  const context = useContext(CrmAuthContext);
  if (!context) {
    throw new Error('useCrmAuth must be used inside CrmAuthProvider');
  }

  return context;
}
