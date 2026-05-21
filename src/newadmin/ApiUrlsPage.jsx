import React, { useEffect, useState } from "react";
import { Settings2, Trash2 } from "lucide-react";
import { createApiUrl, deleteApiUrl, getApiUrls, updateApiUrl } from "../services/apiUrlService";
import { getCurrentUser } from "../utils/authStorage";
import { Card, DataTable, StatusPill } from "./AdminUI";

export default function ApiUrlsPage() {
    const currentRole = String(getCurrentUser()?.role || "").toLowerCase();
    const isAdminUser = currentRole === "admin" || currentRole === "superadmin";
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [activeView, setActiveView] = useState("table");
    const [form, setForm] = useState({
        key: "",
        name: "",
        url: "",
        category: "map",
        description: "",
        isActive: true,
    });

    const loadRows = async () => {
        try {
            setLoading(true);
            const data = await getApiUrls();
            setRows(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load API URL list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRows();
    }, []);

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
            await loadRows();
            resetForm();
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
            await loadRows();
        } catch (err) {
            console.error(err);
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage || "Failed to delete API URL.");
        }
    };

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
                        {loading ? (
                            <p>Loading API URLs...</p>
                        ) : (
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
                            />
                        )}
                    </Card>
                ) : null}
            </div>
            {activeView === "table" && error ? <p className="api-url-error">{error}</p> : null}
        </>
    );
}
