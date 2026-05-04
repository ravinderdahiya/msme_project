import { useCallback, useEffect, useState } from "react";
import { CheckSquare, Compass, LocateFixed, Minus, Plus } from "lucide-react";
import { MapDecorChrome, MapDecorGeometries } from "./MapDecorLayer.jsx";
import { findClosestDecorMarker } from "./mapDecorConfig.js";

const MSME_MAP_IMG = "/public/msmemap.png";

const MIN_SCALE = 1;
const MAX_SCALE = 3.5;
const SCALE_STEP = 0.2;

const BASEMAP_LABELS = ["Light", "Streets", "Satellite", "Terrain"];

export default function MapStage({
  sidePanelOpen,
  onCloseSidePanel,
  bufferOpen,
  bufferApplied,
  bufferVisible,
  setBufferVisible,
  analysisOpen,
  analysisAmenities,
  bufferDistance,
  activeLayerCount,
  onOpenLayers,
  onOpenAnalysis,
}) {
  const [basemapMode, setBasemapMode] = useState(0);
  const [baseMapPopoverOpen, setBaseMapPopoverOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [toast, setToast] = useState(null);

  const basemapSrc = MSME_MAP_IMG;

  const basemapImgClass =
    basemapMode === 1
      ? " nm-map-basemap-img--streets"
      : basemapMode === 2
        ? " nm-map-basemap-img--sat"
        : basemapMode === 3
          ? " nm-map-basemap-img--terrain"
          : "";

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, Math.round((s + SCALE_STEP) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, Math.round((s - SCALE_STEP) * 100) / 100));
  }, []);

  const fitExtent = useCallback(() => {
    setScale(1);
    setToast("View reset to full map extent.");
  }, []);

  const toggleBaseMapPopover = useCallback(() => {
    setBaseMapPopoverOpen((v) => !v);
  }, []);

  const closeBaseMapPopover = useCallback(() => {
    setBaseMapPopoverOpen(false);
  }, []);

  const selectBasemap = useCallback((mode) => {
    setBasemapMode(mode);
    setBaseMapPopoverOpen(false);
    setToast(`Base map: ${BASEMAP_LABELS[mode] ?? "Custom"}.`);
  }, []);

  const onNearby = useCallback(() => {
    onOpenAnalysis?.();
    setToast("Opening proximity / nearby analysis.");
  }, [onOpenAnalysis]);

  const onClosestPoint = useCallback(() => {
    const { approxKm, label } = findClosestDecorMarker();
    setToast(`Closest feature: ${label} (~${approxKm} km from map centre, illustrative).`);
  }, []);

  const onPrint = useCallback(() => {
    setToast("Opening print dialog…");
    window.requestAnimationFrame(() => {
      window.print();
    });
  }, []);

  const onLayers = useCallback(() => {
    onOpenLayers?.();
    setToast("Opening layers panel.");
  }, [onOpenLayers]);

  const onLocate = useCallback(() => {
    fitExtent();
    setToast("Map centred on default Haryana extent.");
  }, [fitExtent]);

  const onStreetView = useCallback(() => {
    setToast("Street view will link to the live map engine when it is connected.");
  }, []);

  const showDecorChrome = !bufferOpen && !analysisOpen;

  useEffect(() => {
    if (!showDecorChrome) setBaseMapPopoverOpen(false);
  }, [showDecorChrome]);

  return (
    <main className="nm-main-panel">
      <section className="nm-map-section">
        <div className="nm-map-frame">
          <div
            className="nm-map-viewport"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            <div className="nm-map-basemap" aria-hidden>
              <img
                className={`nm-map-basemap-img${basemapImgClass}`}
                src={basemapSrc}
                alt=""
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                onError={() => {
                  setToast("Basemap image failed to load. Check that /images/msmemap.png exists.");
                }}
              />
            </div>
            <div className="nm-map-overlay">
              <div className="nm-map-zone" />
            </div>
            <div className="nm-map-decor-layer">
              <MapDecorGeometries />
            </div>
          </div>

          {sidePanelOpen && (
            <button
              type="button"
              className="nm-map-layers-dismiss"
              aria-label="Close panel"
              onClick={onCloseSidePanel}
            />
          )}

          <MapDecorChrome
            showChrome={showDecorChrome}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFitExtent={fitExtent}
            onNearby={onNearby}
            onClosestPoint={onClosestPoint}
            onPrint={onPrint}
            onLayers={onLayers}
            onLocate={onLocate}
            onStreetView={onStreetView}
            baseMapPopoverOpen={baseMapPopoverOpen}
            basemapMode={basemapMode}
            onToggleBaseMapPopover={toggleBaseMapPopover}
            onCloseBaseMapPopover={closeBaseMapPopover}
            onSelectBasemap={selectBasemap}
          />

          {analysisOpen && (
            <div className="nm-analysis-spokes" aria-hidden>
              {analysisAmenities.map((item, idx) => (
                <div
                  key={item.id}
                  className="nm-analysis-spoke"
                  style={{ "--nm-angle": `${(360 / analysisAmenities.length) * idx}deg` }}
                >
                  <span className="nm-analysis-spoke-line" />
                  <span className="nm-analysis-spoke-tag">{item.distance}</span>
                </div>
              ))}
            </div>
          )}
          {bufferOpen && bufferApplied && (
            <div className={`nm-map-buffer-circle${bufferVisible ? "" : " is-hidden"}`} aria-hidden={!bufferVisible} />
          )}
          <div className="nm-map-layer-summary" aria-live="polite">
            {!bufferOpen && !analysisOpen && (
              <>
                {activeLayerCount === 0 && <span>No thematic layers</span>}
                {activeLayerCount > 0 && (
                  <span>
                    {activeLayerCount} layer{activeLayerCount === 1 ? "" : "s"} on map
                  </span>
                )}
              </>
            )}
            {bufferOpen && <span>Buffer: {bufferDistance}</span>}
            {analysisOpen && <span>Proximity analysis active</span>}
          </div>

          {toast && (
            <div className="nm-map-toast" role="status">
              {toast}
            </div>
          )}

          {bufferOpen && (
            <>
              <button type="button" className="nm-map-float-top-btn">
                <LocateFixed size={16} /> Zoom to Buffer
              </button>
              <div className="nm-map-zoom-controls">
                <button type="button" aria-label="Zoom in" onClick={zoomIn}>
                  <Plus size={16} />
                </button>
                <button type="button" aria-label="Zoom out" onClick={zoomOut}>
                  <Minus size={16} />
                </button>
              </div>
              <button
                type="button"
                className={`nm-map-buffer-toggle${bufferVisible ? " active" : ""}`}
                onClick={() => setBufferVisible((prev) => !prev)}
              >
                <CheckSquare size={16} /> Show Buffer
              </button>
            </>
          )}

          {analysisOpen && (
            <button type="button" className="nm-map-float-top-btn">
              <Compass size={16} /> Back to Map
            </button>
          )}

          {/* <div className="nm-map-toolbar">
            <button type="button" className="nm-map-btn" onClick={onOpenLayers}>
              <Layers3 size={16} /> Layers
            </button>
            <button type="button" className="nm-map-btn" onClick={onOpenBuffer}>
              <ShieldCheck size={16} /> Buffer Tool
            </button>
          </div> */}
        </div>
      </section>
    </main>
  );
}
