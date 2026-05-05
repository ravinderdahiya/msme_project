import { CircleDot, LocateFixed, MapPin, Navigation, Play, SlidersHorizontal, X } from "lucide-react";

export default function AnalysisPanel({ amenities, onClose }) {
  return (
    <aside className="nm-analysis-panel" role="dialog" aria-labelledby="nm-analysis-title">
      <div className="nm-analysis-head">
        <h2 id="nm-analysis-title">Proximity Analysis</h2>
        <button type="button" className="nm-analysis-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <div className="nm-prox-block">
        <h3>Select Analysis Type</h3>
        <div className="nm-prox-choice-list">
          <label className="nm-prox-choice is-active">
            <input type="radio" name="prox-analysis-type" defaultChecked />
            <span>
              <strong>Within Distance</strong>
              <small>Find all features within a specified distance</small>
            </span>
          </label>
          <label className="nm-prox-choice">
            <input type="radio" name="prox-analysis-type" />
            <span>
              <strong>Nearest</strong>
              <small>Find the nearest feature(s)</small>
            </span>
          </label>
        </div>
      </div>

      <div className="nm-prox-block">
        <h3>Choose Reference Point</h3>
        <div className="nm-prox-ref-toggle">
          <button type="button" className="is-active">
            <MapPin size={16} /> Click on Map
          </button>
          <button type="button">
            <LocateFixed size={16} /> Use Location
          </button>
        </div>
        <div className="nm-prox-selected-point">
          <div>
            <MapPin size={16} />
            <span>
              <small>Selected Point</small>
              <strong>29.0587, 76.0856</strong>
            </span>
          </div>
          <button type="button" aria-label="Clear selected point">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="nm-prox-block">
        <h3>Select Layer</h3>
        <button type="button" className="nm-prox-layer-select">
          <span>
            <CircleDot size={16} />
            Hospitals
          </span>
          <Navigation size={16} />
        </button>
      </div>

      <div className="nm-prox-block">
        <h3>Distance</h3>
        <div className="nm-prox-distance-row">
          <input type="number" min={1} defaultValue={5} />
          <select defaultValue="km" aria-label="Distance unit">
            <option value="km">km</option>
            <option value="m">m</option>
          </select>
        </div>
      </div>

      <button type="button" className="nm-prox-run">
        <Play size={14} /> Run Analysis
      </button>

      <div className="nm-prox-results-head">
        <h3>Results ({amenities.length})</h3>
        <button type="button" aria-label="Result filters">
          <SlidersHorizontal size={15} />
        </button>
      </div>

      <ul className="nm-analysis-list">
        {amenities.slice(0, 3).map((item, idx) => (
          <li key={item.id} className="nm-analysis-item">
            <span className="nm-analysis-dot" style={{ backgroundColor: item.color }}>
              <MapPin size={12} />
            </span>
            <div className="nm-analysis-item-text">
              <strong>
                {idx + 1}. {item.label}
              </strong>
              <small>{item.type}</small>
              <em>Open</em>
            </div>
            <span className="nm-analysis-distance">{item.distance}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="nm-analysis-view-all">
        View All Results
      </button>
    </aside>
  );
}
