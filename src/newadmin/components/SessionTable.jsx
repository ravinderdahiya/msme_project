import React from "react";
import { Info } from "lucide-react";
import StatusBadge from "./StatusBadge";
import Table from "./Table";

export default function SessionTable({ sessions, onSessionInfo }) {
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
                    <td className="px-5 py-4 text-sm text-slate-600">{session.userAgent}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                        <LocationCell session={session} />
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={session.isActive ? "Active" : "Logged Out"} /></td>
                    <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
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

function LocationCell({ session }) {
    const latitude = Number(session?.latitude);
    const longitude = Number(session?.longitude);
    const hasLocation = Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0;

    if (!hasLocation) {
        return (
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                Location unavailable
            </span>
        );
    }

    return (
        <div>
            <strong className="block text-slate-900">{session.locationName || session.location || "Location captured"}</strong>
            <span className="block text-xs font-medium text-slate-500">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
            {session.locationAccuracy ? (
                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                    Accuracy: {session.locationAccuracy}
                </span>
            ) : null}
        </div>
    );
}
