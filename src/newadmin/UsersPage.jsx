import React, { useEffect, useState } from "react";
import {
    Activity,
    CalendarDays,
    Eye,
    FileClock,
    Search,
    ShieldX,
    Trash2,
    UserCheck,
    Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { getAdminUserSessions, getAdminUsers } from "../services/adminUserService";
import MapModal from "./components/MapModal";
import Modal from "./components/Modal";
import SessionTable from "./components/SessionTable";
import StatsCard from "./components/StatsCard";
import StatusBadge from "./components/StatusBadge";
import Table from "./components/Table";

const PAGE_SIZE = 5;

function getStatus(user) {
    if (user.status) return user.status;
    if (user.isBlocked) return "Blocked";
    return user.isActive ? "Active" : "Inactive";
}

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

function normalizeUser(user) {
    const fullname = user.fullname || user.name || user.fullName || "Unknown User";
    return {
        ...user,
        id: user.id || user._id,
        fullname,
        email: user.email || "-",
        mobile: user.mobile || user.phone || "-",
        role: user.role || "User",
        status: user.status || getStatus(user),
        lastActive: user.lastActive || formatDateTime(user.lastActiveAt || user.updatedAt),
        createdAt: user.createdAt ? formatDateTime(user.createdAt) : "-",
    };
}

function normalizeSession(session) {
    return {
        ...session,
        id: session.id || session._id,
        userId: session.userId,
        ipAddress: session.ipAddress || session.ip || "-",
        latitude: Number(session.latitude || 0),
        longitude: Number(session.longitude || 0),
        userAgent: session.userAgent || session.device || "-",
        loginAt: formatDateTime(session.loginAt),
        logoutAt: session.logoutAt ? formatDateTime(session.logoutAt) : null,
        isActive: Boolean(session.isActive),
        location: session.location || "-",
    };
}

function getInitials(name = "") {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function UsersPage() {
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        blocked: 0,
    });
    const [roleOptions, setRoleOptions] = useState(["All"]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessionsError, setSessionsError] = useState("");
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sessionsUser, setSessionsUser] = useState(null);
    const [mapSession, setMapSession] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null);

    useEffect(() => {
        let ignore = false;

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

                if (ignore) return;

                const usersPayload = Array.isArray(data.users) ? data.users : [];
                const normalizedRows = usersPayload.map(normalizeUser);
                const pagination = data.pagination || {};
                const apiSummary = data.summary || {};

                setRows(normalizedRows);
                setSummary({
                    total: apiSummary.totalUsers ?? pagination.total ?? normalizedRows.length,
                    active: apiSummary.activeUsers ?? normalizedRows.filter((user) => getStatus(user) === "Active").length,
                    inactive: apiSummary.inactiveUsers ?? normalizedRows.filter((user) => getStatus(user) === "Inactive").length,
                    blocked: apiSummary.blockedUsers ?? normalizedRows.filter((user) => getStatus(user) === "Blocked").length,
                });
                setRoleOptions(data.filters?.roleOptions || ["All", ...new Set(normalizedRows.map((user) => user.role))]);
                setTotalUsers(pagination.total ?? normalizedRows.length);
                setTotalPages(Math.max(1, pagination.totalPages || Math.ceil((pagination.total || normalizedRows.length) / PAGE_SIZE)));
            } catch (err) {
                if (ignore) return;
                console.error(err);
                setRows([]);
                setError(err?.response?.data?.message || "Failed to load users from backend.");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        const timer = window.setTimeout(loadUsers, 250);
        return () => {
            ignore = true;
            window.clearTimeout(timer);
        };
    }, [page, query, roleFilter, statusFilter]);

    const pageRows = rows;
    const from = pageRows.length ? (page - 1) * PAGE_SIZE + 1 : 0;
    const to = pageRows.length ? from + pageRows.length - 1 : 0;

    const handleFilterChange = (setter) => (event) => {
        setter(event.target.value);
        setPage(1);
    };

    const openSessions = async (user) => {
        setSessionsUser(user);
        setSelectedSessions([]);
        setSessionsError("");
        try {
            setSessionsLoading(true);
            const data = await getAdminUserSessions(user.id);
            const sessionsPayload = Array.isArray(data.sessions)
                ? data.sessions
                : Array.isArray(data.sessionLogs)
                    ? data.sessionLogs
                    : Array.isArray(data.logs)
                        ? data.logs
                        : [];
            setSelectedSessions(sessionsPayload.map(normalizeSession));
        } catch (err) {
            console.error(err);
            setSessionsError(err?.response?.data?.message || "Failed to load session activity from backend.");
        } finally {
            setSessionsLoading(false);
        }
    };

    const sessionStats = {
        total: selectedSessions.length,
        active: selectedSessions.filter((session) => session.isActive).length,
        lastLogin: selectedSessions[0]?.loginAt || "-",
        lastLogout: selectedSessions.find((session) => session.logoutAt)?.logoutAt || "-",
    };

    return (
        <div className="space-y-5">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatsCard icon={Users} label="Total Users" value={summary.total} tone="blue" />
                <StatsCard icon={UserCheck} label="Active Users" value={summary.active} tone="green" />
                <StatsCard icon={FileClock} label="Inactive Users" value={summary.inactive} tone="orange" />
                <StatsCard icon={ShieldX} label="Blocked Users" value={summary.blocked} tone="violet" />
            </section>

            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[22px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur"
            >
                <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <label className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm lg:max-w-sm">
                        <Search size={17} />
                        <input
                            type="search"
                            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            placeholder="Search users..."
                            value={query}
                            onChange={handleFilterChange(setQuery)}
                        />
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-blue-300" value={roleFilter} onChange={handleFilterChange(setRoleFilter)}>
                            {roleOptions.map((role) => <option key={role} value={role}>{role === "All" ? "All Roles" : role}</option>)}
                        </select>
                        <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-blue-300" value={statusFilter} onChange={handleFilterChange(setStatusFilter)}>
                            {["All", "Active", "Inactive", "Blocked"].map((status) => <option key={status} value={status}>{status === "All" ? "All Status" : status}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-3">
                        {[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}
                    </div>
                ) : (
                    <Table
                        columns={["Name", "Email", "Role", "Status", "Last Active", "Actions"]}
                        isEmpty={!pageRows.length}
                        emptyMessage={error || "No users match the current search or filters."}
                        footer={
                            <>
                                <span>Showing {from} to {to} of {totalUsers} users</span>
                                <div className="flex items-center gap-2">
                                    <button type="button" className="h-9 rounded-xl border border-slate-200 px-3 font-semibold transition hover:bg-slate-50 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Prev</button>
                                    <span className="grid h-9 min-w-9 place-items-center rounded-xl bg-blue-600 px-3 font-bold text-white">{page}</span>
                                    <button type="button" className="h-9 rounded-xl border border-slate-200 px-3 font-semibold transition hover:bg-slate-50 disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
                                </div>
                            </>
                        }
                    >
                        {pageRows.map((user) => (
                            <tr key={user.id} className="transition hover:bg-blue-50/50">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">{getInitials(user.fullname)}</div>
                                        <strong className="text-sm text-slate-950">{user.fullname}</strong>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-700">{user.email}</td>
                                <td className="px-5 py-4 text-sm font-medium text-slate-700">{user.role}</td>
                                <td className="px-5 py-4"><StatusBadge status={getStatus(user)} /></td>
                                <td className="px-5 py-4 text-sm text-slate-600">{user.lastActive}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <IconButton title="View Details" onClick={() => setSelectedUser(user)}><Eye size={16} /></IconButton>
                                        <IconButton title="View Sessions / Activity" onClick={() => openSessions(user)}><Activity size={16} /></IconButton>
                                        <IconButton title="Delete User" danger onClick={() => window.alert("Dummy action: delete user")}><Trash2 size={16} /></IconButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </motion.section>

            <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} onViewSessions={(user) => { setSelectedUser(null); openSessions(user); }} />
            <SessionsModal
                user={sessionsUser}
                sessions={selectedSessions}
                stats={sessionStats}
                loading={sessionsLoading}
                error={sessionsError}
                onClose={() => setSessionsUser(null)}
                onViewMap={setMapSession}
                onSessionInfo={setSessionInfo}
            />
            <MapModal session={mapSession} open={Boolean(mapSession)} onClose={() => setMapSession(null)} />
            <SessionInfoModal session={sessionInfo} onClose={() => setSessionInfo(null)} />
        </div>
    );
}

function IconButton({ children, title, onClick, danger = false }) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`grid h-9 w-9 place-items-center rounded-xl border transition ${danger ? "border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white" : "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
        >
            {children}
        </button>
    );
}

function UserDetailsModal({ user, onClose, onViewSessions }) {
    return (
        <Modal open={Boolean(user)} title="User Details" onClose={onClose} size="max-w-2xl">
            {user ? (
                <div className="grid gap-6 md:grid-cols-[76px_1fr]">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-xl font-bold text-blue-600">{getInitials(user.fullname)}</div>
                    <div className="grid gap-4">
                        <Detail label="Name" value={user.fullname} />
                        <Detail label="Email" value={user.email} />
                        <Detail label="Mobile" value={user.mobile} />
                        <Detail label="Role" value={user.role} />
                        <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
                            <span className="text-sm font-bold text-slate-950">Status</span>
                            <StatusBadge status={getStatus(user)} />
                        </div>
                        <Detail label="Last Active" value={user.lastActive} />
                        <Detail label="Created At" value={user.createdAt} />
                        <div className="mt-3 flex justify-end gap-3">
                            <button type="button" className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={onClose}>Close</button>
                            <button type="button" className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700" onClick={() => onViewSessions(user)}>View Sessions / Activity</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}

function SessionsModal({ user, sessions, stats, loading, error, onClose, onViewMap, onSessionInfo }) {
    return (
        <Modal open={Boolean(user)} title={`Session Logs${user ? ` - ${user.fullname}` : ""}`} onClose={onClose} size="max-w-6xl">
            <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MiniStat icon={Users} label="Total Sessions" value={stats.total} tone="blue" />
                <MiniStat icon={UserCheck} label="Active Sessions" value={stats.active} tone="green" />
                <MiniStat icon={CalendarDays} label="Last Login" value={stats.lastLogin} tone="violet" />
                <MiniStat icon={FileClock} label="Last Logout" value={stats.lastLogout} tone="orange" />
            </div>
            {loading ? (
                <div className="grid gap-3">
                    {[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-semibold text-rose-700">{error}</div>
            ) : (
                <SessionTable sessions={sessions} onViewMap={onViewMap} onSessionInfo={onSessionInfo} />
            )}
        </Modal>
    );
}

function SessionInfoModal({ session, onClose }) {
    return (
        <Modal open={Boolean(session)} title="Session Info" onClose={onClose} size="max-w-xl">
            {session ? (
                <div className="grid gap-4">
                    <Detail label="IP Address" value={session.ipAddress} />
                    <Detail label="Device / Browser" value={session.userAgent} />
                    <Detail label="Location" value={session.location} />
                    <Detail label="Latitude" value={session.latitude} />
                    <Detail label="Longitude" value={session.longitude} />
                    <Detail label="Login Time" value={session.loginAt} />
                    <Detail label="Logout Time" value={session.logoutAt || "-"} />
                    <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                        <span className="text-sm font-bold text-slate-950">Status</span>
                        <StatusBadge status={session.isActive ? "Active" : "Logged Out"} />
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
                <div>
                    <span className="text-xs font-semibold text-slate-500">{label}</span>
                    <strong className="mt-1 block text-sm text-slate-950">{value}</strong>
                </div>
            </div>
        </article>
    );
}

function Detail({ label, value }) {
    return (
        <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
            <span className="text-sm font-bold text-slate-950">{label}</span>
            <span className="text-sm font-medium text-slate-700">{value}</span>
        </div>
    );
}
