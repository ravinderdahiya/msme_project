import React, { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

const userMarker = L.divIcon({
    className: "",
    html: '<div class="admin-map-pin"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 28],
});

function MapResizer({ center }) {
    const map = useMap();

    useEffect(() => {
        const timer = window.setTimeout(() => {
            map.invalidateSize();
            map.setView(center, 13);
        }, 140);
        return () => window.clearTimeout(timer);
    }, [center, map]);

    return null;
}

export default function MapModal({ session, open, onClose }) {
    if (!session) return null;

    const center = [session.latitude, session.longitude];
    const googleMapsUrl = `https://www.google.com/maps?q=${session.latitude},${session.longitude}`;

    return (
        <Modal open={open} title="Location on Map" onClose={onClose} size="max-w-4xl">
            <div className="overflow-hidden rounded-[18px] border border-slate-200">
                <div className="h-[360px] bg-slate-100">
                    <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
                        <MapResizer center={center} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={center} icon={userMarker}>
                            <Popup>
                                <div className="space-y-1 text-sm">
                                    <strong>{session.latitude}, {session.longitude}</strong>
                                    <p>{session.location}</p>
                                    <a href={googleMapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="grid gap-0 divide-y divide-slate-100 bg-white sm:grid-cols-5 sm:divide-x sm:divide-y-0">
                    <Info label="Latitude" value={session.latitude} />
                    <Info label="Longitude" value={session.longitude} />
                    <Info label="IP Address" value={session.ipAddress} />
                    <Info label="Login Time" value={session.loginAt} />
                    <div className="p-4">
                        <span className="block text-xs font-semibold text-slate-500">Status</span>
                        <div className="mt-2"><StatusBadge status={session.isActive ? "Active" : "Logged Out"} /></div>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
                <a className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700" href={googleMapsUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} />
                    Open in Google Maps
                </a>
                <button type="button" className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={onClose}>
                    Close
                </button>
            </div>
        </Modal>
    );
}

function Info({ label, value }) {
    return (
        <div className="p-4">
            <span className="block text-xs font-semibold text-slate-500">{label}</span>
            <strong className="mt-2 block text-sm text-slate-950">{value}</strong>
        </div>
    );
}
