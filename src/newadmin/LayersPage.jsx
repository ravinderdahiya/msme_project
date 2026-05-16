import React, { useEffect, useState } from "react";
import { Eye, Plus, Search, Settings2, Trash2 } from "lucide-react";
import { createApiUrl, deleteApiUrl, getApiUrls, updateApiUrl } from "../services/apiUrlService";
import { deriveLayerType, formatDateLabel } from "./adminConfig";
import { Card, DataTable, StatusPill } from "./AdminUI";

export default function LayersPage() {
    const PAGE_SIZE = 8;
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedLayer, setSelectedLayer] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        key: "",
        name: "",
        url: "",
        category: "map",
        description: "",
        isActive: true,
    });

    const loadLayers = async () => {
        try {
            setLoading(true);
            const data = await getApiUrls();
            const mapped = (Array.isArray(data) ? data : []).map((item) => ({
                id: item.id,
                key: item.key,
                name: item.name,
                category: item.category || "general",
                type: deriveLayerType(item.url),
                status: item.isActive ? "Active" : "Inactive",
                lastUpdated: formatDateLabel(item.updatedAt || item.createdAt),
                url: item.url,
                description: item.description || "",
                isActive: !!item.isActive,
            }));
            setRows(mapped);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load layers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLayers();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput, categoryFilter, typeFilter, statusFilter]);

    const normalizedSearch = searchInput.trim().toLowerCase();
    const filteredRows = rows.filter((item) => {
        const matchSearch = !normalizedSearch
            || item.name.toLowerCase().includes(normalizedSearch)
            || item.key.toLowerCase().includes(normalizedSearch)
            || item.url.toLowerCase().includes(normalizedSearch);
        const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchType = typeFilter === "All" || item.type === typeFilter;
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        return matchSearch && matchCategory && matchType && matchStatus;
    });

    const total = filteredRows.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const safePage = Math.min(currentPage, totalPages);
    const pagedRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const categoryOptions = ["All", ...new Set(rows.map((item) => item.category))];
    const typeOptions = ["All", ...new Set(rows.map((item) => item.type))];
    const statusOptions = ["All", "Active", "Inactive"];

    const openCreate = () => {
        setEditingId(null);
        setForm({
            key: "",
            name: "",
            url: "",
            category: "map",
            description: "",
            isActive: true,
        });
        setEditorOpen(true);
    };

    const openEdit = (row) => {
        setEditingId(row.id);
        setForm({
            key: row.key || "",
            name: row.name || "",
            url: row.url || "",
            category: row.category || "map",
            description: row.description || "",
            isActive: !!row.isActive,
        });
        setEditorOpen(true);
    };

    const closeEditor = () => {
        setEditorOpen(false);
        setEditingId(null);
    };

    const handleSave = async (event) => {
        event.preventDefault();
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
            await loadLayers();
            closeEditor();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to save layer.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!editingId) return;
        const ok = window.confirm("Delete this layer?");
        if (!ok) return;
        try {
            setSaving(true);
            setError("");
            await deleteApiUrl(editingId);
            await loadLayers();
            closeEditor();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to delete layer.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (row) => {
        try {
            const nextIsActive = !row.isActive;
            await updateApiUrl(row.id, { isActive: nextIsActive });
            if (editingId && row.id === editingId) {
                setForm((prev) => ({ ...prev, isActive: nextIsActive }));
            }
            await loadLayers();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to update layer status.");
        }
    };

    const from = pagedRows.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
    const to = pagedRows.length ? from + pagedRows.length - 1 : 0;

    return (
        <>
            <Card>
                <div className="new-admin-toolbar">
                    <label className="new-admin-search toolbar-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search layers..."
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                        />
                    </label>
                    <div className="new-admin-toolbar-right">
                        <select className="new-admin-filter-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category === "All" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                        <select className="new-admin-filter-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                            {typeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type === "All" ? "All Types" : type}
                                </option>
                            ))}
                        </select>
                        <select className="new-admin-filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status === "All" ? "All Status" : status}
                                </option>
                            ))}
                        </select>
                        <button type="button" className="new-admin-primary-btn" onClick={openCreate}>
                            <Plus size={16} />
                            <span>Add Layer</span>
                        </button>
                    </div>
                </div>
                <DataTable
                    columns={["Layer Name", "Category", "Type", "Status", "Last Updated", "Actions"]}
                    rows={pagedRows}
                    renderRow={(item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.type}</td>
                            <td><StatusPill value={item.status} /></td>
                            <td>{item.lastUpdated}</td>
                            <td className="actions-cell">
                                <button type="button" title="View layer details" onClick={() => setSelectedLayer(item)}>
                                    <Eye size={15} />
                                </button>
                                <button type="button" title="Edit layer" onClick={() => openEdit(item)}>
                                    <Settings2 size={15} />
                                </button>
                            </td>
                        </tr>
                    )}
                    footer={
                        <>
                            <span>
                                {loading
                                    ? "Loading layers..."
                                    : `Showing ${from} to ${to} of ${new Intl.NumberFormat("en-IN").format(total)} layers`}
                            </span>
                            <div className="pager">
                                <button type="button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>{`<`}</button>
                                <button type="button" className="active">{safePage}</button>
                                <button type="button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>{`>`}</button>
                            </div>
                        </>
                    }
                />
                {error ? <p className="api-url-error">{error}</p> : null}
            </Card>

            {selectedLayer ? (
                <div className="new-admin-modal-backdrop" onClick={() => setSelectedLayer(null)}>
                    <div className="new-admin-modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="new-admin-card-head">
                            <div>
                                <h3>Layer Details</h3>
                                <p>Live configured layer from database</p>
                            </div>
                            <button type="button" className="new-admin-filter-btn small" onClick={() => setSelectedLayer(null)}>
                                Close
                            </button>
                        </div>
                        <div className="new-admin-user-detail-grid">
                            <div><strong>Name:</strong> <span>{selectedLayer.name}</span></div>
                            <div><strong>Key:</strong> <span>{selectedLayer.key}</span></div>
                            <div><strong>Category:</strong> <span>{selectedLayer.category}</span></div>
                            <div><strong>Type:</strong> <span>{selectedLayer.type}</span></div>
                            <div><strong>Status:</strong> <StatusPill value={selectedLayer.status} /></div>
                            <div><strong>Updated:</strong> <span>{selectedLayer.lastUpdated}</span></div>
                            <div style={{ gridColumn: "1 / -1" }}><strong>URL:</strong> <span className="mono-cell">{selectedLayer.url}</span></div>
                            <div style={{ gridColumn: "1 / -1" }}><strong>Description:</strong> <span>{selectedLayer.description || "-"}</span></div>
                        </div>
                    </div>
                </div>
            ) : null}

            {editorOpen ? (
                <div className="new-admin-modal-backdrop" onClick={closeEditor}>
                    <div className="new-admin-modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="new-admin-card-head">
                            <div>
                                <h3>{editingId ? "Update Layer" : "Add Layer"}</h3>
                                <p>Manage GIS layer configuration</p>
                            </div>
                            <button type="button" className="new-admin-filter-btn small" onClick={closeEditor}>
                                Close
                            </button>
                        </div>
                        <form className="api-url-form-grid" onSubmit={handleSave}>
                            <input value={form.key} onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))} placeholder="Key (example: MSME_ADMIN_BOUNDARIES)" />
                            <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Layer name" />
                            <input value={form.url} onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))} placeholder="Layer URL" />
                            <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
                                <option value="map">map</option>
                                <option value="infrastructure">infrastructure</option>
                                <option value="utilities">utilities</option>
                                <option value="environment">environment</option>
                                <option value="general">general</option>
                            </select>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Description (optional)"
                            />
                            <label className="api-url-active-check">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                                />
                                Active
                            </label>
                            <div className="api-url-form-actions">
                                <button type="submit" className="new-admin-primary-btn" disabled={saving}>
                                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                                </button>
                                {editingId ? (
                                    <>
                                        <button
                                            type="button"
                                            className="new-admin-filter-btn"
                                            disabled={saving}
                                            onClick={() => handleToggleStatus({ id: editingId, isActive: form.isActive })}
                                        >
                                            {form.isActive ? "Deactivate" : "Activate"}
                                        </button>
                                        <button type="button" className="new-admin-filter-btn" disabled={saving} onClick={handleDelete}>
                                            <Trash2 size={15} />
                                            <span>Delete</span>
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}
