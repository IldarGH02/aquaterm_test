import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import CrmLoginPage from '@/crm/pages/CrmLoginPage';
import CrmShell from '@/crm/components/CrmShell';
import RequireCrmAuth from '@/crm/components/RequireCrmAuth';
import RequireCrmRole from '@/crm/components/RequireCrmRole';
import CrmTasksPage from '@/crm/pages/CrmTasksPage';
import CrmDashboardPage from '@/crm/pages/CrmDashboardPage';
import CrmUsersPage from '@/crm/pages/CrmUsersPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/crm/login" element={<CrmLoginPage />} />

      <Route
        path="/crm"
        element={
          <RequireCrmAuth>
            <CrmShell />
          </RequireCrmAuth>
        }
      >
        <Route index element={<CrmTasksPage />} />
        <Route
          path="dashboard"
          element={
            <RequireCrmRole roles={['OWNER', 'MANAGER']}>
              <CrmDashboardPage />
            </RequireCrmRole>
          }
        />
        <Route
          path="users"
          element={
            <RequireCrmRole roles={['OWNER']}>
              <CrmUsersPage />
            </RequireCrmRole>
          }
        />
        <Route path="*" element={<Navigate to="/crm" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
