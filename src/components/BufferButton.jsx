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
  var [panelMode, setPanelMode] = useState(null); // "proximity" | "closest" | null
  var [distanceValue, setDistanceValue] = useState(5);
  var [unit, setUnit] = useState("km");
  var [locationText, setLocationText] = useState("");
  var rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(ev) {
      if (!panelMode) return;
      var root = rootRef.current;
      if (!root) return;
      if (!root.contains(ev.target)) setPanelMode(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return function cleanup() {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [panelMode]);

  function stopQuickBufferOnDoubleClick(ev) {
    if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
    if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
    if (window.msmeGisStopQuickBuffer) window.msmeGisStopQuickBuffer();
    setPanelMode(null);
  }

  function distanceMeters() {
    var n = Number(distanceValue);
    if (!isFinite(n) || n <= 0) return 1500;
    if (unit === "km") return Math.round(n * 1000);
    return Math.round(n);
  }

  function startPickMode() {
    var meters = distanceMeters();
    if (panelMode === "closest") {
      if (window.msmeGisStartClosestPointSelection) {
        window.msmeGisStartClosestPointSelection(meters);
      }
      setPanelMode(null);
      return;
    }

    if (window.msmeGisStartQuickBufferWithDistance) {
      window.msmeGisStartQuickBufferWithDistance(meters);
    } else if (window.msmeGisStartQuickBuffer) {
      window.msmeGisStartQuickBuffer();
    }
    setPanelMode(null);
  }

  function applyTypedLocation() {
    var ll = parseLatLon(locationText);
    if (!ll || !window.msmeGisSetBufferAnchorFromWgs) return;
    window.msmeGisSetBufferAnchorFromWgs(ll.lat, ll.lon, {
      distanceM: distanceMeters(),
      runBuffer: true,
      source: "popup-location",
    });
    setPanelMode(null);
  }

  function togglePanel(mode) {
    setPanelMode(function (cur) {
      return cur === mode ? null : mode;
    });
  }

  return (
    <div className="buffer-fab-wrap" ref={rootRef}>
      <button
        type="button"
        id="closestMapFab"
        className="buffer-map-fab closest-map-fab"
        data-map-label="Closest"
        title="Closest"
        aria-label="Closest"
        aria-pressed={panelMode === "closest" ? "true" : "false"}
        onClick={() => togglePanel("closest")}
      >
        <svg
          viewBox="0 0 24 24"
          className="buffer-map-fab-ico"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <circle
            cx="12"
            cy="12"
            r="6.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            opacity="0.9"
          />
          <path
            d="M12 2.8v3.1M12 18.1v3.1M2.8 12h3.1M18.1 12h3.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        type="button"
        id="bufferMapFab"
        className="buffer-map-fab"
        data-map-label="Proximity"
        title="Proximity"
        aria-label="Proximity"
        aria-pressed={panelMode === "proximity" ? "true" : "false"}
        onClick={() => togglePanel("proximity")}
        onDoubleClick={stopQuickBufferOnDoubleClick}
      >
        <svg
          viewBox="0 0 24 24"
          className="buffer-map-fab-ico"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <circle
            cx="12"
            cy="12"
            r="5.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            opacity="0.9"
          />
          <circle
            cx="12"
            cy="12"
            r="8.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.55"
          />
        </svg>
      </button>

      {panelMode ? (
        <div
          className="buffer-mini-panel"
          role="dialog"
          aria-label={panelMode === "closest" ? "Closest Point" : "Near By Proximity"}
        >
          <div className="buffer-mini-panel__head">
            <strong>{panelMode === "closest" ? "Closest Point" : "Near By Proximity"}</strong>
            <button
              type="button"
              className="buffer-mini-panel__close"
              onClick={() => setPanelMode(null)}
              aria-label="Close"
            >
              x
            </button>
          </div>
          <div className="buffer-mini-panel__body">
            <label className="buffer-mini-panel__label">Location</label>
            <div className="buffer-mini-panel__icons" aria-hidden="true"></div>
            <div className="buffer-mini-panel__row">
              <input
                type="number"
                className="buffer-mini-panel__num"
                min="0.1"
                step={unit === "km" ? "0.5" : "100"}
                value={distanceValue}
                onChange={(e) => setDistanceValue(e.target.value)}
              />
              <select
                className="buffer-mini-panel__unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="km">Kilometer</option>
                <option value="m">Meter</option>
              </select>
            </div>

            {panelMode === "proximity" ? (
              <>
                <label className="buffer-mini-panel__label">Input location</label>
                <input
                  type="text"
                  className="buffer-mini-panel__text"
                  placeholder="lat, lon (optional)"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                />
              </>
            ) : null}

            <div className="buffer-mini-panel__actions">
              <button type="button" className="buffer-mini-panel__btn" onClick={startPickMode}>
                Pick on map
              </button>
              {panelMode === "proximity" ? (
                <button
                  type="button"
                  className="buffer-mini-panel__btn is-primary"
                  onClick={applyTypedLocation}
                  disabled={!parseLatLon(locationText)}
                >
                  Run
                </button>
              ) : (
                <button type="button" className="buffer-mini-panel__btn is-primary" onClick={startPickMode}>
                  Run
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
