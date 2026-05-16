import React from "react";
import { reports } from "./newAdminData";
import { Card, DataTable } from "./AdminUI";

export default function ReportsPage() {
    return (
        <div className="new-admin-grid one-one">
            <Card title="Reports Summary">
                <div className="report-kpi-grid">
                    {reports.map((item) => (
                        <div key={item.name} className="report-kpi-card">
                            <span>{item.name}</span>
                            <strong>{item.count}</strong>
                            <small>{item.delta}</small>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Recent Reports">
                <DataTable
                    columns={["Report Type", "Count", "Growth"]}
                    rows={reports}
                    renderRow={(item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.count}</td>
                            <td>{item.delta}</td>
                        </tr>
                    )}
                />
            </Card>
        </div>
    );
}
