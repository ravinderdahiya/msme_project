import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search, Settings2, Trash2 } from "lucide-react";
import {
    createDataService,
    deleteDataService,
    getDataServices,
    updateDataService,
} from "../services/dataServiceService";
import { getCurrentUser } from "../utils/authStorage";
import { Card, DataTable, StatusPill } from "./AdminUI";

const PAGE_SIZE = 8;

const inferServiceType = (url) => {
    const value = String(url || "").toLowerCase();
    if (value.includes("wms")) return "WMS";
    if (value.includes("wmts")) return "WMTS";
    if (value.includes("mapserver")) return "ArcGIS MapServer";
    if (value.includes("featureserver")) return "ArcGIS FeatureServer";
    if (value.includes("imageserver")) return "ArcGIS ImageServer";
    return "REST API";
};

const formatDateTimeLabel = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    });
};

export default function DataServicesPage() {
    const currentRole = String(getCurrentUser()?.role || "").toLowerCase();
    const isAdminUser = currentRole === "admin" || currentRole === "superadmin";
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [serviceTypeFilter, setServiceTypeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedService, setSelectedService] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        key: "",
        name: "",
        endpoint: "",
        description: "",
        isActive: true,
    });

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await getDataServices();
            const mapped = (Array.isArray(data) ? data : []).map((item) => ({
                    id: item.id,
                    key: item.key,
                    name: item.name,
                    serviceType: item.serviceType || inferServiceType(item.endpoint),
                    endpoint: item.endpoint,
                    status: item.isActive ? "Active" : "Inactive",
                    checked: formatDateTimeLabel(item.lastChecked || item.updatedAt || item.createdAt),
                    description: item.description || "",
                    isActive: !!item.isActive,
                }));
            setRows(mapped);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load data services.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput, serviceTypeFilter, statusFilter]);

    const normalizedSearch = searchInput.trim().toLowerCase();
    const filteredRows = useMemo(() => (
        rows.filter((item) => {
            const matchSearch = !normalizedSearch
                || item.name.toLowerCase().includes(normalizedSearch)
                || item.key.toLowerCase().includes(normalizedSearch)
                || item.endpoint.toLowerCase().includes(normalizedSearch);
            const matchType = serviceTypeFilter === "All" || item.serviceType === serviceTypeFilter;
            const matchStatus = statusFilter === "All" || item.status === statusFilter;
            return matchSearch && matchType && matchStatus;
        })
    ), [rows, normalizedSearch, serviceTypeFilter, statusFilter]);

    const total = filteredRows.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const safePage = Math.min(currentPage, totalPages);
    const pagedRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const serviceTypeOptions = ["All", ...new Set(rows.map((item) => item.serviceType))];
    const statusOptions = ["All", "Active", "Inactive"];

    const openCreate = () => {
        setEditingId(null);
        setForm({
            key: "",
            name: "",
            endpoint: "",
            description: "",
            isActive: true,
        });
        setEditorOpen(true);
    };

    const openEdit = (row) => {
        if (!isAdminUser) {
            setError("Read-only mode: only admin can edit data services.");
            return;
        }
        setEditingId(row.id);
        setForm({
            key: row.key || "",
            name: row.name || "",
            endpoint: row.endpoint || "",
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
        if (!isAdminUser) {
            setError("Read-only mode: only admin can create or update data services.");
            return;
        }
        if (!form.key.trim() || !form.name.trim() || !form.endpoint.trim()) {
            setError("Key, Name and Endpoint URL are required.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            const payload = { ...form, serviceType: inferServiceType(form.endpoint) };
            if (editingId) {
                await updateDataService(editingId, payload);
            } else {
                await createDataService(payload);
            }
            await loadServices();
            closeEditor();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to save data service.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isAdminUser) {
            setError("Read-only mode: only admin can delete data services.");
            return;
        }
        if (!editingId) return;
        const ok = window.confirm("Delete this data service?");
        if (!ok) return;
        try {
            setSaving(true);
            setError("");
            await deleteDataService(editingId);
            await loadServices();
            closeEditor();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to delete data service.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (row) => {
        if (!isAdminUser) {
            setError("Read-only mode: only admin can change data service status.");
            return;
        }
        try {
            const nextIsActive = !row.isActive;
            await updateDataService(row.id, { isActive: nextIsActive });
            if (editingId && row.id === editingId) {
                setForm((prev) => ({ ...prev, isActive: nextIsActive }));
            }
            await loadServices();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to update service status.");
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
                            placeholder="Search services..."
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                        />
                    </label>
                    <div className="new-admin-toolbar-right">
                        <select className="new-admin-filter-select" value={serviceTypeFilter} onChange={(event) => setServiceTypeFilter(event.target.value)}>
                            {serviceTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type === "All" ? "All Services" : type}
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
                        <button type="button" className="new-admin-primary-btn" disabled={!isAdminUser} onClick={openCreate}>
                            <Plus size={16} />
                            <span>Add Service</span>
                        </button>
                    </div>
                </div>
                <DataTable
                    columns={["Service Name", "Service Type", "Endpoint URL", "Status", "Last Checked", "Actions"]}
                    rows={pagedRows}
                    renderRow={(item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.serviceType}</td>
                            <td className="mono-cell">{item.endpoint}</td>
                            <td><StatusPill value={item.status} /></td>
                            <td>{item.checked}</td>
                            <td className="actions-cell">
                                <button type="button" title="View service details" onClick={() => setSelectedService(item)}>
                                    <Eye size={15} />
                                </button>
                                <button type="button" title="Edit service" disabled={!isAdminUser} onClick={() => openEdit(item)}>
                                    <Settings2 size={15} />
                                </button>
                            </td>
                        </tr>
                    )}
                    footer={
                        <>
                            <span>
                                {loading
                                    ? "Loading services..."
                                    : `Showing ${from} to ${to} of ${new Intl.NumberFormat("en-IN").format(total)} services`}
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

            {selectedService ? (
                <div className="new-admin-modal-backdrop" onClick={() => setSelectedService(null)}>
                    <div className="new-admin-modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="new-admin-card-head">
                            <div>
                                <h3>Service Details</h3>
                                <p>Live configured service from database</p>
                            </div>
                            <button type="button" className="new-admin-filter-btn small" onClick={() => setSelectedService(null)}>
                                Close
                            </button>
                        </div>
                        <div className="new-admin-user-detail-grid">
                            <div><strong>Name:</strong> <span>{selectedService.name}</span></div>
                            <div><strong>Key:</strong> <span>{selectedService.key}</span></div>
                            <div><strong>Service Type:</strong> <span>{selectedService.serviceType}</span></div>
                            <div><strong>Status:</strong> <StatusPill value={selectedService.status} /></div>
                            <div><strong>Last Checked:</strong> <span>{selectedService.checked}</span></div>
                            <div style={{ gridColumn: "1 / -1" }}><strong>Endpoint:</strong> <span className="mono-cell">{selectedService.endpoint}</span></div>
                            <div style={{ gridColumn: "1 / -1" }}><strong>Description:</strong> <span>{selectedService.description || "-"}</span></div>
                        </div>
                    </div>
                </div>
            ) : null}

            {editorOpen ? (
                <div className="new-admin-modal-backdrop" onClick={closeEditor}>
                    <div className="new-admin-modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="new-admin-card-head">
                            <div>
                                <h3>{editingId ? "Update Service" : "Add Service"}</h3>
                                <p>Manage runtime data services</p>
                            </div>
                            <button type="button" className="new-admin-filter-btn small" onClick={closeEditor}>
                                Close
                            </button>
                        </div>
                        <form className="api-url-form-grid" onSubmit={handleSave}>
                            <input disabled={!isAdminUser} value={form.key} onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))} placeholder="Key (example: MSME_ROADS_SERVICE)" />
                            <input disabled={!isAdminUser} value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Service name" />
                            <input disabled={!isAdminUser} value={form.endpoint} onChange={(e) => setForm((prev) => ({ ...prev, endpoint: e.target.value }))} placeholder="Endpoint URL" />
                            <input value={inferServiceType(form.endpoint)} readOnly aria-readonly="true" />
                            <textarea
                                disabled={!isAdminUser}
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Description (optional)"
                            />
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
                                    <>
                                        <button
                                            type="button"
                                            className="new-admin-filter-btn"
                                            disabled={saving || !isAdminUser}
                                            onClick={() => handleToggleStatus({ id: editingId, isActive: form.isActive })}
                                        >
                                            {form.isActive ? "Deactivate" : "Activate"}
                                        </button>
                                        <button type="button" className="new-admin-filter-btn" disabled={saving || !isAdminUser} onClick={handleDelete}>
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
