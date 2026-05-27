import React from "react";

const tones = {
    Active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
    Blocked: "bg-rose-100 text-rose-700 ring-rose-200",
    "Logged Out": "bg-slate-100 text-slate-600 ring-slate-200",
    "High Risk": "bg-rose-100 text-rose-700 ring-rose-200",
};

export default function StatusBadge({ status }) {
    return (
        <span className={`inline-flex min-w-[76px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[status] || tones.Inactive}`}>
            {status}
        </span>
    );
}
