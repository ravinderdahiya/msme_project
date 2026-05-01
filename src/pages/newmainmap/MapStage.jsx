import {
  CheckSquare,
  ChevronDown,
  Compass,
  Layers3,
  LocateFixed,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ZoomIn,
} from "lucide-react";

export default function MapStage({
  search,
  setSearch,
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
  onOpenBuffer,
}) {
  return (
    <main className="nm-main-panel">
      <div className="nm-topbar">
        <div className="nm-search-group">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location..."
          />
        </div>
        <div className="nm-action-group">
          <button type="button" className="nm-btn nm-btn-secondary">
            Select District <ChevronDown size={16} />
          </button>
          <button type="button" className="nm-btn nm-btn-secondary">
            Filters
          </button>
          <button type="button" className="nm-btn nm-btn-secondary nm-btn-icon-only" aria-label="Zoom to selection">
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      <section className="nm-map-section">
        <div className="nm-map-frame">
          {sidePanelOpen && (
            <button
              type="button"
              className="nm-map-layers-dismiss"
              aria-label="Close panel"
              onClick={onCloseSidePanel}
            />
          )}
          <div className="nm-map-overlay">
            <div className="nm-map-zone" />
          </div>
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
          <div className="nm-map-pin" />
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

          {bufferOpen && (
            <>
              <button type="button" className="nm-map-float-top-btn">
                <LocateFixed size={16} /> Zoom to Buffer
              </button>
              <div className="nm-map-zoom-controls">
                <button type="button" aria-label="Zoom in">
                  <Plus size={16} />
                </button>
                <button type="button" aria-label="Zoom out">
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
