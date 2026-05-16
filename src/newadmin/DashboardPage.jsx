import React from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartPoints, recentAnalyses, reports, systemEvents } from "./newAdminData";
import { Card, MiniMapThumb, StatGrid, StatusPill } from "./AdminUI";

export default function DashboardPage() {
    return (
        <>
            <StatGrid />
            <div className="new-admin-grid two-one">
                <Card title="Recent Analyses" action={<button type="button" className="new-admin-text-btn">View All</button>}>
                    <div className="analysis-list">
                        {recentAnalyses.map((item, index) => (
                            <div key={item.title} className="analysis-item">
                                <MiniMapThumb index={index} />
                                <div>
                                    <strong>{item.title}</strong>
                                    <span>{item.location}</span>
                                    <small>{item.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Analysis Overview" action={<button type="button" className="new-admin-filter-btn small">This Month <ChevronDown size={14} /></button>}>
                    <div className="chart-area">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartPoints}>
                                <defs>
                                    <linearGradient id="analysesFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="reportsFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#e8edf5" vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="analyses" stroke="#2563eb" fill="url(#analysesFill)" strokeWidth={3} />
                                <Area type="monotone" dataKey="reports" stroke="#10b981" fill="url(#reportsFill)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Top Layers Used">
                    <div className="donut-wrap">
                        <div className="donut-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Roads", value: 35, fill: "#2563eb" },
                                            { name: "Industries", value: 22, fill: "#60a5fa" },
                                            { name: "Power Stations", value: 15, fill: "#34d399" },
                                            { name: "Schools", value: 10, fill: "#f59e0b" },
                                            { name: "Hospitals", value: 8, fill: "#f97316" },
                                            { name: "Others", value: 10, fill: "#94a3b8" },
                                        ]}
                                        innerRadius={48}
                                        outerRadius={76}
                                        paddingAngle={3}
                                        dataKey="value"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-center">
                                <strong>156</strong>
                                <span>Total</span>
                            </div>
                        </div>

                        <div className="donut-legend">
                            {[
                                ["Roads", "35%", "#2563eb"],
                                ["Industries", "22%", "#60a5fa"],
                                ["Power Stations", "15%", "#34d399"],
                                ["Schools", "10%", "#f59e0b"],
                                ["Hospitals", "8%", "#f97316"],
                                ["Others", "10%", "#94a3b8"],
                            ].map(([label, value, color]) => (
                                <div key={label} className="legend-row">
                                    <span><i style={{ backgroundColor: color }} />{label}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="new-admin-grid one-one">
                <Card title="Reports Summary">
                    <div className="report-summary-list">
                        <div className="report-summary-items">
                            {reports.map((item) => (
                                <div key={item.name} className="summary-row">
                                    <span>{item.name}</span>
                                    <strong>{item.count}</strong>
                                    <small>{item.delta}</small>
                                </div>
                            ))}
                        </div>
                        <div className="summary-ring">
                            <div>
                                <strong>612</strong>
                                <span>Total</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="System Health">
                    <div className="event-list">
                        {systemEvents.map((event) => (
                            <div key={event.event} className="event-row">
                                <div className="event-copy">
                                    <CircleAlert size={15} />
                                    <div>
                                        <strong>{event.event}</strong>
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                                <StatusPill value={event.status} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
}
