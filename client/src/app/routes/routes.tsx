import { Navigate, Route } from "react-router-dom";
import { HomePage } from "@pages/HomePage/HomePage.tsx";
import CrmLoginPage from "@pages/crm/CrmLoginPage.tsx";
import RequireCrmAuth from "@features/crm-auth/ui/RequireCrmAuth.tsx";
import CrmShell from "@pages/crm/CrmShell.tsx";
import CrmTasksPage from "@pages/crm/CrmTasksPage.tsx";
import RequireCrmRole from "@features/crm-auth/ui/RequireCrmRole.tsx";
import CrmDashboardPage from "@pages/crm/CrmDashboardPage.tsx";
import CrmUsersPage from "@pages/crm/CrmUsersPage.tsx";
import React from "react";
import { Routes } from 'react-router-dom'

export const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

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
    )
}