import React, { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    FileClock,
    LocateFixed,
    Search,
    ShieldAlert,
    ShieldX,
    UserCheck,
    Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { getAdminUserSessions, getAdminUsers, updateAdminUserStatus } from "../services/adminUserService";
import ActionButtons from "./components/ActionButtons";
import DeviceInfo from "./components/DeviceInfo";
import MapModal from "./components/MapModal";
import Modal from "./components/Modal";
import SessionTable from "./components/SessionTable";
import SessionTimeline from "./components/SessionTimeline";
import StatsCard from "./components/StatsCard";
import StatusBadge from "./components/StatusBadge";
import UsersTable from "./components/UsersTable";

const PAGE_SIZE = 8;

function formatDateTime(value) {
    if (!value) return "-";
    if (typeof value === "string" && Number.isNaN(new Date(value).getTime())) return value;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function parseDevice(userAgent = "") {
    const ua = String(userAgent || "");
    const browser =
        /Edg\//i.test(ua) ? "Edge" :
            /Firefox\//i.test(ua) ? "Firefox" :
                /Safari\//i.test(ua) && !/Chrome\//i.test(ua) ? "Safari" :
                    /Chrome\//i.test(ua) ? "Chrome" : "Browser";
    const versionMatch = ua.match(/(?:Chrome|Firefox|Version|Edg)\/([\d.]+)/i);
    const platform =
        /Android/i.test(ua) ? "Android" :
            /iPhone|iPad|iOS/i.test(ua) ? "iOS" :
                /Mac OS|Macintosh/i.test(ua) ? "macOS" :
                    /Windows/i.test(ua) ? "Windows" : "Device";
    return {
        browser,
        browserVersion: versionMatch?.[1]?.split(".")?.[0] || "",
        platform,
    };
}

function getSessionDuration(loginAt, logoutAt, isActive) {
    if (isActive) return "Active now";
    const start = new Date(loginAt);
    const end = new Date(logoutAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "-";
    const minutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function normalizeSession(session = {}) {
    const device = parseDevice(session.userAgent);
    const latitude = Number(session.latitude || 0);
    const longitude = Number(session.longitude || 0);
    return {
        ...session,
        id: session.id || session._id || `session-${Math.random()}`,
        userId: session.userId,
        browser: session.browser || device.browser,
        browserVersion: session.browserVersion || device.browserVersion,
        platform: session.platform || device.platform,
        ipAddress: session.ipAddress || session.ip || "-",
        latitude,
        longitude,
        location: session.location || (latitude && longitude ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : "Location unavailable"),
        loginAt: formatDateTime(session.loginAt),
        logoutAt: session.logoutAt ? formatDateTime(session.logoutAt) : null,
        duration: session.duration || getSessionDuration(session.loginAt, session.logoutAt, Boolean(session.isActive)),
        accuracy: session.accuracy || "-",
        isActive: Boolean(session.isActive),
        userAgent: session.userAgent || "-",
    };
}

function normalizeUser(user = {}) {
    const fullname = user.fullname || user.name || user.fullName || "Unknown User";
    return {
        ...user,
        id: user.id || user._id,
        fullname,
        email: user.email || "-",
        mobile: user.mobile || user.phone || "-",
        role: user.role || "User",
        department: user.department || "MSME GIS Portal",
        status: user.status || (user.isActive ? "Active" : "Inactive"),
        lastActive: user.lastActive || formatDateTime(user.lastActiveAt || user.updatedAt || user.createdAt),
        createdAt: user.createdAt ? formatDateTime(user.createdAt) : "-",
        sessions: Array.isArray(user.sessions) ? user.sessions.map(normalizeSession) : [],
    };
}

export default function UsersPage() {
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, blocked: 0 });
    const [roleOptions, setRoleOptions] = useState(["All"]);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [mapSession, setMapSession] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAdminUsers({
                page,
                limit: PAGE_SIZE,
                search: query,
                role: roleFilter,
                status: statusFilter,
            });
            const nextRows = Array.isArray(data.users) ? data.users.map(normalizeUser) : [];
            const pagination = data.pagination || {};
            const apiSummary = data.summary || {};

            setRows(nextRows);
            setSummary({
                total: apiSummary.totalUsers ?? pagination.total ?? nextRows.length,
                active: apiSummary.activeUsers ?? nextRows.filter((user) => user.status === "Active").length,
                inactive: apiSummary.inactiveUsers ?? nextRows.filter((user) => user.status === "Inactive").length,
                blocked: apiSummary.blockedUsers ?? nextRows.filter((user) => user.status === "Blocked").length,
            });
            setRoleOptions(data.filters?.roleOptions || ["All", ...new Set(nextRows.map((user) => user.role))]);
            setTotalUsers(pagination.total ?? nextRows.length);
            setTotalPages(Math.max(1, pagination.totalPages || 1));
        } catch (err) {
            console.error(err);
            setRows([]);
            setError(err?.response?.data?.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(loadUsers, 300);
        return () => window.clearTimeout(timer);
    }, [page, query, roleFilter, statusFilter]);

    const loadUserSessions = async (user) => {
        if (!user?.id) return [];
        const data = await getAdminUserSessions(user.id, { page: 1, limit: 50 });
        const sessions = Array.isArray(data.sessions)
            ? data.sessions
            : Array.isArray(data.sessionLogs)
                ? data.sessionLogs
                : [];
        return sessions.map(normalizeSession);
    };

    const openDetails = async (user) => {
        const baseUser = normalizeUser(user);
        setSelectedUser(baseUser);
        try {
            setDetailsLoading(true);
            const sessions = await loadUserSessions(baseUser);
            setSelectedUser({ ...baseUser, sessions });
        } catch (err) {
            console.error(err);
            setSelectedUser({ ...baseUser, sessions: [] });
        } finally {
            setDetailsLoading(false);
        }
    };

    const openLocation = async (user) => {
        try {
            const sessions = user.sessions?.length ? user.sessions : await loadUserSessions(user);
            const session = sessions.find((item) => item.latitude && item.longitude) || sessions[0];
            if (session) {
                setMapSession(session);
                return;
            }
            window.alert("No location session found for this user.");
        } catch (err) {
            console.error(err);
            window.alert("Unable to load user location.");
        }
    };

    const handleBlockUser = async (user) => {
        if (!user?.id) return;
        try {
            setActionLoading(true);
            await updateAdminUserStatus(user.id, { status: "Blocked", role: user.role });
            await loadUsers();
            if (selectedUser?.id === user.id) {
                setSelectedUser((current) => current ? { ...current, status: "Blocked" } : current);
            }
        } catch (err) {
            console.error(err);
            window.alert(err?.response?.data?.message || "Failed to block user.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetSessions = async (user) => {
        if (!user?.id) return;
        try {
            setActionLoading(true);
            await updateAdminUserStatus(user.id, { status: "Inactive", role: user.role });
            const sessions = await loadUserSessions(user);
            setSelectedUser((current) => current ? { ...current, status: "Inactive", sessions } : current);
            await loadUsers();
        } catch (err) {
            console.error(err);
            window.alert(err?.response?.data?.message || "Failed to reset user sessions.");
        } finally {
            setActionLoading(false);
        }
    };

    const from = rows.length ? (page - 1) * PAGE_SIZE + 1 : 0;
    const to = rows.length ? from + rows.length - 1 : 0;

    return (
        <div className="space-y-5">
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase text-blue-700 ring-1 ring-blue-100">
                            <ShieldAlert size={14} />
                            GIS Security Monitoring
                        </div>
                        <h2 className="text-2xl font-black text-slate-950">User Monitoring & Session Tracking</h2>
                        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                            One click complete user monitoring with session intelligence, device context, and ArcGIS location tracking.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <label className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm sm:w-80">
                            <Search size={17} />
                            <input type="search" className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" placeholder="Search users, email, role..." value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} />
                        </label>
                        <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition hover:border-blue-300" value={roleFilter} onChange={(event) => { setPage(1); setRoleFilter(event.target.value); }}>
                            {roleOptions.map((role) => <option key={role} value={role}>{role === "All" ? "All Roles" : role}</option>)}
                        </select>
                        <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition hover:border-blue-300" value={statusFilter} onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }}>
                            {["All", "Active", "Inactive", "Blocked"].map((status) => <option key={status} value={status}>{status === "All" ? "All Status" : status}</option>)}
                        </select>
                    </div>
                </div>
            </motion.section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatsCard icon={Users} label="Total Users" value={summary.total} tone="blue" trend="+Live" />
                <StatsCard icon={UserCheck} label="Active Users" value={summary.active} tone="green" trend="+Live" />
                <StatsCard icon={FileClock} label="Inactive Users" value={summary.inactive} tone="orange" trend="+Live" />
                <StatsCard icon={ShieldX} label="Blocked Users" value={summary.blocked} tone="violet" trend="+Live" />
            </section>

            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[22px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-950">Monitored Users</h3>
                        <p className="text-sm font-medium text-slate-500">Session-aware user activity and GIS location controls</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        <LocateFixed size={14} />
                        {totalUsers} live records
                    </span>
                </div>
                {loading ? (
                    <div className="grid gap-3">
                        {[0, 1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-bold text-rose-700">{error}</div>
                ) : (
                    <UsersTable
                        users={rows}
                        onDetails={openDetails}
                        onLocation={openLocation}
                        onDelete={(user) => window.alert(`Delete endpoint is not configured for ${user.fullname}.`)}
                        footer={
                            <>
                                <span>Showing {from} to {to} of {totalUsers} monitored users</span>
                                <div className="flex items-center gap-2">
                                    <button type="button" className="h-9 rounded-xl border border-slate-200 px-3 font-bold transition hover:bg-slate-50 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Prev</button>
                                    <span className="grid h-9 min-w-9 place-items-center rounded-xl bg-blue-600 px-3 font-bold text-white">{page}</span>
                                    <button type="button" className="h-9 rounded-xl border border-slate-200 px-3 font-bold transition hover:bg-slate-50 disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
                                </div>
                            </>
                        }
                    />
                )}
            </motion.section>

            <UserModal
                user={selectedUser}
                loading={detailsLoading}
                actionLoading={actionLoading}
                onClose={() => setSelectedUser(null)}
                onViewMap={setMapSession}
                onSessionInfo={setSessionInfo}
                onReset={handleResetSessions}
                onBlock={handleBlockUser}
            />
            <MapModal session={mapSession} open={Boolean(mapSession)} onClose={() => setMapSession(null)} />
            <SessionInfoModal session={sessionInfo} onClose={() => setSessionInfo(null)} />
        </div>
    );
}

function UserModal({ user, loading, actionLoading, onClose, onViewMap, onSessionInfo, onReset, onBlock }) {
    if (!user) return null;

    const sessions = user.sessions || [];
    const activeSessions = sessions.filter((session) => session.isActive).length;
    const lastLogout = sessions.find((session) => session.logoutAt)?.logoutAt || "-";

    return (
        <Modal open={Boolean(user)} title="User Intelligence Profile" onClose={onClose} size="max-w-7xl">
            <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
                <aside className="space-y-5">
                    <section className="rounded-[22px] border border-slate-200 bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-xl">
                        <div className="relative grid h-20 w-20 place-items-center rounded-[24px] bg-white/10 text-2xl font-black ring-1 ring-white/20">
                            {getInitials(user.fullname)}
                            <span className={`absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-slate-950 ${user.status === "Active" ? "bg-emerald-400" : user.status === "Blocked" ? "bg-rose-500" : "bg-slate-400"}`} />
                        </div>
                        <h3 className="mt-5 text-2xl font-black">{user.fullname}</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/15">{user.role}</span>
                            <StatusBadge status={user.status} />
                        </div>
                    </section>

                    <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-black uppercase text-slate-500">User Information</h3>
                        <div className="grid gap-4">
                            <Detail label="User ID" value={user.id} />
                            <Detail label="Email" value={user.email} />
                            <Detail label="Mobile" value={user.mobile} />
                            <Detail label="Role" value={user.role} />
                            <Detail label="Status" value={<StatusBadge status={user.status} />} />
                            <Detail label="Last Active" value={user.lastActive} />
                            <Detail label="Created At" value={user.createdAt} />
                        </div>
                    </section>

                    <ActionButtons
                        onDetails={() => {}}
                        onLocation={() => sessions[0] ? onViewMap(sessions[0]) : window.alert("No session location found.")}
                        onReset={() => onReset(user)}
                        onBlock={() => onBlock(user)}
                        onDelete={() => window.alert("Delete endpoint is not configured.")}
                    />
                    {actionLoading ? <p className="text-sm font-bold text-blue-600">Processing admin action...</p> : null}
                </aside>

                <main className="space-y-5">
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MiniStat icon={Users} label="Total Sessions" value={loading ? "..." : sessions.length} tone="blue" />
                        <MiniStat icon={UserCheck} label="Active Sessions" value={loading ? "..." : activeSessions} tone="green" />
                        <MiniStat icon={CalendarDays} label="Last Login" value={loading ? "..." : sessions[0]?.loginAt || "-"} tone="violet" />
                        <MiniStat icon={FileClock} label="Last Logout" value={loading ? "..." : lastLogout} tone="orange" />
                    </section>

                    <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-base font-black text-slate-950">Recent Sessions</h3>
                                <p className="text-sm font-medium text-slate-500">Device, browser, IP and location trail</p>
                            </div>
                        </div>
                        {loading ? (
                            <div className="grid gap-3">
                                {[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}
                            </div>
                        ) : (
                            <SessionTable sessions={sessions} onViewMap={onViewMap} onSessionInfo={onSessionInfo} />
                        )}
                    </section>

                    {!loading ? <SessionTimeline sessions={sessions} onViewMap={onViewMap} onSessionInfo={onSessionInfo} /> : null}
                </main>
            </div>
        </Modal>
    );
}

function SessionInfoModal({ session, onClose }) {
    return (
        <Modal open={Boolean(session)} title="Session Information" onClose={onClose} size="max-w-3xl">
            {session ? (
                <div className="space-y-5">
                    <div className="rounded-[22px] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-5">
                        <DeviceInfo browser={session.browser} version={session.browserVersion} platform={session.platform} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Detail label="Login Time" value={session.loginAt} />
                        <Detail label="Logout Time" value={session.logoutAt || "-"} />
                        <Detail label="Session Duration" value={session.duration} />
                        <Detail label="Device / Browser" value={`${session.browser} ${session.browserVersion} / ${session.platform}`} />
                        <Detail label="IP Address" value={session.ipAddress} />
                        <Detail label="Latitude" value={session.latitude || "-"} />
                        <Detail label="Longitude" value={session.longitude || "-"} />
                        <Detail label="Session ID" value={session.id} />
                        <Detail label="Status" value={<StatusBadge status={session.isActive ? "Active" : "Logged Out"} />} />
                        <div className="sm:col-span-2">
                            <Detail label="User Agent" value={session.userAgent} />
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}

function MiniStat({ icon: Icon, label, value, tone }) {
    const tones = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${tones[tone]}`}>
                    <Icon size={19} />
                </div>
                <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-500">{label}</span>
                    <strong className="mt-1 block truncate text-sm text-slate-950">{value}</strong>
                </div>
            </div>
        </article>
    );
}

function Detail({ label, value }) {
    return (
        <div className="grid gap-1 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <span className="text-[11px] font-black uppercase text-slate-500">{label}</span>
            <span className="break-words text-sm font-bold text-slate-900">{value}</span>
        </div>
    );
}

function getInitials(name = "") {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}
