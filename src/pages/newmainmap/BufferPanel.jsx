import { X } from "lucide-react";

export default function BufferPanel({
  bufferDistance,
  setBufferDistance,
  bufferPresets,
  showWithinBuffer,
  setShowWithinBuffer,
  onApplyBuffer,
  onClearBuffer,
  bufferSummary,
  onClose,
}) {
  const total = bufferSummary.reduce((acc, item) => acc + item.count, 0);

  return (
    <aside className="nm-buffer-panel" role="dialog" aria-labelledby="nm-buffer-title">
      <div className="nm-layers-panel-header">
        <h2 id="nm-buffer-title">Buffer Settings</h2>
        <button type="button" className="nm-layers-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <div className="nm-buffer-block">
        <p className="nm-buffer-label">Buffer Distance</p>
        <div className="nm-buffer-pills">
          {bufferPresets.map((distance) => (
            <button
              key={distance}
              type="button"
              className={`nm-buffer-pill${bufferDistance === distance ? " active" : ""}`}
              onClick={() => setBufferDistance(distance)}
            >
              {distance}
            </button>
          ))}
        </div>
      </div>

      <div className="nm-buffer-switch-row">
        <span>Show Results Within Buffer</span>
        <button
          type="button"
          className={`nm-buffer-switch${showWithinBuffer ? " active" : ""}`}
          aria-pressed={showWithinBuffer}
          onClick={() => setShowWithinBuffer((prev) => !prev)}
        >
          <span />
        </button>
      </div>

      <button type="button" className="nm-btn nm-btn-primary" onClick={onApplyBuffer}>
        Apply Buffer
      </button>
      <button type="button" className="nm-btn nm-btn-secondary nm-buffer-clear" onClick={onClearBuffer}>
        Clear
      </button>

      <div className="nm-buffer-summary-card">
        <h3>Summary (Within {bufferDistance})</h3>
        <ul>
          {bufferSummary.map((item) => (
            <li key={item.id}>
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
        <div className="nm-buffer-total">
          <span>Total</span>
          <strong>{total}</strong>
        </div>
      </div>
    </aside>
  );
}
