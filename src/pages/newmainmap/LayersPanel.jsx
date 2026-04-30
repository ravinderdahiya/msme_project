import { Search, X } from "lucide-react";

export default function LayersPanel({
  layerSearch,
  setLayerSearch,
  filteredLayerItems,
  draftLayers,
  toggleLayer,
  onApplyLayers,
  onResetLayers,
  onClose,
}) {
  return (
    <aside className="nm-layers-panel" role="dialog" aria-labelledby="nm-layers-title">
      <div className="nm-layers-panel-header">
        <h2 id="nm-layers-title">Layers</h2>
        <button type="button" className="nm-layers-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <div className="nm-layers-search">
        <Search size={18} aria-hidden />
        <input
          type="search"
          value={layerSearch}
          onChange={(e) => setLayerSearch(e.target.value)}
          placeholder="Search layers..."
          aria-label="Search layers"
        />
      </div>

      <div className="nm-layers-list-wrap">
        <ul className="nm-layers-list">
          {filteredLayerItems.map((layer) => (
            <li key={layer.id}>
              <label className="nm-layer-row">
                <input
                  type="checkbox"
                  className="nm-layer-checkbox"
                  checked={!!draftLayers[layer.id]}
                  onChange={() => toggleLayer(layer.id)}
                />
                <span className="nm-layer-check-visual" aria-hidden />
                <span className="nm-layer-label">{layer.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="nm-layers-footer">
        <button type="button" className="nm-btn nm-btn-primary nm-layers-apply" onClick={onApplyLayers}>
          Apply Layers
        </button>
        <button type="button" className="nm-layers-reset" onClick={onResetLayers}>
          Reset
        </button>
      </div>
    </aside>
  );
}
