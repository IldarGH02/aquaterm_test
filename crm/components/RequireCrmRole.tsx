import React from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '../types';
import { useCrmAuth } from '../contexts/CrmAuthContext';

interface RequireCrmRoleProps {
  roles: UserRole[];
  children: React.ReactNode;
}

export const RequireCrmRole: React.FC<RequireCrmRoleProps> = ({ roles, children }) => {
  const { user } = useCrmAuth();

  if (!user) {
    return <Navigate to="/crm/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/crm" replace />;
  }

  return <>{children}</>;
};

export default RequireCrmRole;
