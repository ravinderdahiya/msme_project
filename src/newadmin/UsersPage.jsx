import React, { useEffect, useState } from "react";
import {
    Activity,
    CalendarDays,
    Eye,
    FileClock,
    MapPin,
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
import { parseUserAgent } from "../utils/userAgent";

const PAGE_SIZE = 5;
const ARCGIS_REVERSE_GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode";
const locationCache = new Map();

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

function formatAccuracy(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? `${Math.round(parsed)} m` : "";
}

function normalizeSession(session) {
    const accuracy = session.accuracy ?? session.locationAccuracy ?? session.coordsAccuracy ?? null;
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
        locationName: session.locationName || session.location || "",
        locationAccuracy: formatAccuracy(accuracy),
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
            const sessions = sessionsPayload.map(normalizeSession);
            setSelectedSessions(sessions);
            setSelectedSessions(await enrichSessionsWithLocations(sessions));
        } catch (err) {
            console.error(err);
            setSessionsError(err?.response?.data?.message || "Failed to load session activity from backend.");
        } finally {
            setSessionsLoading(false);
        }
    };

    const openUserLocation = async (user) => {
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
            const sessions = await enrichSessionsWithLocations(sessionsPayload.map(normalizeSession));
            const locationSession = sessions.find(hasUsableLocation);
            if (!locationSession) {
                window.alert("No location found for this user.");
                return;
            }
            setMapSession(locationSession);
        } catch (err) {
            console.error(err);
            window.alert(err?.response?.data?.message || "Failed to load user location.");
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
                                        <IconButton title="View Location" onClick={() => openUserLocation(user)}><MapPin size={16} /></IconButton>
                                        <IconButton title="Delete User" danger onClick={() => window.alert("Dummy action: delete user")}><Trash2 size={16} /></IconButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </motion.section>

            <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            <SessionsModal
                user={sessionsUser}
                sessions={selectedSessions}
                stats={sessionStats}
                loading={sessionsLoading}
                error={sessionsError}
                onClose={() => setSessionsUser(null)}
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

function UserDetailsModal({ user, onClose }) {
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
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}

function SessionsModal({ user, sessions, stats, loading, error, onClose, onSessionInfo }) {
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
                <SessionTable sessions={sessions} onSessionInfo={onSessionInfo} />
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
                    <Detail label="Device / Browser" value={parseUserAgent(session.userAgent)} />
                    <Detail label="Location" value={session.locationName || session.location || "Location unavailable"} />
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

function hasUsableLocation(session) {
    const latitude = Number(session?.latitude);
    const longitude = Number(session?.longitude);
    return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0;
}

function coordinateKey(latitude, longitude) {
    return `${Number(latitude).toFixed(5)},${Number(longitude).toFixed(5)}`;
}

function isReadableLocation(value) {
    if (!value || value === "-") return false;
    if (/location unavailable/i.test(value)) return false;
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(value.trim())) return false;
    return true;
}

function fallbackLocationName(latitude, longitude, currentLocation) {
    if (isReadableLocation(currentLocation)) return currentLocation;

    const knownLocations = [
        { lat: 29.1395, lng: 75.7057, name: "Hisar, Haryana" },
        { lat: 28.6139, lng: 77.209, name: "New Delhi, India" },
    ];
    const match = knownLocations.find((item) => Math.abs(latitude - item.lat) < 0.15 && Math.abs(longitude - item.lng) < 0.15);
    return match?.name || "Location captured";
}

function getArcgisToken() {
    return import.meta.env.VITE_ARCGIS_API_KEY || import.meta.env.VITE_ARCGIS_TOKEN || "";
}

async function resolveLocationName(session) {
    if (!hasUsableLocation(session)) {
        return { locationName: "Location unavailable", locationAccuracy: "-" };
    }

    const latitude = Number(session.latitude);
    const longitude = Number(session.longitude);
    const key = coordinateKey(latitude, longitude);
    if (locationCache.has(key)) return locationCache.get(key);

    const fallback = fallbackLocationName(latitude, longitude, session.locationName || session.location);

    // Try Nominatim reverse geocoding first for high-quality local name in India
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18`,
            {
                headers: {
                    "User-Agent": "MSME-Haryana-GIS-System/1.0 (sande@msme.com)"
                }
            }
        );
        if (!response.ok) throw new Error("Nominatim reverse geocode failed");
        const data = await response.json();
        if (data && data.display_name) {
            const addr = data.address || {};
            const localName = data.name || addr.amenity || addr.building || addr.office || addr.shop || addr.tourism || addr.industrial || addr.commercial || addr.road || "";
            const neighbourhood = addr.neighbourhood || addr.suburb || addr.village || "";
            const city = addr.city || addr.town || addr.municipality || addr.district || addr.county || "";
            const state = addr.state || addr.region || addr.state_district || "";
            
            const parts = [];
            if (localName) parts.push(localName);
            if (neighbourhood && neighbourhood !== city && neighbourhood !== localName) parts.push(neighbourhood);
            if (city) parts.push(city);
            if (state && state !== city) parts.push(state);

            const displayName = parts.filter(Boolean).join(", ");
            const result = {
                locationName: displayName || data.display_name,
                locationAccuracy: session.locationAccuracy || "Approximate",
            };
            locationCache.set(key, result);
            return result;
        }
    } catch (osmError) {
        console.warn("Nominatim reverse geocode failed, falling back to ArcGIS", osmError);
    }

    // Fallback to ArcGIS reverse geocoder
    const params = new URLSearchParams({
        f: "json",
        location: `${longitude},${latitude}`,
        langCode: "en",
    });
    const token = getArcgisToken();
    if (token) params.set("token", token);

    try {
        const response = await fetch(`${ARCGIS_REVERSE_GEOCODE_URL}?${params.toString()}`);
        if (!response.ok) throw new Error("ArcGIS reverse geocode failed");
        const data = await response.json();
        const address = data.address || {};
        
        const cityVal = address.City || address.Subregion || "";
        const regionVal = address.Region || "";
        const matchAddr = address.Match_addr || "";
        
        let name = matchAddr;
        if (!name) {
            name = cityVal && regionVal ? `${cityVal}, ${regionVal}` : (address.LongLabel || [address.City, address.Subregion, address.Region].filter(Boolean).join(", "));
        }

        const result = {
            locationName: name || fallback,
            locationAccuracy: session.locationAccuracy || "Approximate",
        };
        locationCache.set(key, result);
        return result;
    } catch (error) {
        const result = {
            locationName: fallback,
            locationAccuracy: session.locationAccuracy || "Approximate",
        };
        locationCache.set(key, result);
        return result;
    }
}

async function enrichSessionsWithLocations(sessions) {
    return Promise.all(
        sessions.map(async (session) => {
            const location = await resolveLocationName(session);
            return {
                ...session,
                location: location.locationName,
                locationName: location.locationName,
                locationAccuracy: session.locationAccuracy || location.locationAccuracy,
            };
        })
    );
}
