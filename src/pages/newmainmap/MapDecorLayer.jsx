import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Car,
  Crosshair,
  Expand,
  GitBranch,
  Layers2,
  Minus,
  Plane,
  Plus,
  Printer,
  UserRound,
} from "lucide-react";
import { NM_DECOR_MARKERS, NM_DECOR_ROADS } from "./mapDecorConfig.js";

const BASEMAP_OPTIONS = [
  { id: 0, key: "light", label: "Light" },
  { id: 1, key: "streets", label: "Streets" },
  { id: 2, key: "satellite", label: "Satellite" },
  { id: 3, key: "terrain", label: "Terrain" },
];

export function MapDecorGeometries() {
  return (
    <>
      <svg
        className="nm-map-decor-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {NM_DECOR_ROADS.map((d, i) => (
          <path key={i} className="nm-map-decor-road" d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>

      <div className="nm-map-decor-markers" aria-hidden>
        {NM_DECOR_MARKERS.map((m) => {
          if (m.type === "hub") {
            return (
              <div
                key={m.id}
                className="nm-map-marker nm-map-marker--hub"
                style={{ top: `${m.top}%`, left: `${m.left}%` }}
              />
            );
          }
          const Icon = m.type === "plane" ? Plane : Car;
          return (
            <div
              key={m.id}
              className={`nm-map-marker nm-map-marker--${m.type}`}
              style={{ top: `${m.top}%`, left: `${m.left}%` }}
            >
              <Icon size={12} strokeWidth={2.2} aria-hidden />
            </div>
          );
        })}
      </div>
    </>
  );
}

function MapToolBtn({ icon: Icon, label, circled, onClick }) {
  return (
    <button
      type="button"
      className={`nm-map-fake-tool${circled ? " nm-map-fake-tool--circled" : ""}`}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <span className="nm-map-fake-tool-icon">
        <Icon size="1em" strokeWidth={2} aria-hidden />
      </span>
      <span className="nm-map-fake-tool-label">{label}</span>
    </button>
  );
}

export function MapDecorChrome({
  showChrome,
  onZoomIn,
  onZoomOut,
  onFitExtent,
  onNearby,
  onClosestPoint,
  onPrint,
  onLayers,
  onLocate,
  onStreetView,
  baseMapPopoverOpen,
  basemapMode,
  onToggleBaseMapPopover,
  onCloseBaseMapPopover,
  onSelectBasemap,
}) {
  const baseMapAnchorRef = useRef(null);
  const baseMapPopoverRef = useRef(null);
  const [baseMapPopoverPos, setBaseMapPopoverPos] = useState(null);

  const measureBaseMapPopover = () => {
    const el = baseMapAnchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setBaseMapPopoverPos({ top: r.bottom + 8, left: r.left + r.width / 2 });
  };

  useLayoutEffect(() => {
    if (!baseMapPopoverOpen) {
      setBaseMapPopoverPos(null);
      return;
    }
    measureBaseMapPopover();
    const onResizeScroll = () => measureBaseMapPopover();
    window.addEventListener("resize", onResizeScroll);
    window.addEventListener("scroll", onResizeScroll, true);
    return () => {
      window.removeEventListener("resize", onResizeScroll);
      window.removeEventListener("scroll", onResizeScroll, true);
    };
  }, [baseMapPopoverOpen]);

  useEffect(() => {
    if (!baseMapPopoverOpen) return;
    const onDocMouseDown = (e) => {
      const t = e.target;
      if (baseMapAnchorRef.current?.contains(t) || baseMapPopoverRef.current?.contains(t)) return;
      onCloseBaseMapPopover?.();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [baseMapPopoverOpen, onCloseBaseMapPopover]);

  useEffect(() => {
    if (!baseMapPopoverOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseBaseMapPopover?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [baseMapPopoverOpen, onCloseBaseMapPopover]);

  if (!showChrome) return null;

  return (
    <div className="nm-map-chrome">
      <div className="nm-map-chrome-top">
        {/* <MapToolBtn icon={Plus} label="Zoom In" onClick={onZoomIn} />
        <MapToolBtn icon={Minus} label="Zoom Out" circled onClick={onZoomOut} /> */}
        <MapToolBtn icon={Expand} label="Fit Extent" onClick={onFitExtent} />
        <MapToolBtn icon={Crosshair} label="Nearby" onClick={onNearby} />
        <MapToolBtn icon={GitBranch} label="Closest Point" onClick={onClosestPoint} />
        <MapToolBtn icon={Printer} label="Print" onClick={onPrint} />

        <div className="nm-basemap-anchor" ref={baseMapAnchorRef}>
          <MapToolBtn icon={Layers2} label="Base Map" onClick={onToggleBaseMapPopover} />
        </div>

        {baseMapPopoverOpen &&
          baseMapPopoverPos &&
          createPortal(
            <div
              ref={baseMapPopoverRef}
              className="nm-basemap-popover nm-basemap-popover--portal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="nm-basemap-popover-title"
              style={{
                top: `${baseMapPopoverPos.top}px`,
                left: `${baseMapPopoverPos.left}px`,
              }}
            >
              <div className="nm-basemap-popover-head">
                <span id="nm-basemap-popover-title">Base Map</span>
                <Layers2 size={18} strokeWidth={2} aria-hidden className="nm-basemap-popover-head-icon" />
              </div>
              <div className="nm-basemap-popover-row">
                {BASEMAP_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`nm-basemap-option${basemapMode === opt.id ? " is-active" : ""}`}
                    onClick={() => onSelectBasemap?.(opt.id)}
                  >
                    <span className={`nm-basemap-thumb nm-basemap-thumb--${opt.key}`} aria-hidden />
                    <span className="nm-basemap-option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}

        <MapToolBtn icon={Layers2} label="Layers" onClick={onLayers} />
      </div>

      {/* <div className="nm-map-chrome-basemap">
          <span className="nm-map-chrome-basemap-title">Base Map</span>
          <div className="nm-map-chrome-thumbs">
            <div className="nm-map-chrome-thumb is-active">Light</div>
            <div className="nm-map-chrome-thumb">Streets</div>
            <div className="nm-map-chrome-thumb">Satellite</div>
            <div className="nm-map-chrome-thumb">Terrain</div>
          </div>
        </div> */}

      {/* <div className="nm-map-chrome-status">
          <span>Lat: 29.0587</span>
          <span>Lng: 76.0856</span>
          <span>Zoom: 8</span>
        </div> */}

      <div className="nm-map-chrome-rail">
        <button type="button" className="nm-map-chrome-rail-btn" title="Center map" aria-label="Center map" onClick={onLocate}>
          <Crosshair size={16} strokeWidth={2} />
        </button>
        <div className="nm-map-chrome-rail-stack">
          <button type="button" className="nm-map-chrome-rail-mini" aria-label="Zoom in" onClick={onZoomIn}>
            <Plus size={14} />
          </button>
          <button type="button" className="nm-map-chrome-rail-mini" aria-label="Zoom out" onClick={onZoomOut}>
            <Minus size={14} />
          </button>
        </div>
        <button
          type="button"
          className="nm-map-chrome-rail-btn nm-map-chrome-rail-btn--peg"
          title="Street view (with live map)"
          aria-label="Street view"
          onClick={onStreetView}
        >
          <UserRound size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
