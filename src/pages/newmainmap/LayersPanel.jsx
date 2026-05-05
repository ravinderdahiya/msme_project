import { useMemo, useRef, useState,useEffect } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";

function GroupCheckbox({ checked, indeterminate, onChange, groupLabel }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="nm-layer-checkbox"
      checked={!!checked && !indeterminate}
      onChange={onChange}
      aria-label={`Toggle all sublayers: ${groupLabel}`}
    />
  );
}

export default function LayersPanel({
  layerSearch,
  setLayerSearch,
  filteredLayerGroups,
  draftLayers,
  toggleLayer,
  toggleLayerGroup,
  onApplyLayers,
  onResetLayers,
  onClose,
}) {
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const toggleExpanded = (groupId) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  const groupStates = useMemo(() => {
    const map = new Map();
    for (const g of filteredLayerGroups) {
      const ids = g.sublayers.map((s) => s.id);
      const onCount = ids.filter((id) => draftLayers[id]).length;
      map.set(g.id, {
        allOn: onCount === ids.length && ids.length > 0,
        noneOn: onCount === 0,
        indeterminate: onCount > 0 && onCount < ids.length,
      });
    }
    return map;
  }, [filteredLayerGroups, draftLayers]);

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
        <ul className="nm-layers-list nm-layers-list--grouped">
          {filteredLayerGroups.map((group) => {
            const st = groupStates.get(group.id);
            const expanded = expandedGroupId === group.id;
            return (
              <li key={group.id} className="nm-layer-group">
                <div className="nm-layer-group-head">
                  <button
                    type="button"
                    className="nm-layer-group-chevron"
                    onClick={() => toggleExpanded(group.id)}
                    aria-expanded={expanded}
                    aria-label={expanded ? `Collapse ${group.label}` : `Expand ${group.label}`}
                  >
                    {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  <label className="nm-layer-row nm-layer-row--group">
                    <GroupCheckbox
                      checked={st?.allOn}
                      indeterminate={st?.indeterminate}
                      onChange={() => toggleLayerGroup(group)}
                      groupLabel={group.label}
                    />
                    <span className="nm-layer-check-visual" aria-hidden />
                    <span className="nm-layer-label nm-layer-label--group">{group.label}</span>
                  </label>
                </div>
                {expanded && (
                  <ul className="nm-sublayer-list">
                    {group.sublayers.map((s) => (
                      <li key={s.id}>
                        <label className="nm-layer-row nm-layer-row--sublayer">
                          <input
                            type="checkbox"
                            className="nm-layer-checkbox"
                            checked={!!draftLayers[s.id]}
                            onChange={() => toggleLayer(s.id)}
                          />
                          <span className="nm-layer-check-visual" aria-hidden />
                          <span className="nm-layer-label">{s.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
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
