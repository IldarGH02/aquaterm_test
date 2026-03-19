import { Navigate, Route } from "react-router-dom";
import { HomePage } from "@pages/HomePage.tsx";
import CrmLoginPage from "../../../crm/pages/CrmLoginPage.tsx";
import RequireCrmAuth from "../../../crm/components/RequireCrmAuth";
import CrmShell from "../../../crm/components/CrmShell.tsx";
import CrmTasksPage from "../../../crm/pages/CrmTasksPage.tsx";
import RequireCrmRole from "../../../crm/components/RequireCrmRole.tsx";
import CrmDashboardPage from "../../../crm/pages/CrmDashboardPage.tsx";
import CrmUsersPage from "../../../crm/pages/CrmUsersPage.tsx";
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