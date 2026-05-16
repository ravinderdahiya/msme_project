import React from "react";
import { healthStats, servicesHealth } from "./newAdminData";
import { Card, DataTable, StatusPill } from "./AdminUI";

export default function SystemHealthPage() {
    return (
        <div className="new-admin-grid one-one">
            <Card title="Server Overview">
                <div className="report-kpi-grid">
                    {healthStats.map((item) => (
                        <div key={item.label} className="report-kpi-card">
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                            <small className={`tone-${item.tone}`}>Current</small>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Service Health">
                <DataTable
                    columns={["Service Name", "Status", "Response Time", "Last Checked"]}
                    rows={servicesHealth}
                    renderRow={(item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td><StatusPill value={item.status} /></td>
                            <td>{item.response}</td>
                            <td>{item.checked}</td>
                        </tr>
                    )}
                />
            </Card>
        </div>
    );
}
