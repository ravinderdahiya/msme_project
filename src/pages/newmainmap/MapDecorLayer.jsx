import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Car,
  Globe2,
  Layers2,
  MapPin,
  Minus,
  Plane,
  Plus,
  Ruler,
} from "lucide-react";
import { MAP_LEGEND_ITEMS } from "./config.js";
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

function MapLegend() {
  return (
    <div className="nm-map-legend" aria-label="Map legend">
      <ul className="nm-map-legend-list">
        {MAP_LEGEND_ITEMS.map((item) => (
          <li key={item.id} className="nm-map-legend-row">
            <span className={`nm-map-legend-line nm-map-legend-line--${item.style}`} aria-hidden />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="nm-map-scale-meta">
        <span>1 : 829,479</span>
      </div>
      <div className="nm-map-scale-bar" aria-hidden>
        <span>0</span>
        <span className="nm-map-scale-track" />
        <span>20 km</span>
      </div>
    </div>
  );
}

export function MapDecorChrome({
  showChrome,
  onZoomIn,
  onZoomOut,
  onFitExtent,
  onNearby,
  onLayers,
  onLocate,
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
    <div className="nm-map-chrome nm-map-chrome-dmp">
      <MapLegend />

      <div className="nm-map-coord-bar" aria-live="polite">
        <span>Latitude: --</span>
        <span>Longitude: --</span>
      </div>

      <div className="nm-map-chrome-rail nm-map-chrome-rail-dmp">
        <div className="nm-map-chrome-rail-stack">
          <button type="button" className="nm-map-chrome-rail-mini" aria-label="Zoom in" onClick={onZoomIn}>
            <Plus size={15} strokeWidth={2.2} />
          </button>
          <button type="button" className="nm-map-chrome-rail-mini" aria-label="Zoom out" onClick={onZoomOut}>
            <Minus size={15} strokeWidth={2.2} />
          </button>
        </div>
        <button
          type="button"
          className="nm-map-chrome-rail-btn"
          title="Globe / fit extent"
          aria-label="Globe view"
          onClick={onFitExtent}
        >
          <Globe2 size={16} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="nm-map-chrome-rail-btn"
          title="Measurement"
          aria-label="Measurement tool"
          onClick={onNearby}
        >
          <Ruler size={16} strokeWidth={2} />
        </button>
        <div className="nm-basemap-anchor" ref={baseMapAnchorRef}>
          <button
            type="button"
            className="nm-map-chrome-rail-btn"
            title="Base map"
            aria-label="Base map"
            onClick={onToggleBaseMapPopover}
          >
            <Layers2 size={16} strokeWidth={2} />
          </button>
        </div>
        <button
          type="button"
          className="nm-map-chrome-rail-btn"
          title="Layers"
          aria-label="Layers"
          onClick={onLayers}
        >
          <Layers2 size={16} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="nm-map-chrome-rail-btn nm-map-chrome-rail-btn--locate"
          title="Center map"
          aria-label="Center map"
          onClick={onLocate}
        >
          <MapPin size={16} strokeWidth={2} />
        </button>
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
    </div>
  );
}
