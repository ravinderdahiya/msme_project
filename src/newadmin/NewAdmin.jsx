import React from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
    Activity,
    BarChart3,
    Bell,
    ChevronDown,
    CircleAlert,
    Database,
    Eye,
    FileClock,
    FileText,
    Layers3,
    LayoutDashboard,
    Plus,
    Search,
    Settings2,
    ShieldCheck,
    UserCog,
    Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./NewAdmin.css";
import {
    analysisTools,
    chartPoints,
    healthStats,
    layers,
    logs,
    newAdminNavItems,
    permissions,
    recentAnalyses,
    reports,
    roles,
    services,
    servicesHealth,
    statCards,
    systemEvents,
    users,
} from "./newAdminData";

const iconMap = {
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

const statusTone = {
    Active: "success",
    Success: "success",
    Healthy: "success",
    Inactive: "muted",
    Warning: "warning",
    Blocked: "danger",
    Error: "danger",
    Info: "info",
};

const toneIconMap = {
    blue: Users,
    green: Users,
    violet: Layers3,
    indigo: BarChart3,
    orange: FileText,
};

const breadcrumbMap = {
    dashboard: ["Dashboard"],
    users: ["Dashboard", "Users"],
    layers: ["Dashboard", "Layers"],
    "data-services": ["Dashboard", "Data Services"],
    "analysis-tools": ["Dashboard", "Analysis Tools"],
    reports: ["Dashboard", "Reports"],
    logs: ["Dashboard", "Logs"],
    "roles-permissions": ["Dashboard", "Roles & Permissions"],
    "system-health": ["Dashboard", "System Health"],
};

function NewAdminLayout() {
    const location = useLocation();
    const currentKey = location.pathname.split("/").filter(Boolean).at(-1) || "dashboard";
    const breadcrumbs = breadcrumbMap[currentKey] || ["Dashboard"];

    return (
        <div className="new-admin-shell">
            <aside className="new-admin-sidebar">
                <div className="new-admin-brand">
                    <div className="new-admin-brand-mark">
                        <img src="/hepc-logo.png" alt="MSME" />
                    </div>
                    <div>
                        <strong>MSME</strong>
                        <span>Investor GIS</span>
                    </div>
                </div>

                <nav className="new-admin-nav">
                    {newAdminNavItems.map((item) => {
                        const Icon = iconMap[item.icon];
                        return (
                            <NavLink
                                key={item.key}
                                to={`/newadmin/${item.key}`}
                                className={({ isActive }) =>
                                    `new-admin-nav-link${isActive ? " is-active" : ""}`
                                }
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="new-admin-sidebar-footer">
                    <div className="new-admin-user-card">
                        <img src="/admin-avatar.jpg" alt="Admin User" />
                        <div>
                            <strong>Admin User</strong>
                            <span>Super Admin</span>
                        </div>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </aside>

            <section className="new-admin-main">
                <header className="new-admin-topbar">
                    <div>
                        <h1>{breadcrumbs[breadcrumbs.length - 1]}</h1>
                        <p>{breadcrumbs.join(" / ")}</p>
                    </div>

                    <div className="new-admin-topbar-actions">
                        <label className="new-admin-search">
                            <Search size={16} />
                            <input type="text" placeholder="Search anything..." />
                        </label>
                        <button type="button" className="new-admin-icon-btn" aria-label="Notifications">
                            <Bell size={18} />
                            <span className="new-admin-dot" />
                        </button>
                        <div className="new-admin-profile-pill">
                            <img src="/admin-avatar.jpg" alt="Admin User" />
                            <div>
                                <strong>Admin User</strong>
                                <span>Super Admin</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </header>

                <main className="new-admin-content">
                    <Outlet />
                </main>
            </section>
        </div>
    );
}

function StatGrid({ items = statCards }) {
    return (
        <div className="new-admin-stat-grid">
            {items.map((item) => {
                const Icon = toneIconMap[item.tone] || Users;
                return (
                    <article key={item.label} className={`new-admin-stat-card tone-${item.tone}`}>
                        <div className="new-admin-stat-icon">
                            <Icon size={18} />
                        </div>
                        <div>
                            <p>{item.label}</p>
                            <h3>{item.value}</h3>
                            <span>{item.change} from last month</span>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

function Card({ title, subtitle, action, children, className = "" }) {
    return (
        <section className={`new-admin-card ${className}`.trim()}>
            {(title || action) && (
                <div className="new-admin-card-head">
                    <div>
                        {title ? <h3>{title}</h3> : null}
                        {subtitle ? <p>{subtitle}</p> : null}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </section>
    );
}

function StatusPill({ value }) {
    return <span className={`status-pill ${statusTone[value] || "info"}`}>{value}</span>;
}

function Toolbar({ placeholder, filters = [], cta = "Add New" }) {
    return (
        <div className="new-admin-toolbar">
            <label className="new-admin-search toolbar-search">
                <Search size={16} />
                <input type="text" placeholder={placeholder} />
            </label>
            <div className="new-admin-toolbar-right">
                {filters.map((filter) => (
                    <button key={filter} type="button" className="new-admin-filter-btn">
                        <span>{filter}</span>
                        <ChevronDown size={16} />
                    </button>
                ))}
                <button type="button" className="new-admin-primary-btn">
                    <Plus size={16} />
                    <span>{cta}</span>
                </button>
            </div>
        </div>
    );
}

function DataTable({ columns, rows, renderRow, footer }) {
    return (
        <div className="new-admin-table-wrap">
            <table className="new-admin-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{rows.map(renderRow)}</tbody>
            </table>
            {footer ? <div className="new-admin-table-footer">{footer}</div> : null}
        </div>
    );
}

function MiniMapThumb({ index }) {
    return (
        <div className={`mini-map-thumb map-tone-${index % 4}`}>
            <div className="mini-map-road" />
            <div className="mini-map-node node-a" />
            <div className="mini-map-node node-b" />
            <div className="mini-map-node node-c" />
        </div>
    );
}

function DashboardPage() {
    return (
        <>
            <StatGrid />
            <div className="new-admin-grid two-one">
                <Card title="Recent Analyses" action={<button type="button" className="new-admin-text-btn">View All</button>}>
                    <div className="analysis-list">
                        {recentAnalyses.map((item, index) => (
                            <div key={item.title} className="analysis-item">
                                <MiniMapThumb index={index} />
                                <div>
                                    <strong>{item.title}</strong>
                                    <span>{item.location}</span>
                                    <small>{item.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Analysis Overview" action={<button type="button" className="new-admin-filter-btn small">This Month <ChevronDown size={14} /></button>}>
                    <div className="chart-area">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartPoints}>
                                <defs>
                                    <linearGradient id="analysesFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="reportsFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#e8edf5" vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="analyses" stroke="#2563eb" fill="url(#analysesFill)" strokeWidth={3} />
                                <Area type="monotone" dataKey="reports" stroke="#10b981" fill="url(#reportsFill)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Top Layers Used">
                    <div className="donut-wrap">
                        <div className="donut-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Roads", value: 35, fill: "#2563eb" },
                                            { name: "Industries", value: 22, fill: "#60a5fa" },
                                            { name: "Power Stations", value: 15, fill: "#34d399" },
                                            { name: "Schools", value: 10, fill: "#f59e0b" },
                                            { name: "Hospitals", value: 8, fill: "#f97316" },
                                            { name: "Others", value: 10, fill: "#94a3b8" },
                                        ]}
                                        innerRadius={48}
                                        outerRadius={76}
                                        paddingAngle={3}
                                        dataKey="value"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-center">
                                <strong>156</strong>
                                <span>Total</span>
                            </div>
                        </div>

                        <div className="donut-legend">
                            {[
                                ["Roads", "35%", "#2563eb"],
                                ["Industries", "22%", "#60a5fa"],
                                ["Power Stations", "15%", "#34d399"],
                                ["Schools", "10%", "#f59e0b"],
                                ["Hospitals", "8%", "#f97316"],
                                ["Others", "10%", "#94a3b8"],
                            ].map(([label, value, color]) => (
                                <div key={label} className="legend-row">
                                    <span><i style={{ backgroundColor: color }} />{label}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="new-admin-grid one-one">
                <Card title="Reports Summary">
                    <div className="report-summary-list">
                        <div className="report-summary-items">
                            {reports.map((item) => (
                                <div key={item.name} className="summary-row">
                                    <span>{item.name}</span>
                                    <strong>{item.count}</strong>
                                    <small>{item.delta}</small>
                                </div>
                            ))}
                        </div>
                        <div className="summary-ring">
                            <div>
                                <strong>612</strong>
                                <span>Total</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="System Health">
                    <div className="event-list">
                        {systemEvents.map((event) => (
                            <div key={event.event} className="event-row">
                                <div className="event-copy">
                                    <CircleAlert size={15} />
                                    <div>
                                        <strong>{event.event}</strong>
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                                <StatusPill value={event.status} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
}

function UsersPage() {
    return (
        <>
            <StatGrid items={[
                { label: "Total Users", value: "1,248", change: "+12%", tone: "blue" },
                { label: "Active Users", value: "842", change: "+8%", tone: "green" },
                { label: "Inactive Users", value: "156", change: "+3%", tone: "orange" },
                { label: "Blocked Users", value: "42", change: "+1%", tone: "violet" },
            ]} />
            <Card>
                <Toolbar placeholder="Search users..." filters={["All Roles", "All Status"]} cta="Add User" />
                <DataTable
                    columns={["Name", "Email", "Role", "Status", "Last Active", "Actions"]}
                    rows={users}
                    renderRow={(user) => (
                        <tr key={user.email}>
                            <td className="entity-cell"><img src="/admin-avatar.jpg" alt={user.name} /><span>{user.name}</span></td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td><StatusPill value={user.status} /></td>
                            <td>{user.lastActive}</td>
                            <td className="actions-cell"><button type="button"><Eye size={15} /></button><button type="button"><Settings2 size={15} /></button></td>
                        </tr>
                    )}
                    footer={<><span>Showing 1 to 8 of 1,248 users</span><div className="pager"><button>{`<`}</button><button className="active">1</button><button>2</button><button>3</button><button>{`>`}</button></div></>}
                />
            </Card>
        </>
    );
}

function LayersPage() {
    return (
        <Card>
            <Toolbar placeholder="Search layers..." filters={["All Categories", "All Types", "All Status"]} cta="Add Layer" />
            <DataTable
                columns={["Layer Name", "Category", "Type", "Status", "Last Updated", "Actions"]}
                rows={layers}
                renderRow={(item) => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.type}</td>
                        <td><StatusPill value={item.status} /></td>
                        <td>{item.updated}</td>
                        <td className="actions-cell"><button type="button"><Eye size={15} /></button><button type="button"><Settings2 size={15} /></button></td>
                    </tr>
                )}
                footer={<><span>Showing 1 to 8 of 156 layers</span><div className="pager"><button>{`<`}</button><button className="active">1</button><button>2</button><button>3</button><button>{`>`}</button></div></>}
            />
        </Card>
    );
}

function DataServicesPage() {
    return (
        <Card>
            <Toolbar placeholder="Search services..." filters={["All Services", "All Status"]} cta="Add Service" />
            <DataTable
                columns={["Service Name", "Service Type", "Endpoint URL", "Status", "Last Checked"]}
                rows={services}
                renderRow={(item) => (
                    <tr key={item.name + item.endpoint}>
                        <td>{item.name}</td>
                        <td>{item.serviceType}</td>
                        <td className="mono-cell">{item.endpoint}</td>
                        <td><StatusPill value={item.status} /></td>
                        <td>{item.checked}</td>
                    </tr>
                )}
                footer={<span>Showing 1 to 7 of 7 services</span>}
            />
        </Card>
    );
}

function AnalysisToolsPage() {
    return (
        <div className="new-admin-grid one-one">
            <Card title="Analysis Tool Performance" subtitle="Execution volume, success rate, and average processing time.">
                <DataTable
                    columns={["Tool", "Runs", "Success Rate", "Average Time"]}
                    rows={analysisTools}
                    renderRow={(item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.runs}</td>
                            <td>{item.success}</td>
                            <td>{item.avgTime}</td>
                        </tr>
                    )}
                />
            </Card>
            <Card title="Monthly Analysis Trend">
                <div className="chart-area tall">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartPoints}>
                            <defs>
                                <linearGradient id="toolTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#e8edf5" vertical={false} />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="analyses" stroke="#0f766e" fill="url(#toolTrend)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}

function ReportsPage() {
    return (
        <div className="new-admin-grid one-one">
            <Card title="Reports Summary">
                <div className="report-kpi-grid">
                    {reports.map((item) => (
                        <div key={item.name} className="report-kpi-card">
                            <span>{item.name}</span>
                            <strong>{item.count}</strong>
                            <small>{item.delta}</small>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Recent Reports">
                <DataTable
                    columns={["Report Type", "Count", "Growth"]}
                    rows={reports}
                    renderRow={(item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.count}</td>
                            <td>{item.delta}</td>
                        </tr>
                    )}
                />
            </Card>
        </div>
    );
}

function LogsPage() {
    return (
        <Card title="System Logs" subtitle="Track recent platform events and issues.">
            <DataTable
                columns={["Level", "Message", "Timestamp"]}
                rows={logs}
                renderRow={(item) => (
                    <tr key={item.message}>
                        <td><StatusPill value={item.level} /></td>
                        <td>{item.message}</td>
                        <td>{item.time}</td>
                    </tr>
                )}
            />
        </Card>
    );
}

function RolesPermissionsPage() {
    return (
        <div className="new-admin-grid compact-sidebar">
            <Card title="Roles">
                <div className="role-list">
                    {roles.map((role) => (
                        <div key={role.role} className="role-row">
                            <div>
                                <strong>{role.role}</strong>
                                <span>{role.users} Users</span>
                            </div>
                            <UserCog size={16} />
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Permissions - Admin">
                <div className="permissions-list">
                    {permissions.map((group) => (
                        <div key={group.heading} className="permission-group">
                            <strong>{group.heading}</strong>
                            {group.items.map((item) => (
                                <label key={item} className="permission-check">
                                    <input type="checkbox" defaultChecked />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function SystemHealthPage() {
    return (
        <div className="new-admin-grid one-one">
            <Card title="Server Overview">
                <div className="report-kpi-grid">
                    {healthStats.map((item) => (
                        <div key={item.label} className="report-kpi-card">
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                            <small className={`tone-${item.tone}`}>Current</small>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Service Health">
                <DataTable
                    columns={["Service Name", "Status", "Response Time", "Last Checked"]}
                    rows={servicesHealth}
                    renderRow={(item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td><StatusPill value={item.status} /></td>
                            <td>{item.response}</td>
                            <td>{item.checked}</td>
                        </tr>
                    )}
                />
            </Card>
        </div>
    );
}

export default function NewAdmin() {
    return (
        <Routes>
            <Route element={<NewAdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="layers" element={<LayersPage />} />
                <Route path="data-services" element={<DataServicesPage />} />
                <Route path="analysis-tools" element={<AnalysisToolsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="roles-permissions" element={<RolesPermissionsPage />} />
                <Route path="system-health" element={<SystemHealthPage />} />
            </Route>
        </Routes>
    );
}
