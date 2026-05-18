import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analysisTools, chartPoints } from "./newAdminData";
import { Card, DataTable } from "./AdminUI";

export default function AnalysisToolsPage() {
    return (
        <div className="new-admin-grid one-one">
            <Card title="Analysis Tool Performance" subtitle="Execution volume, success rate, and average processing time.">
                <DataTable
                    columns={["Tool", "Runs", "Success Rate", "Average Time"]}
                    rows={analysisTools}
                    renderRow={(item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.runs}</td>
                            <td>{item.success}</td>
                            <td>{item.avgTime}</td>
                        </tr>
                    )}
                />
            </Card>
            <Card title="Monthly Analysis Trend">
                <div className="chart-area tall">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartPoints}>
                            <defs>
                                <linearGradient id="toolTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#e8edf5" vertical={false} />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="analyses" stroke="#0f766e" fill="url(#toolTrend)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
