import React, { useEffect, useState } from "react";
import { Eye, Search, Settings2 } from "lucide-react";
import { getAdminUsers as getAdminUsersApi, updateAdminUserStatus as updateAdminUserStatusApi } from "../services/adminUserService";
import { ADMIN_AVATAR_SRC, handleAvatarError } from "./adminConfig";
import { Card, DataTable, StatGrid, StatusPill } from "./AdminUI";

export default function UsersPage() {
    const PAGE_SIZE = 8;
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [roleOptions, setRoleOptions] = useState(["All"]);
    const [statusOptions, setStatusOptions] = useState(["All", "Active", "Inactive", "Blocked"]);
    const [summary, setSummary] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        blockedUsers: 0,
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1,
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getAdminUsersApi({
                page: pagination.page,
                limit: PAGE_SIZE,
                search: query,
                role: roleFilter,
                status: statusFilter,
            });

            setRows(Array.isArray(data.users) ? data.users : []);
            setSummary(data.summary || {
                totalUsers: 0,
                activeUsers: 0,
                inactiveUsers: 0,
                blockedUsers: 0,
            });
            setPagination((prev) => ({
                ...prev,
                ...(data.pagination || {}),
            }));
            setRoleOptions(data.filters?.roleOptions || ["All"]);
            setStatusOptions(data.filters?.statusOptions || ["All", "Active", "Inactive", "Blocked"]);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setQuery(searchInput.trim());
        }, 350);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        loadUsers();
    }, [pagination.page, query, roleFilter, statusFilter]);

    const formatted = {
        total: new Intl.NumberFormat("en-IN").format(summary.totalUsers || 0),
        active: new Intl.NumberFormat("en-IN").format(summary.activeUsers || 0),
        inactive: new Intl.NumberFormat("en-IN").format(summary.inactiveUsers || 0),
        blocked: new Intl.NumberFormat("en-IN").format(summary.blockedUsers || 0),
    };

    const from = rows.length ? (pagination.page - 1) * pagination.limit + 1 : 0;
    const to = rows.length ? from + rows.length - 1 : 0;

    const changePage = (nextPage) => {
        if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === pagination.page) return;
        setPagination((prev) => ({ ...prev, page: nextPage }));
    };

    const handleStatusToggle = async (user) => {
        const nextStatus = user.status === "Blocked" ? "Active" : "Blocked";
        const prompt = nextStatus === "Blocked"
            ? `Block ${user.name}? They will lose active access.`
            : `Unblock ${user.name}?`;
        if (!window.confirm(prompt)) return;

        try {
            setActionLoadingId(user.id);
            setError("");
            await updateAdminUserStatusApi(user.id, { status: nextStatus, role: user.role });
            await loadUsers();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to update user status.");
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <>
            <StatGrid items={[
                { label: "Total Users", value: formatted.total, change: "0%", tone: "blue", subtext: "Live data" },
                { label: "Active Users", value: formatted.active, change: "0%", tone: "green", subtext: "Live data" },
                { label: "Inactive Users", value: formatted.inactive, change: "0%", tone: "orange", subtext: "Live data" },
                { label: "Blocked Users", value: formatted.blocked, change: "0%", tone: "violet", subtext: "Live data" },
            ]} />
            <Card>
                <div className="new-admin-toolbar">
                    <label className="new-admin-search toolbar-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                        />
                    </label>
                    <div className="new-admin-toolbar-right">
                        <select
                            className="new-admin-filter-select"
                            value={roleFilter}
                            onChange={(event) => {
                                setRoleFilter(event.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                        >
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {role === "All" ? "All Roles" : role}
                                </option>
                            ))}
                        </select>
                        <select
                            className="new-admin-filter-select"
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(event.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status === "All" ? "All Status" : status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <DataTable
                    columns={["Name", "Email", "Role", "Status", "Last Active", "Actions"]}
                    rows={rows}
                    renderRow={(user) => (
                        <tr key={user.id}>
                            <td className="entity-cell"><img src={ADMIN_AVATAR_SRC} alt={user.name} onError={handleAvatarError} /><span>{user.name}</span></td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td><StatusPill value={user.status} /></td>
                            <td>{user.lastActive}</td>
                            <td className="actions-cell">
                                <button type="button" title="View user details" onClick={() => setSelectedUser(user)}>
                                    <Eye size={15} />
                                </button>
                                <button
                                    type="button"
                                    title={user.status === "Blocked" ? "Unblock user" : "Block user"}
                                    disabled={actionLoadingId === user.id}
                                    onClick={() => handleStatusToggle(user)}
                                >
                                    <Settings2 size={15} />
                                </button>
                            </td>
                        </tr>
                    )}
                    footer={
                        <>
                            <span>
                                {loading
                                    ? "Loading users..."
                                    : `Showing ${from} to ${to} of ${new Intl.NumberFormat("en-IN").format(pagination.total || 0)} users`}
                            </span>
                            <div className="pager">
                                <button type="button" onClick={() => changePage(pagination.page - 1)}>{`<`}</button>
                                <button type="button" className="active">{pagination.page}</button>
                                <button type="button" onClick={() => changePage(pagination.page + 1)}>{`>`}</button>
                            </div>
                        </>
                    }
                />
                {error ? <p className="api-url-error">{error}</p> : null}
            </Card>
            {selectedUser ? (
                <div className="new-admin-modal-backdrop" onClick={() => setSelectedUser(null)}>
                    <div className="new-admin-modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="new-admin-card-head">
                            <div>
                                <h3>User Details</h3>
                                <p>Live user information</p>
                            </div>
                            <button type="button" className="new-admin-filter-btn small" onClick={() => setSelectedUser(null)}>
                                Close
                            </button>
                        </div>
                        <div className="new-admin-user-detail-grid">
                            <div><strong>Name:</strong> <span>{selectedUser.name}</span></div>
                            <div><strong>Email:</strong> <span>{selectedUser.email}</span></div>
                            <div><strong>Role:</strong> <span>{selectedUser.role}</span></div>
                            <div><strong>Status:</strong> <StatusPill value={selectedUser.status} /></div>
                            <div><strong>Last Active:</strong> <span>{selectedUser.lastActive}</span></div>
                            <div><strong>Mobile:</strong> <span>{selectedUser.mobile || "-"}</span></div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
