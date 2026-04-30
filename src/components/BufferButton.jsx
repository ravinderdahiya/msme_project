import { useEffect, useRef, useState } from "react";

function parseLatLon(raw) {
  var text = String(raw || "").trim();
  if (!text) return null;
  var parts = text.split(/[,\s]+/).filter(Boolean);
  if (parts.length < 2) return null;
  var a = Number(parts[0]);
  var b = Number(parts[1]);
  if (!isFinite(a) || !isFinite(b)) return null;
  var lat = a;
  var lon = b;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    if (Math.abs(lon) <= 90 && Math.abs(lat) <= 180) {
      var tmp = lat;
      lat = lon;
      lon = tmp;
    }
  }
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat: lat, lon: lon };
}

export default function BufferButton({ t }) {
  var label = t && typeof t === "function" ? t("spatialTabBuffer") : "Buffer";
  var [open, setOpen] = useState(false);
  var [distanceValue, setDistanceValue] = useState(5);
  var [unit, setUnit] = useState("km");
  var [locationText, setLocationText] = useState("");
  var rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(ev) {
      if (!open) return;
      var root = rootRef.current;
      if (!root) return;
      if (!root.contains(ev.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return function cleanup() {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [open]);

  function stopQuickBufferOnDoubleClick(ev) {
    if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
    if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
    if (window.msmeGisStopQuickBuffer) window.msmeGisStopQuickBuffer();
    setOpen(false);
  }

  function distanceMeters() {
    var n = Number(distanceValue);
    if (!isFinite(n) || n <= 0) return 1500;
    if (unit === "km") return Math.round(n * 1000);
    return Math.round(n);
  }

  function startPickMode() {
    var meters = distanceMeters();
    if (window.msmeGisStartQuickBufferWithDistance) {
      window.msmeGisStartQuickBufferWithDistance(meters);
    } else if (window.msmeGisStartQuickBuffer) {
      window.msmeGisStartQuickBuffer();
    }
    setOpen(false);
  }

  function applyTypedLocation() {
    var ll = parseLatLon(locationText);
    if (!ll || !window.msmeGisSetBufferAnchorFromWgs) return;
    window.msmeGisSetBufferAnchorFromWgs(ll.lat, ll.lon, {
      distanceM: distanceMeters(),
      runBuffer: true,
      source: "popup-location",
    });
    setOpen(false);
  }

  return (
    <div className="buffer-fab-wrap" ref={rootRef}>
      <button
        type="button"
        id="bufferMapFab"
        className="buffer-map-fab"
        title={`${label} settings`}
        aria-label="Open buffer panel"
        aria-pressed={open ? "true" : "false"}
        onClick={() => setOpen((s) => !s)}
        onDoubleClick={stopQuickBufferOnDoubleClick}
      >
        <svg
          viewBox="0 0 24 24"
          className="buffer-map-fab-ico"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" opacity="0.9" />
          <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
        </svg>
      </button>

      {open ? (
        <div className="buffer-mini-panel" role="dialog" aria-label="Near By Proximity">
          <div className="buffer-mini-panel__head">
            <strong>Near By Proximity</strong>
            <button type="button" className="buffer-mini-panel__close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <div className="buffer-mini-panel__body">
            <label className="buffer-mini-panel__label">Location</label>
            <div className="buffer-mini-panel__icons" aria-hidden="true">
              <span>⌖</span>
              <span>∿</span>
              <span>▱</span>
            </div>
            <div className="buffer-mini-panel__row">
              <input
                type="number"
                className="buffer-mini-panel__num"
                min="0.1"
                step={unit === "km" ? "0.5" : "100"}
                value={distanceValue}
                onChange={(e) => setDistanceValue(e.target.value)}
              />
              <select className="buffer-mini-panel__unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="km">Kilometer</option>
                <option value="m">Meter</option>
              </select>
            </div>
            <label className="buffer-mini-panel__label">Input location</label>
            <input
              type="text"
              className="buffer-mini-panel__text"
              placeholder="lat, lon (optional)"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
            <div className="buffer-mini-panel__actions">
              <button type="button" className="buffer-mini-panel__btn" onClick={startPickMode}>
                Pick on map
              </button>
              <button
                type="button"
                className="buffer-mini-panel__btn is-primary"
                onClick={applyTypedLocation}
                disabled={!parseLatLon(locationText)}
              >
                Run
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
