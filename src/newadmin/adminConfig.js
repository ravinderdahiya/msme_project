import {
    Activity,
    BarChart3,
    Database,
    FileClock,
    FileText,
    Layers3,
    LayoutDashboard,
    ShieldCheck,
    Users,
} from "lucide-react";

export const iconMap = {
    "layout-dashboard": LayoutDashboard,
    users: Users,
    "layers-3": Layers3,
    database: Database,
    "bar-chart-3": BarChart3,
    "file-text": FileText,
    "file-clock": FileClock,
    "shield-check": ShieldCheck,
    activity: Activity,
};

export const statusTone = {
    Active: "success",
    Success: "success",
    Healthy: "success",
    Inactive: "muted",
    Warning: "warning",
    Blocked: "danger",
    Error: "danger",
    Info: "info",
};

export const toneIconMap = {
    blue: Users,
    green: Users,
    violet: Layers3,
    indigo: BarChart3,
    orange: FileText,
};

export const breadcrumbMap = {
    dashboard: ["Dashboard"],
    users: ["Dashboard", "Users"],
    layers: ["Dashboard", "Layers"],
    "data-services": ["Dashboard", "Data Services"],
    "api-urls": ["Dashboard", "API URLs"],
    "analysis-tools": ["Dashboard", "Analysis Tools"],
    reports: ["Dashboard", "Reports"],
    logs: ["Dashboard", "Logs"],
    "roles-permissions": ["Dashboard", "Roles & Permissions"],
    "system-health": ["Dashboard", "System Health"],
};

export const ADMIN_AVATAR_SRC = "/hepc-logo.png";

export const handleAvatarError = (event) => {
    const image = event.currentTarget;
    image.onerror = null;
    image.src = "/HARSAC-Logo.png";
};

export const deriveLayerType = (url) => {
    const value = String(url || "").toLowerCase();
    if (value.includes("mapserver")) return "MapServer";
    if (value.includes("featureserver")) return "FeatureServer";
    if (value.includes("imageserver")) return "ImageServer";
    if (value.includes("wmts")) return "WMTS";
    if (value.includes("wms")) return "WMS";
    return "REST";
};

export const formatDateLabel = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });
};
