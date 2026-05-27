import React from "react";
import { Eye, MapPin, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import Table from "./Table";

function getInitials(name = "") {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function UsersTable({ users, onDetails, onLocation, onDelete, footer }) {
    return (
        <Table columns={["User", "Email", "Role", "Status", "Last Active", "Actions"]} isEmpty={!users.length} emptyMessage="No users match the current filters." footer={footer}>
            {users.map((user, index) => (
                <tr key={user.id} className="transition hover:bg-blue-50/50">
                    <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className={`relative grid h-11 w-11 place-items-center rounded-2xl text-sm font-black ${index % 2 ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700"}`}>
                                {getInitials(user.fullname)}
                                <span className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${user.status === "Active" ? "bg-emerald-500" : user.status === "Blocked" ? "bg-rose-500" : "bg-slate-400"}`} />
                            </div>
                            <div>
                                <strong className="block text-sm text-slate-950">{user.fullname}</strong>
                                <span className="text-xs font-semibold text-slate-500">{user.department}</span>
                            </div>
                        </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{user.email}</td>
                    <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{user.role}</span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={user.status} /></td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-600">{user.lastActive}</td>
                    <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                            <button type="button" title="View Details" onClick={() => onDetails(user)} className="grid h-9 w-9 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white">
                                <Eye size={16} />
                            </button>
                            <button type="button" title="View Location" onClick={() => onLocation(user)} className="grid h-9 w-9 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:bg-violet-600 hover:text-white">
                                <MapPin size={16} />
                            </button>
                            <button type="button" title="Delete User" onClick={() => onDelete(user)} className="grid h-9 w-9 place-items-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </Table>
    );
}
