import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose, size = "max-w-2xl" }) {
    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[1300] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={onClose}
                >
                    <motion.section
                        className={`max-h-[92vh] w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.25)] ${size}`}
                        initial={{ opacity: 0, y: 28, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-bold text-slate-950">{title}</h2>
                            <button type="button" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" onClick={onClose} aria-label="Close">
                                <X size={19} />
                            </button>
                        </header>
                        <div className="max-h-[calc(92vh-76px)] overflow-auto p-6">{children}</div>
                    </motion.section>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
