import React from "react";
import { logs } from "./newAdminData";
import { Card, DataTable, StatusPill } from "./AdminUI";

export default function LogsPage() {
    return (
        <Card title="System Logs" subtitle="Track recent platform events and issues.">
            <DataTable
                columns={["Level", "Message", "Timestamp"]}
                rows={logs}
                renderRow={(item) => (
                    <tr key={item.message}>
                        <td><StatusPill value={item.level} /></td>
                        <td>{item.message}</td>
                        <td>{item.time}</td>
                    </tr>
                )}
            />
        </Card>
    );
}
