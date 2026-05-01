export default function AnalysisPanel({ amenities, onClose }) {
  return (
    <aside className="nm-analysis-panel" role="dialog" aria-labelledby="nm-analysis-title">
      <div className="nm-analysis-head">
        <h2 id="nm-analysis-title">Nearby Amenities</h2>
      </div>

      <div className="nm-analysis-sort-wrap">
        <select className="nm-analysis-sort" defaultValue="nearest" aria-label="Sort nearby amenities">
          <option value="nearest">Sort by: Distance (Nearest)</option>
          <option value="farthest">Sort by: Distance (Farthest)</option>
        </select>
      </div>

      <ul className="nm-analysis-list">
        {amenities.map((item) => (
          <li key={item.id} className="nm-analysis-item">
            <span className="nm-analysis-dot" style={{ backgroundColor: item.color }} />
            <div className="nm-analysis-item-text">
              <strong>{item.label}</strong>
              <small>{item.type}</small>
            </div>
            <span className="nm-analysis-distance">{item.distance}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="nm-analysis-view-all" onClick={onClose}>
        View All ({amenities.length})
      </button>
    </aside>
  );
}
