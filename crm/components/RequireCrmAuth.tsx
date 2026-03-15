import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCrmAuth } from '@/crm/contexts/CrmAuthContext';

export const RequireCrmAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useCrmAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600">
        Загрузка CRM...
      </div>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/crm/login?next=${next}`} replace />;
  }

  return <>{children}</>;
};

export default RequireCrmAuth;
