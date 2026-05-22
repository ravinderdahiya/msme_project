import React from "react";

export default function Table({ columns, children, emptyMessage, isEmpty, footer }) {
    return (
        <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead>
                        <tr className="bg-slate-50/80">
                            {columns.map((column) => (
                                <th key={column} className="border-b border-slate-200 px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isEmpty ? (
                            <tr>
                                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm font-medium text-slate-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : children}
                    </tbody>
                </table>
            </div>
            {footer ? <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500">{footer}</div> : null}
        </div>
    );
}
