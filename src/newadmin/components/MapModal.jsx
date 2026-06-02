import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { parseUserAgent } from "../../utils/userAgent";

export default function MapModal({ session, open, onClose }) {
    const mapRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        if (!open || !session || !mapRef.current) return undefined;

        const latitude = Number(session.latitude);
        const longitude = Number(session.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude === 0 || longitude === 0) return undefined;

        const map = new Map({ basemap: "streets-vector" });
        const view = new MapView({
            container: mapRef.current,
            map,
            center: [longitude, latitude],
            zoom: 14,
            ui: { components: ["zoom", "attribution"] },
            constraints: { snapToZoom: false },
        });

        const marker = new Graphic({
            geometry: new Point({ longitude, latitude }),
            symbol: new SimpleMarkerSymbol({
                color: [37, 99, 235, 0.95],
                size: 15,
                outline: { color: [255, 255, 255, 1], width: 3 },
            }),
            attributes: {
                location: session.locationName || session.location,
                ipAddress: session.ipAddress,
            },
        });

        view.when(() => {
            view.graphics.add(marker);
            view.goTo({ center: [longitude, latitude], zoom: 15 }, { duration: 500 }).catch(() => {});
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

    const latitude = Number(session.latitude);
    const longitude = Number(session.longitude);
    const hasLocation = Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0;
    return (
        <Modal open={open} title="Location on Map" onClose={onClose} size="max-w-4xl">
            <div className="overflow-hidden rounded-[18px] border border-slate-200">
                <div className="h-[360px] bg-slate-100">
                    {hasLocation ? (
                        <div ref={mapRef} className="h-full w-full" />
                    ) : (
                        <div className="grid h-full place-items-center text-sm font-semibold text-slate-500">
                            Location unavailable
                        </div>
                    )}
                </div>
                <div className="grid gap-0 divide-y divide-slate-100 bg-white sm:grid-cols-2 lg:grid-cols-8 sm:divide-x sm:divide-y-0">
                    <Info label="Location" value={hasLocation ? session.locationName || session.location || "Location captured" : "Location unavailable"} className="lg:col-span-2" />
                    <Info label="Coordinates" value={hasLocation ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : "-"} className="lg:col-span-1" />
                    <Info label="Device / Browser" value={parseUserAgent(session.userAgent)} className="lg:col-span-2" />
                    <Info label="IP Address" value={session.ipAddress} className="lg:col-span-1" />
                    <Info label="Login Time" value={session.loginAt} className="lg:col-span-1" />
                    <div className="p-4 lg:col-span-1">
                        <span className="block text-xs font-semibold text-slate-500">Status</span>
                        <div className="mt-2"><StatusBadge status={session.isActive ? "Active" : "Logged Out"} /></div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function Info({ label, value, className = "" }) {
    return (
        <div className={`p-4 ${className}`}>
            <span className="block text-xs font-semibold text-slate-500">{label}</span>
            <strong className="mt-2 block text-sm text-slate-950">{value}</strong>
        </div>
    );
}
