import React from "react";
import { motion } from "framer-motion";

const toneClasses = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
};

export default function StatsCard({ icon: Icon, label, value, caption = "Live data", tone = "blue" }) {
    return (
        <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.18 }}
            className="rounded-[18px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.06)] backdrop-blur"
        >
            <div className="flex items-start gap-4">
                <div className={`grid h-11 w-11 place-items-center rounded-2xl ring-1 ${toneClasses[tone] || toneClasses.blue}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <strong className="mt-1 block text-3xl leading-none text-slate-950">{value}</strong>
                    <span className="mt-3 block text-xs font-semibold text-emerald-600">{caption}</span>
                </div>
            </div>
        </motion.article>
    );
}
