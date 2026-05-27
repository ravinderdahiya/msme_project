import React from "react";
import { Info, MapPin } from "lucide-react";
import DeviceInfo from "./DeviceInfo";
import StatusBadge from "./StatusBadge";
import Table from "./Table";

export default function SessionTable({ sessions, onViewMap, onSessionInfo }) {
    return (
        <Table
            columns={["Login Time", "Logout Time", "IP Address", "Device / Browser", "Location", "Status", "Actions"]}
            isEmpty={!sessions.length}
            emptyMessage="No session activity found for this user."
        >
            {sessions.map((session) => (
                <tr key={session.id} className="transition hover:bg-blue-50/40">
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">{session.loginAt}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{session.logoutAt || "-"}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{session.ipAddress}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                        <DeviceInfo browser={session.browser} version={session.browserVersion} platform={session.platform} />
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                        <strong className="block text-slate-900">{session.latitude}, {session.longitude}</strong>
                        <span>{session.location}</span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={session.isActive ? "Active" : "Logged Out"} /></td>
                    <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                            <button type="button" className="grid h-9 w-9 place-items-center rounded-xl border border-blue-200 text-blue-600 transition hover:bg-blue-600 hover:text-white" title="View Location on Map" onClick={() => onViewMap(session)}>
                                <MapPin size={17} />
                            </button>
                            <button type="button" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-900 hover:text-white" title="Session Info" onClick={() => onSessionInfo(session)}>
                                <Info size={17} />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </Table>
    );
}
