import React, { useEffect, useMemo, useState } from "react";
import { Eye, Search, Settings2, Trash2 } from "lucide-react";
import { createApiUrl, deleteApiUrl, getApiUrls, updateApiUrl } from "../services/apiUrlService";
import { getCurrentUser } from "../utils/authStorage";
import { Card, DataTable, StatGrid, StatusPill } from "./AdminUI";

const PAGE_SIZE = 8;
const DEFAULT_CATEGORY = "analysis-tool";

const ANALYSIS_CATEGORY_OPTIONS = [
  "analysis-tool",
  "analysis-proximity",
  "analysis-buffer",
  "analysis-suitability",
  "analysis-reporting",
];

const toTitleCase = (value) => {
  const text = String(value || "").trim();
  if (!text) return "-";
  return text
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
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

const isAnalysisCategory = (category) => String(category || "").toLowerCase().startsWith("analysis");

export default function AnalysisToolsPage() {
  const currentRole = String(getCurrentUser()?.role || "").toLowerCase();
  const isAdminUser = currentRole === "admin" || currentRole === "superadmin";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const [form, setForm] = useState({
    key: "",
    name: "",
    category: DEFAULT_CATEGORY,
    url: "",
    description: "",
    isActive: true,
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      key: "",
      name: "",
      category: DEFAULT_CATEGORY,
      url: "",
      description: "",
      isActive: true,
    });
  };

  const loadRows = async () => {
    try {
      setLoading(true);
      const data = await getApiUrls();
      const mapped = (Array.isArray(data) ? data : [])
        .filter((item) => isAnalysisCategory(item.category))
        .map((item) => ({
          id: item.id,
          key: item.key || "",
          name: item.name || "",
          category: item.category || DEFAULT_CATEGORY,
          url: item.url || "",
          description: item.description || "",
          isActive: !!item.isActive,
          status: item.isActive ? "Active" : "Inactive",
          updatedAt: item.updatedAt || item.createdAt || null,
          createdAt: item.createdAt || null,
        }))
        .sort((a, b) => a.key.localeCompare(b.key));
      setRows(mapped);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load analysis tools.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, categoryFilter, statusFilter]);

  const normalizedSearch = searchInput.trim().toLowerCase();
  const filteredRows = useMemo(
    () =>
      rows.filter((item) => {
        const matchSearch =
          !normalizedSearch ||
          item.name.toLowerCase().includes(normalizedSearch) ||
          item.key.toLowerCase().includes(normalizedSearch) ||
          item.url.toLowerCase().includes(normalizedSearch) ||
          item.description.toLowerCase().includes(normalizedSearch);
        const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        return matchSearch && matchCategory && matchStatus;
      }),
    [rows, normalizedSearch, categoryFilter, statusFilter],
  );

  const total = filteredRows.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const from = pagedRows.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const to = pagedRows.length ? from + pagedRows.length - 1 : 0;

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const summary = useMemo(() => {
    const active = rows.filter((item) => item.isActive).length;
    const inactive = rows.length - active;
    const categories = new Set(rows.map((item) => item.category)).size;
    return { total: rows.length, active, inactive, categories };
  }, [rows]);

  const categoryOptions = useMemo(
    () => ["All", ...new Set(rows.map((item) => item.category))],
    [rows],
  );
  const statusOptions = ["All", "Active", "Inactive"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAdminUser) {
      setError("Read-only mode: only admin can create or update analysis tools.");
      return;
    }

    if (!form.key.trim() || !form.name.trim() || !form.url.trim()) {
      setError("Key, Name and Endpoint URL are required.");
      return;
    }

    const normalizedCategory = isAnalysisCategory(form.category)
      ? form.category
      : DEFAULT_CATEGORY;

    try {
      setSaving(true);
      setError("");
      const payload = {
        key: form.key.trim(),
        name: form.name.trim(),
        url: form.url.trim(),
        category: normalizedCategory,
        description: form.description.trim() || null,
        isActive: Boolean(form.isActive),
      };

      if (editingId) {
        await updateApiUrl(editingId, payload);
      } else {
        await createApiUrl(payload);
      }

      await loadRows();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save analysis tool.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    if (!isAdminUser) {
      setError("Read-only mode: only admin can edit analysis tools.");
      return;
    }
    setEditingId(item.id);
    setForm({
      key: item.key || "",
      name: item.name || "",
      category: isAnalysisCategory(item.category) ? item.category : DEFAULT_CATEGORY,
      url: item.url || "",
      description: item.description || "",
      isActive: !!item.isActive,
    });
  };

  const handleDelete = async (id) => {
    if (!isAdminUser) {
      setError("Read-only mode: only admin can delete analysis tools.");
      return;
    }
    const ok = window.confirm("Delete this analysis tool?");
    if (!ok) return;
    try {
      setSaving(true);
      setError("");
      await deleteApiUrl(id);
      if (editingId === id) resetForm();
      await loadRows();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to delete analysis tool.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item) => {
    if (!isAdminUser) {
      setError("Read-only mode: only admin can change status.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const nextIsActive = !item.isActive;
      await updateApiUrl(item.id, { isActive: nextIsActive });
      setSelectedTool((prev) =>
        prev && prev.id === item.id
          ? { ...prev, isActive: nextIsActive, status: nextIsActive ? "Active" : "Inactive" }
          : prev,
      );
      await loadRows();
      if (editingId === item.id) {
        setForm((prev) => ({ ...prev, isActive: nextIsActive }));
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const visiblePageNumbers = useMemo(() => {
    const maxButtons = 5;
    const start = Math.max(1, safePage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    const normalizedStart = Math.max(1, end - maxButtons + 1);
    const result = [];
    for (let i = normalizedStart; i <= end; i += 1) {
      result.push(i);
    }
    return result;
  }, [safePage, totalPages]);

  return (
    <>
      <StatGrid
        items={[
          {
            label: "Total Analysis Tools",
            value: new Intl.NumberFormat("en-IN").format(summary.total),
            change: "0%",
            tone: "blue",
            subtext: "Database records",
          },
          {
            label: "Active Tools",
            value: new Intl.NumberFormat("en-IN").format(summary.active),
            change: "0%",
            tone: "green",
            subtext: "Available in runtime",
          },
          {
            label: "Inactive Tools",
            value: new Intl.NumberFormat("en-IN").format(summary.inactive),
            change: "0%",
            tone: "orange",
            subtext: "Disabled from runtime",
          },
          {
            label: "Tool Categories",
            value: new Intl.NumberFormat("en-IN").format(summary.categories),
            change: "0%",
            tone: "violet",
            subtext: "Unique analysis categories",
          },
        ]}
      />

      <div className="new-admin-grid one-one">
        <Card
          title={editingId ? "Update Analysis Tool" : "Add Analysis Tool"}
          subtitle={
            isAdminUser
              ? "Manage analysis tools from database with live runtime control."
              : "Read-only mode: you can view tools, only admin can edit."
          }
        >
          <form className="api-url-form-grid" onSubmit={handleSubmit}>
            <input
              disabled={!isAdminUser}
              value={form.key}
              onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value.toUpperCase() }))}
              placeholder="Key (example: ANALYSIS_PROXIMITY)"
            />
            <input
              disabled={!isAdminUser}
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Tool name"
            />
            <select
              disabled={!isAdminUser}
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              {ANALYSIS_CATEGORY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {toTitleCase(item)}
                </option>
              ))}
            </select>
            <input
              disabled={!isAdminUser}
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="Endpoint URL"
            />
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
                <button
                  type="button"
                  className="new-admin-filter-btn"
                  disabled={saving || !isAdminUser}
                  onClick={resetForm}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          {error ? <p className="api-url-error">{error}</p> : null}
        </Card>

        <Card title="Configured Analysis Tools" subtitle="Search, filter, paginate and manage analysis tools.">
          <div className="new-admin-toolbar">
            <label className="new-admin-search toolbar-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by key, name, URL, description..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>
            <div className="new-admin-toolbar-right">
              <select
                className="new-admin-filter-select"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : toTitleCase(item)}
                  </option>
                ))}
              </select>
              <select
                className="new-admin-filter-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
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
            columns={["Key", "Name", "Category", "Endpoint URL", "Status", "Updated", "Actions"]}
            rows={pagedRows}
            renderRow={(item) => (
              <tr key={item.id}>
                <td>{item.key}</td>
                <td>{item.name}</td>
                <td>{toTitleCase(item.category)}</td>
                <td className="mono-cell">{item.url}</td>
                <td>
                  <StatusPill value={item.status} />
                </td>
                <td>{formatDateTimeLabel(item.updatedAt)}</td>
                <td className="actions-cell">
                  <button type="button" title="View details" onClick={() => setSelectedTool(item)}>
                    <Eye size={15} />
                  </button>
                  <button type="button" title="Edit tool" disabled={!isAdminUser} onClick={() => startEdit(item)}>
                    <Settings2 size={15} />
                  </button>
                  <button type="button" title="Delete tool" disabled={!isAdminUser} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            )}
            footer={
              <>
                <span>
                  {loading
                    ? "Loading analysis tools..."
                    : `Showing ${from} to ${to} of ${new Intl.NumberFormat("en-IN").format(total)} tools`}
                </span>
                <div className="pager">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={safePage <= 1}
                    title="First page"
                  >
                    {"<<"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={safePage <= 1}
                    title="Previous page"
                  >
                    {"<"}
                  </button>
                  {visiblePageNumbers.map((pageNo) => (
                    <button
                      key={pageNo}
                      type="button"
                      className={pageNo === safePage ? "active" : ""}
                      onClick={() => setCurrentPage(pageNo)}
                    >
                      {pageNo}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={safePage >= totalPages}
                    title="Next page"
                  >
                    {">"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safePage >= totalPages}
                    title="Last page"
                  >
                    {">>"}
                  </button>
                </div>
              </>
            }
          />
          {!loading && !pagedRows.length ? (
            <p className="new-admin-empty-state">No analysis tools found for current filters.</p>
          ) : null}
        </Card>
      </div>

      {selectedTool ? (
        <div className="new-admin-modal-backdrop" onClick={() => setSelectedTool(null)}>
          <div className="new-admin-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="new-admin-card-head">
              <div>
                <h3>Analysis Tool Details</h3>
                <p>Live configured data from database.</p>
              </div>
              <button type="button" className="new-admin-filter-btn small" onClick={() => setSelectedTool(null)}>
                Close
              </button>
            </div>
            <div className="new-admin-user-detail-grid">
              <div>
                <strong>Key:</strong> <span>{selectedTool.key}</span>
              </div>
              <div>
                <strong>Name:</strong> <span>{selectedTool.name}</span>
              </div>
              <div>
                <strong>Category:</strong> <span>{toTitleCase(selectedTool.category)}</span>
              </div>
              <div>
                <strong>Status:</strong> <StatusPill value={selectedTool.status} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <strong>Endpoint:</strong> <span className="mono-cell">{selectedTool.url}</span>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <strong>Description:</strong> <span>{selectedTool.description || "-"}</span>
              </div>
              <div>
                <strong>Created:</strong> <span>{formatDateTimeLabel(selectedTool.createdAt)}</span>
              </div>
              <div>
                <strong>Updated:</strong> <span>{formatDateTimeLabel(selectedTool.updatedAt)}</span>
              </div>
            </div>
            {isAdminUser ? (
              <div className="api-url-form-actions" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="new-admin-filter-btn"
                  disabled={saving}
                  onClick={() => handleToggleStatus(selectedTool)}
                >
                  {selectedTool.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  className="new-admin-primary-btn"
                  disabled={saving}
                  onClick={() => {
                    startEdit(selectedTool);
                    setSelectedTool(null);
                  }}
                >
                  Edit
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
