import React from "react";
import DeviceInfo from "./DeviceInfo";
import StatusBadge from "./StatusBadge";

export default function SessionTimeline({ sessions = [], onViewMap, onSessionInfo }) {
    return (
        <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-5 text-base font-bold text-slate-950">Session Timeline</h3>
            <div className="relative space-y-5 before:absolute before:bottom-3 before:left-5 before:top-3 before:w-px before:bg-slate-200">
                {sessions.map((session) => (
                    <article key={session.id} className="relative grid gap-3 pl-14">
                        <span className={`absolute left-[13px] top-2 z-10 h-4 w-4 rounded-full border-4 border-white ${session.isActive ? "bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" : "bg-slate-400"}`} />
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-blue-50/40">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <DeviceInfo browser={session.browser} version={session.browserVersion} platform={session.platform} />
                                <StatusBadge status={session.isActive ? "Active" : "Logged Out"} />
                            </div>
                            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                                <span><strong className="block text-slate-900">Login</strong>{session.loginAt}</span>
                                <span><strong className="block text-slate-900">Logout</strong>{session.logoutAt || "-"}</span>
                                <span><strong className="block text-slate-900">Duration</strong>{session.duration}</span>
                                <span><strong className="block text-slate-900">IP / Location</strong>{session.ipAddress} · {session.location}</span>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button type="button" onClick={() => onViewMap(session)} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700">View Location</button>
                                <button type="button" onClick={() => onSessionInfo(session)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white">Session Info</button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
