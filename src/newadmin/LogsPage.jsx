import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { logs } from "./newAdminData";
import { Card, DataTable, StatusPill } from "./AdminUI";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function LogsPage() {
    const [searchInput, setSearchInput] = useState("");
    const [levelFilter, setLevelFilter] = useState("All");
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLabel, setSelectedLabel] = useState(null);

    const normalizeLabelText = (item) => {
        const value = item?.label ?? item?.message ?? "-";
        if (value == null) return "-";
        if (typeof value === "string") return value;
        try {
            return JSON.stringify(value);
        } catch (error) {
            return String(value);
        }
    };

    const toShortText = (value, maxLength = 70) => {
        const text = String(value || "").trim();
        if (text.length <= maxLength) return { shortText: text || "-", isLong: false };
        return { shortText: `${text.slice(0, maxLength).trim()}...`, isLong: true };
    };

    const levelOptions = useMemo(
        () => ["All", ...new Set((Array.isArray(logs) ? logs : []).map((item) => item.level).filter(Boolean))],
        [],
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput, levelFilter, pageSize]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredRows = useMemo(
        () =>
            (Array.isArray(logs) ? logs : []).filter((item) => {
                const searchable = `${item.level || ""} ${normalizeLabelText(item)} ${item.time || ""}`.toLowerCase();
                const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
                const matchesLevel = levelFilter === "All" || item.level === levelFilter;
                return matchesSearch && matchesLevel;
            }),
        [normalizedSearch, levelFilter],
    );

    const summary = useMemo(() => {
        const source = Array.isArray(logs) ? logs : [];
        return {
            total: source.length,
            info: source.filter((item) => item.level === "Info").length,
            warning: source.filter((item) => item.level === "Warning").length,
            error: source.filter((item) => item.level === "Error").length,
        };
    }, []);

    const total = filteredRows.length;
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    const safePage = Math.min(currentPage, totalPages);
    const pagedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);
    const from = pagedRows.length ? (safePage - 1) * pageSize + 1 : 0;
    const to = pagedRows.length ? from + pagedRows.length - 1 : 0;

    useEffect(() => {
        if (currentPage !== safePage) {
            setCurrentPage(safePage);
        }
    }, [currentPage, safePage]);

    const visiblePageNumbers = useMemo(() => {
        const maxButtons = 5;
        const start = Math.max(1, safePage - Math.floor(maxButtons / 2));
        const end = Math.min(totalPages, start + maxButtons - 1);
        const normalizedStart = Math.max(1, end - maxButtons + 1);
        const result = [];
        for (let page = normalizedStart; page <= end; page += 1) {
            result.push(page);
        }
        return result;
    }, [safePage, totalPages]);

    return (
        <Card title="Analytics Logs" subtitle="Track, search and review platform events with fast filtering.">
            <div className="logs-summary-grid">
                <article className="logs-summary-chip">
                    <span>Total Events</span>
                    <strong>{new Intl.NumberFormat("en-IN").format(summary.total)}</strong>
                </article>
                <article className="logs-summary-chip info">
                    <span>Info</span>
                    <strong>{new Intl.NumberFormat("en-IN").format(summary.info)}</strong>
                </article>
                <article className="logs-summary-chip warning">
                    <span>Warning</span>
                    <strong>{new Intl.NumberFormat("en-IN").format(summary.warning)}</strong>
                </article>
                <article className="logs-summary-chip error">
                    <span>Error</span>
                    <strong>{new Intl.NumberFormat("en-IN").format(summary.error)}</strong>
                </article>
            </div>

            <div className="new-admin-toolbar logs-toolbar">
                <label className="new-admin-search toolbar-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by level, label text or timestamp..."
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                    />
                </label>
                <div className="new-admin-toolbar-right">
                    <select
                        className="new-admin-filter-select"
                        value={levelFilter}
                        onChange={(event) => setLevelFilter(event.target.value)}
                    >
                        {levelOptions.map((option) => (
                            <option key={option} value={option}>
                                {option === "All" ? "All Levels" : option}
                            </option>
                        ))}
                    </select>
                    <select
                        className="new-admin-filter-select"
                        value={String(pageSize)}
                        onChange={(event) => setPageSize(Number(event.target.value))}
                    >
                        {PAGE_SIZE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option} / page
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <DataTable
                columns={["#", "Level", "Label (Short Description)", "Timestamp"]}
                rows={pagedRows}
                renderRow={(item, index) => {
                    const fullLabel = normalizeLabelText(item);
                    const { shortText, isLong } = toShortText(fullLabel);
                    return (
                        <tr key={`${fullLabel}-${item.time || ""}-${index}`}>
                            <td data-label="#">{from + index}</td>
                            <td data-label="Level"><StatusPill value={item.level} /></td>
                            <td data-label="Label">
                                <div className="log-snippet-copy">
                                    <span>{shortText}</span>
                                    {isLong ? (
                                        <button
                                            type="button"
                                            className="log-read-more-btn"
                                            onClick={() => setSelectedLabel(fullLabel)}
                                        >
                                            Read More
                                        </button>
                                    ) : null}
                                </div>
                            </td>
                            <td data-label="Timestamp">{item.time}</td>
                        </tr>
                    );
                }}
                footer={
                    <>
                        <span>
                            {total
                                ? `Showing ${from} to ${to} of ${new Intl.NumberFormat("en-IN").format(total)} events`
                                : "No matching events found"}
                        </span>
                        <div className="pager">
                            <button type="button" onClick={() => setCurrentPage(1)} disabled={safePage <= 1}>
                                {"<<"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={safePage <= 1}
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
                            >
                                {">"}
                            </button>
                            <button type="button" onClick={() => setCurrentPage(totalPages)} disabled={safePage >= totalPages}>
                                {">>"}
                            </button>
                        </div>
                    </>
                }
            />
            {!pagedRows.length ? <p className="new-admin-empty-state">No logs found for current filters.</p> : null}

            {selectedLabel ? (
                <div className="new-admin-modal-backdrop" onClick={() => setSelectedLabel(null)}>
                    <div className="new-admin-modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="new-admin-card-head">
                            <div>
                                <h3>Label Details</h3>
                                <p>Full text view</p>
                            </div>
                            <button type="button" className="new-admin-filter-btn small" onClick={() => setSelectedLabel(null)}>
                                Close
                            </button>
                        </div>
                        <pre className="log-full-label">{selectedLabel}</pre>
                    </div>
                </div>
            ) : null}
        </Card>
    );
}
