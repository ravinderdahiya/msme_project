import React from "react";
import { motion } from "framer-motion";

const toneClasses = {
    blue: "from-blue-500 to-cyan-400 text-white shadow-blue-500/25",
    green: "from-emerald-500 to-teal-400 text-white shadow-emerald-500/25",
    orange: "from-orange-500 to-amber-400 text-white shadow-orange-500/25",
    violet: "from-violet-600 to-fuchsia-500 text-white shadow-violet-500/25",
};

const graphTones = {
    blue: "text-blue-500",
    green: "text-emerald-500",
    orange: "text-orange-500",
    violet: "text-violet-500",
};

export default function StatsCard({ icon: Icon, label, value, caption = "Live data", tone = "blue", trend = "+8.4%" }) {
    return (
        <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.18 }}
            className="group overflow-hidden rounded-[18px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.06)] backdrop-blur"
        >
            <div className="flex items-start justify-between gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br shadow-lg ${toneClasses[tone] || toneClasses.blue}`}>
                    <Icon size={20} />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">{trend}</span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <strong className="mt-1 block text-3xl leading-none text-slate-950">{value}</strong>
                    <span className="mt-3 block text-xs font-semibold text-emerald-600">{caption}</span>
                </div>
                <svg className={`h-10 w-24 ${graphTones[tone] || graphTones.blue}`} viewBox="0 0 96 40" fill="none" aria-hidden="true">
                    <path d="M2 31 C14 26, 18 14, 30 20 S45 35, 58 18 S77 5, 94 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M2 31 C14 26, 18 14, 30 20 S45 35, 58 18 S77 5, 94 10 V40 H2 Z" fill="currentColor" opacity="0.08" />
                </svg>
            </div>
        </motion.article>
    );
}
