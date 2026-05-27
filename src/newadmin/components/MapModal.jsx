import React, { useEffect, useRef } from "react";
import { ExternalLink, LocateFixed, ShieldCheck } from "lucide-react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

export default function MapModal({ session, open, onClose }) {
    const mapRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        if (!open || !session || !mapRef.current) return undefined;

        const latitude = Number(session.latitude);
        const longitude = Number(session.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined;

        const map = new Map({ basemap: "streets-vector" });
        const view = new MapView({
            container: mapRef.current,
            map,
            center: [longitude, latitude],
            zoom: 14,
            ui: { components: ["zoom", "attribution"] },
            constraints: { snapToZoom: false },
        });

        const point = new Point({ longitude, latitude });
        const marker = new Graphic({
            geometry: point,
            symbol: new SimpleMarkerSymbol({
                color: [239, 68, 68, 0.95],
                size: 16,
                outline: { color: [255, 255, 255, 1], width: 3 },
            }),
            attributes: {
                title: session.location,
                ipAddress: session.ipAddress,
            },
            popupTemplate: {
                title: "User Login Location",
                content: `${session.location}<br/>${latitude}, ${longitude}<br/>IP: ${session.ipAddress}`,
            },
        });

        view.when(() => {
            view.graphics.add(marker);
            view.goTo({ center: [longitude, latitude], zoom: 15 }, { duration: 600 }).catch(() => {});
        });

        viewRef.current = view;

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, [open, session]);

    if (!session) return null;

    const latitude = Number(session.latitude).toFixed(4);
    const longitude = Number(session.longitude).toFixed(4);
    const arcgisUrl = `https://www.arcgis.com/apps/mapviewer/index.html?center=${session.longitude},${session.latitude}&level=15`;

    return (
        <Modal open={open} title="ArcGIS Location Intelligence" onClose={onClose} size="max-w-5xl">
            <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                <div ref={mapRef} className="h-[480px] w-full bg-slate-100" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose-500/40 animate-ping" />
                <div className="absolute left-5 top-5 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-2xl backdrop-blur">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                        <LocateFixed size={17} className="text-blue-600" />
                        Live Location Snapshot
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-500">{session.location}</p>
                </div>
                <div className="absolute bottom-5 right-5 w-[min(360px,calc(100%-40px))] rounded-[20px] border border-white/40 bg-white/95 p-5 shadow-2xl backdrop-blur">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-950">Location Details</h3>
                            <p className="text-xs font-semibold text-slate-500">ArcGIS session marker</p>
                        </div>
                        <StatusBadge status={session.isActive ? "Active" : "Logged Out"} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Info label="Latitude" value={latitude} />
                        <Info label="Longitude" value={longitude} />
                        <Info label="IP Address" value={session.ipAddress} />
                        <Info label="Accuracy" value={session.accuracy} />
                        <div className="col-span-2">
                            <Info label="Login Time" value={session.loginAt} />
                        </div>
                    </div>
                    <a href={arcgisUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                        <ExternalLink size={16} />
                        Open in ArcGIS Map
                    </a>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                <ShieldCheck size={18} />
                Location records are shown for administrative monitoring and security review.
            </div>
        </Modal>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <span className="block text-[11px] font-bold uppercase text-slate-500">{label}</span>
            <strong className="mt-1 block truncate text-sm text-slate-950">{value || "-"}</strong>
        </div>
    );
}
