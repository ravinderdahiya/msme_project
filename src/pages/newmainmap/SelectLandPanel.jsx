import { X } from "lucide-react";

export default function SelectLandPanel({ options, selectedOptionId, onSelectOption, onClose }) {
  return (
    <aside className="nm-aoi-panel" role="dialog" aria-labelledby="nm-aoi-title">
      <div className="nm-aoi-head">
        <h2 id="nm-aoi-title">AOI &amp; land</h2>
        <button type="button" className="nm-layers-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <ul className="nm-aoi-list">
        {options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              className={`nm-aoi-item${selectedOptionId === option.id ? " active" : ""}`}
              onClick={() => onSelectOption(option.id)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
