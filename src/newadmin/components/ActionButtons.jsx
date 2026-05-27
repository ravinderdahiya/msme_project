import React from "react";
import { Eye, Info, MapPin, RotateCcw, ShieldX, Trash2 } from "lucide-react";

export default function ActionButtons({ onDetails, onLocation, onReset, onBlock, onDelete }) {
    const actions = [
        { label: "View Details", icon: Eye, onClick: onDetails, tone: "blue" },
        { label: "View Location", icon: MapPin, onClick: onLocation, tone: "violet" },
        { label: "Reset User Session", icon: RotateCcw, onClick: onReset, tone: "slate" },
        { label: "Block User", icon: ShieldX, onClick: onBlock, tone: "orange" },
        { label: "Delete User", icon: Trash2, onClick: onDelete, tone: "rose" },
    ];

    const tones = {
        blue: "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white",
        violet: "border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white",
        slate: "border-slate-200 bg-white text-slate-700 hover:bg-slate-900 hover:text-white",
        orange: "border-orange-100 bg-orange-50 text-orange-700 hover:bg-orange-500 hover:text-white",
        rose: "border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white",
    };

    return (
        <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-950">Admin Actions</h3>
            </div>
            <div className="grid gap-2">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button key={action.label} type="button" onClick={action.onClick} className={`flex h-10 items-center gap-3 rounded-xl border px-3 text-sm font-bold transition ${tones[action.tone]}`}>
                            <Icon size={16} />
                            {action.label}
                        </button>
                    );
                })}
            </div>
            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-700 ring-1 ring-amber-100">
                All actions are logged for audit & security purposes.
            </p>
        </section>
    );
}
