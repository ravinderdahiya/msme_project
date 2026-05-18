import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./NewAdmin.css";
import NewAdminLayout from "./NewAdminLayout";
import DashboardPage from "./DashboardPage";
import UsersPage from "./UsersPage";
import LayersPage from "./LayersPage";
import DataServicesPage from "./DataServicesPage";
import ApiUrlsPage from "./ApiUrlsPage";
import AnalysisToolsPage from "./AnalysisToolsPage";
import ReportsPage from "./ReportsPage";
import LogsPage from "./LogsPage";
import RolesPermissionsPage from "./RolesPermissionsPage";
import SystemHealthPage from "./SystemHealthPage";

export default function NewAdmin() {
    return (
        <Routes>
            <Route element={<NewAdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="layers" element={<LayersPage />} />
                <Route path="data-services" element={<DataServicesPage />} />
                <Route path="api-urls" element={<ApiUrlsPage />} />
                <Route path="analysis-tools" element={<AnalysisToolsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="roles-permissions" element={<RolesPermissionsPage />} />
                <Route path="system-health" element={<SystemHealthPage />} />
            </Route>
        </Routes>
    );
}
