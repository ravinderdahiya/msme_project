import React from "react";
import { ChevronDown, Plus, Search, Users } from "lucide-react";
import { statCards } from "./newAdminData";
import { statusTone, toneIconMap } from "./adminConfig";

export function StatGrid({ items = statCards }) {
    return (
        <div className="new-admin-stat-grid">
            {items.map((item) => {
                const Icon = toneIconMap[item.tone] || Users;
                return (
                    <article key={item.label} className={`new-admin-stat-card tone-${item.tone}`}>
                        <div className="new-admin-stat-icon">
                            <Icon size={18} />
                        </div>
                        <div>
                            <p>{item.label}</p>
                            <h3>{item.value}</h3>
                            <span>{item.subtext || `${item.change} from last month`}</span>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

export function Card({ title, subtitle, action, children, className = "" }) {
    return (
        <section className={`new-admin-card ${className}`.trim()}>
            {(title || action) && (
                <div className="new-admin-card-head">
                    <div>
                        {title ? <h3>{title}</h3> : null}
                        {subtitle ? <p>{subtitle}</p> : null}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </section>
    );
}

export function StatusPill({ value }) {
    return <span className={`status-pill ${statusTone[value] || "info"}`}>{value}</span>;
}

export function Toolbar({ placeholder, filters = [], cta = "Add New" }) {
    return (
        <div className="new-admin-toolbar">
            <label className="new-admin-search toolbar-search">
                <Search size={16} />
                <input type="text" placeholder={placeholder} />
            </label>
            <div className="new-admin-toolbar-right">
                {filters.map((filter) => (
                    <button key={filter} type="button" className="new-admin-filter-btn">
                        <span>{filter}</span>
                        <ChevronDown size={16} />
                    </button>
                ))}
                <button type="button" className="new-admin-primary-btn">
                    <Plus size={16} />
                    <span>{cta}</span>
                </button>
            </div>
        </div>
    );
}

export function DataTable({ columns, rows, renderRow, footer }) {
    return (
        <div className="new-admin-table-wrap">
            <table className="new-admin-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{rows.map(renderRow)}</tbody>
            </table>
            {footer ? <div className="new-admin-table-footer">{footer}</div> : null}
        </div>
    );
}

export function MiniMapThumb({ index }) {
    return (
        <div className={`mini-map-thumb map-tone-${index % 4}`}>
            <div className="mini-map-road" />
            <div className="mini-map-node node-a" />
            <div className="mini-map-node node-b" />
            <div className="mini-map-node node-c" />
        </div>
    );
}
