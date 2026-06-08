import React, { useEffect, useState } from "react";
import { Search, Settings2, Trash2 } from "lucide-react";
import { createApiUrl, deleteApiUrl, getApiUrlsPaginated, updateApiUrl } from "../services/apiUrlService";
import { getCurrentUser } from "../utils/authStorage";
import { Card, DataTable, StatusPill } from "./AdminUI";

const PAGE_SIZE = 10;

export default function ApiUrlsPage() {
    const currentRole = String(getCurrentUser()?.role || "").toLowerCase();
    const isAdminUser = currentRole === "admin" || currentRole === "superadmin";

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [activeView, setActiveView] = useState("table");

    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0 });
    const [categoryOptions, setCategoryOptions] = useState(["All"]);

    const [form, setForm] = useState({
        key: "",
        name: "",
        url: "",
        category: "map",
        description: "",
        isActive: true,
    });

    const loadRows = async (overrides = {}) => {
        try {
            setLoading(true);
            const nextPage = overrides.page ?? page;
            const nextQuery = overrides.query ?? query;
            const nextCategory = overrides.category ?? categoryFilter;
            const nextStatus = overrides.status ?? statusFilter;

            const response = await getApiUrlsPaginated({
                page: nextPage,
                limit: PAGE_SIZE,
                search: nextQuery,
                category: nextCategory,
                status: nextStatus,
            });

            const nextRows = Array.isArray(response?.data) ? response.data : [];
            const pagination = response?.pagination || {};
            const apiSummary = response?.summary || {};
            const filters = response?.filters || {};

            setRows(nextRows);
            setTotalCount(Number(pagination.total || 0));
            setTotalPages(Math.max(1, Number(pagination.totalPages || 1)));
            setSummary({
                total: Number(apiSummary.total || 0),
                active: Number(apiSummary.active || 0),
                inactive: Number(apiSummary.inactive || 0),
            });
            setCategoryOptions(
                Array.isArray(filters.categoryOptions) && filters.categoryOptions.length
                    ? filters.categoryOptions
                    : ["All"]
            );
            setError("");
        } catch (err) {
            console.error(err);
            setRows([]);
            setTotalCount(0);
            setTotalPages(1);
            setError("Failed to load API URL list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (activeView === "table") {
                loadRows();
            }
        }, 250);

        return () => window.clearTimeout(timer);
    }, [page, query, categoryFilter, statusFilter, activeView]);

    const resetForm = () => {
        setEditingId(null);
        setForm({
            key: "",
            name: "",
            url: "",
            category: "map",
            description: "",
            isActive: true,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isAdminUser) {
            setError("Read-only mode: only admin can create or update API URLs.");
            return;
        }

        if (!form.key.trim() || !form.name.trim() || !form.url.trim()) {
            setError("Key, Name and URL are required.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            if (editingId) {
                await updateApiUrl(editingId, form);
            } else {
                await createApiUrl(form);
            }
            resetForm();
            setActiveView("table");
            setPage(1);
            await loadRows({ page: 1 });
        } catch (err) {
            console.error(err);
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage || "Failed to save API URL.");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (row) => {
        if (!isAdminUser) {
            setError("Read-only mode: only admin can edit API URLs.");
            return;
        }

        setActiveView("add");
        setEditingId(row.id);
        setForm({
            key: row.key || "",
            name: row.name || "",
            url: row.url || "",
            category: row.category || "map",
            description: row.description || "",
            isActive: !!row.isActive,
        });
    };

    const handleDelete = async (id) => {
        if (!isAdminUser) {
            setError("Read-only mode: only admin can delete API URLs.");
            return;
        }

        const ok = window.confirm("Delete this API URL?");
        if (!ok) return;

        try {
            await deleteApiUrl(id);
            const shouldGoPrev = rows.length === 1 && page > 1;
            const nextPage = shouldGoPrev ? page - 1 : page;
            setPage(nextPage);
            await loadRows({ page: nextPage });
        } catch (err) {
            console.error(err);
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage || "Failed to delete API URL.");
        }
    };

    const from = rows.length ? (page - 1) * PAGE_SIZE + 1 : 0;
    const to = rows.length ? from + rows.length - 1 : 0;

    return (
        <>
            <Card title="API URL Views" subtitle="Sub-tab se Add View aur Table View alag-alag open karein.">
                <div className="api-url-subtabs">
                    <button
                        type="button"
                        className={`api-url-subtab-btn ${activeView === "add" ? "is-active" : ""}`}
                        onClick={() => setActiveView("add")}
                    >
                        Add View
                    </button>
                    <button
                        type="button"
                        className={`api-url-subtab-btn ${activeView === "table" ? "is-active" : ""}`}
                        onClick={() => setActiveView("table")}
                    >
                        Table View
                    </button>
                </div>
            </Card>

            <div className={`new-admin-grid one-one ${activeView === "add" || activeView === "table" ? "api-url-grid-single" : ""}`}>
                {activeView === "add" ? (
                    <Card
                        title={editingId ? "Update API URL" : "Add API URL"}
                        subtitle={
                            isAdminUser
                                ? "Backend proxy and runtime URLs are controlled from database."
                                : "Read-only mode: API URLs are visible to users, editing allowed for admin only."
                        }
                    >
                        <form className="api-url-form-grid" onSubmit={handleSubmit}>
                            <input disabled={!isAdminUser} value={form.key} onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))} placeholder="Key (example: MSME_ADMIN_BOUNDARIES)" />
                            <input disabled={!isAdminUser} value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Display name" />
                            <input disabled={!isAdminUser} value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category (map/general)" />
                            <input disabled={!isAdminUser} value={form.url} onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))} placeholder="Full URL" />
                            <input disabled={!isAdminUser} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description (optional)" />
                            <label className="api-url-active-check">
                                <input
                                    disabled={!isAdminUser}
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                                />
                                Active
                            </label>
                            <div className="api-url-form-actions">
                                <button type="submit" className="new-admin-primary-btn" disabled={saving || !isAdminUser}>
                                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                                </button>
                                {editingId ? (
                                    <button type="button" className="new-admin-filter-btn" disabled={!isAdminUser} onClick={resetForm}>
                                        Cancel
                                    </button>
                                ) : null}
                            </div>
                        </form>
                        {error ? <p className="api-url-error">{error}</p> : null}
                    </Card>
                ) : null}

                {activeView === "table" ? (
                    <Card title="Configured API URLs" subtitle="These keys are used by frontend and secure map proxy.">
                        <div className="new-admin-toolbar">
                            <label className="new-admin-search toolbar-search">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search key, name, category, URL..."
                                    value={query}
                                    onChange={(event) => {
                                        setPage(1);
                                        setQuery(event.target.value);
                                    }}
                                />
                            </label>
                            <div className="new-admin-toolbar-right">
                                <select
                                    className="new-admin-filter-select"
                                    value={categoryFilter}
                                    onChange={(event) => {
                                        setPage(1);
                                        setCategoryFilter(event.target.value);
                                    }}
                                >
                                    {categoryOptions.map((option) => (
                                        <option key={option} value={option}>{option === "All" ? "All Categories" : option}</option>
                                    ))}
                                </select>
                                <select
                                    className="new-admin-filter-select"
                                    value={statusFilter}
                                    onChange={(event) => {
                                        setPage(1);
                                        setStatusFilter(event.target.value);
                                    }}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="logs-summary-grid">
                            <article className="logs-summary-chip info">
                                <span>Total API URLs</span>
                                <strong>{summary.total}</strong>
                            </article>
                            <article className="logs-summary-chip">
                                <span>Filtered Count</span>
                                <strong>{totalCount}</strong>
                            </article>
                            <article className="logs-summary-chip warning">
                                <span>Active APIs</span>
                                <strong>{summary.active}</strong>
                            </article>
                            <article className="logs-summary-chip error">
                                <span>Inactive APIs</span>
                                <strong>{summary.inactive}</strong>
                            </article>
                        </div>

                        {loading ? (
                            <p>Loading API URLs...</p>
                        ) : (
                            <>
                                <DataTable
                                    columns={["Key", "Name", "Category", "URL", "Status", "Actions"]}
                                    rows={rows}
                                    renderRow={(item) => (
                                        <tr key={item.id}>
                                            <td>{item.key}</td>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td className="mono-cell">{item.url}</td>
                                            <td><StatusPill value={item.isActive ? "Active" : "Inactive"} /></td>
                                            <td className="actions-cell">
                                                <button type="button" disabled={!isAdminUser} onClick={() => startEdit(item)}>
                                                    <Settings2 size={15} />
                                                </button>
                                                <button type="button" disabled={!isAdminUser} onClick={() => handleDelete(item.id)}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    footer={
                                        <>
                                            <span>Showing {from} to {to} of {totalCount} API URLs</span>
                                            <div className="pager">
                                                <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Prev</button>
                                                <button type="button" className="active">{page}</button>
                                                <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
                                            </div>
                                        </>
                                    }
                                />
                                {!rows.length ? <p className="new-admin-empty-state">No API URLs found for current filters.</p> : null}
                            </>
                        )}
                    </Card>
                ) : null}
            </div>
            {activeView === "table" && error ? <p className="api-url-error">{error}</p> : null}
        </>
    );
}

