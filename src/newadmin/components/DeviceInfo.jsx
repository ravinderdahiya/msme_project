import React from "react";
import { CircleDot, Compass, Globe2, Monitor, Smartphone } from "lucide-react";

const browserStyles = {
    Chrome: "bg-blue-50 text-blue-600",
    Edge: "bg-cyan-50 text-cyan-600",
    Firefox: "bg-orange-50 text-orange-600",
    Safari: "bg-sky-50 text-sky-600",
};

const browserIcons = {
    Chrome: CircleDot,
    Edge: Compass,
    Firefox: Globe2,
    Safari: Compass,
};

const platformIcons = {
    Android: Smartphone,
    Windows: Monitor,
    macOS: Monitor,
    iOS: Smartphone,
};

export default function DeviceInfo({ browser = "Chrome", version = "", platform = "Windows", compact = false }) {
    const BrowserIcon = browserIcons[browser] || Globe2;
    const PlatformIcon = platformIcons[platform] || Monitor;
    return (
        <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-2xl shadow-sm ring-1 ring-white ${browserStyles[browser] || browserStyles.Chrome}`}>
                <BrowserIcon size={18} />
            </div>
            <div className="min-w-0">
                <strong className="block truncate text-sm text-slate-900">{browser} {version}</strong>
                {!compact ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                        <PlatformIcon size={12} />
                        {platform}
                    </span>
                ) : null}
            </div>
        </div>
    );
}
