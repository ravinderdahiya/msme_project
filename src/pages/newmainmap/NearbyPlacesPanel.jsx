import { useMemo, useState } from "react";
import {
  ChevronDown,
  Crosshair,
  Fuel,
  GraduationCap,
  Hospital,
  SlidersHorizontal,
  X,
} from "lucide-react";

function parseKm(row) {
  if (typeof row.distanceKm === "number") return row.distanceKm;
  const m = String(row.distanceLabel || "").match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

export default function NearbyPlacesPanel({ places, onClose, onAnnounce }) {
  const [categoryKey, setCategoryKey] = useState("all");
  const [moreKey, setMoreKey] = useState("atm");
  const [sortBy, setSortBy] = useState("nearest");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    let list =
      categoryKey === "all"
        ? [...places]
        : categoryKey === "more"
          ? places.filter((p) => p.categoryKey === moreKey)
          : places.filter((p) => p.categoryKey === categoryKey);

    list = list.map((p) => ({ ...p, _km: parseKm(p) }));
    if (sortBy === "nearest") list.sort((a, b) => a._km - b._km);
    else if (sortBy === "farthest") list.sort((a, b) => b._km - a._km);
    else list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return list;
  }, [places, categoryKey, moreKey, sortBy]);

  const shown = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const setPillAll = () => setCategoryKey("all");
  const setPillSchools = () => setCategoryKey("school");
  const setPillHospital = () => setCategoryKey("hospital");
  const setPillPetrol = () => setCategoryKey("petrol");

  const onFilterClick = () => {
    onAnnounce?.("Filters will refine categories and radius when connected.");
  };

  const onViewMore = () => {
    setVisibleCount((c) => c + 8);
    onAnnounce?.("Showing more nearby places.");
  };

  const moreOptions = useMemo(() => {
    const primaryKeys = new Set(["school", "hospital", "petrol"]);
    const labels = { atm: "ATM", bus: "Bus Stand", railway: "Railway", police: "Police", power: "Power" };
    const keys = [...new Set(places.map((p) => p.categoryKey))].filter((k) => k && !primaryKeys.has(k));
    return keys.map((value) => ({ value, label: labels[value] ?? value }));
  }, [places]);

  return (
    <aside className="nm-nearby-panel" role="dialog" aria-labelledby="nm-nearby-title">
      <div className="nm-nearby-head">
        <h2 id="nm-nearby-title">Nearby Places</h2>
        <button type="button" className="nm-nearby-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <div className="nm-nearby-context">
        <div className="nm-nearby-context-text">
          <span className="nm-nearby-context-label">Showing results for</span>
          <strong className="nm-nearby-context-area">Current Map Area</strong>
        </div>
        <div className="nm-nearby-context-icon" aria-hidden>
          <Crosshair size={22} strokeWidth={2} />
        </div>
      </div>

      <div className="nm-nearby-pills" role="tablist" aria-label="Category filter">
        <button
          type="button"
          role="tab"
          aria-selected={categoryKey === "all"}
          className={`nm-nearby-pill${categoryKey === "all" ? " is-active" : ""}`}
          onClick={setPillAll}
        >
          All
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={categoryKey === "school"}
          className={`nm-nearby-pill nm-nearby-pill--outline${categoryKey === "school" ? " is-active" : ""}`}
          onClick={setPillSchools}
        >
          <GraduationCap size={16} aria-hidden /> Schools
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={categoryKey === "hospital"}
          className={`nm-nearby-pill nm-nearby-pill--outline${categoryKey === "hospital" ? " is-active" : ""}`}
          onClick={setPillHospital}
        >
          <Hospital size={16} aria-hidden /> Hospital
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={categoryKey === "petrol"}
          className={`nm-nearby-pill nm-nearby-pill--outline${categoryKey === "petrol" ? " is-active" : ""}`}
          onClick={setPillPetrol}
        >
          <Fuel size={16} aria-hidden /> Petrol Pump
        </button>

        {moreOptions.length > 0 && (
          <div className={`nm-nearby-more${categoryKey === "more" ? " is-active" : ""}`}>
            <span className="nm-nearby-more-static">More</span>
            <select
              className="nm-nearby-more-select"
              aria-label="More categories"
              value={moreOptions.some((o) => o.value === moreKey) ? moreKey : moreOptions[0].value}
              onChange={(e) => {
                setMoreKey(e.target.value);
                setCategoryKey("more");
              }}
            >
              {moreOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="nm-nearby-more-chevr">
              <ChevronDown size={16} aria-hidden />
            </span>
          </div>
        )}
      </div>

      <div className="nm-nearby-toolbar-row">
        <label className="nm-nearby-sort">
          <span className="nm-nearby-sort-label">Sort by:</span>
          <select className="nm-nearby-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort results">
            <option value="nearest">Nearest</option>
            <option value="farthest">Farthest</option>
            <option value="name">Name</option>
          </select>
        </label>
        <button type="button" className="nm-nearby-filter-btn" onClick={onFilterClick}>
          <SlidersHorizontal size={17} aria-hidden /> Filter
        </button>
      </div>

      <ul className="nm-nearby-list">
        {shown.map((row, idx) => (
          <li key={row.id} className="nm-nearby-item">
            <span className="nm-nearby-item-dot" style={{ backgroundColor: row.color }} />
            <div className="nm-nearby-item-body">
              <div className="nm-nearby-item-top">
                <strong className="nm-nearby-item-title">
                  {idx + 1}. {row.name}
                </strong>
                <span className="nm-nearby-item-distance">{row.distanceLabel}</span>
              </div>
              <div className="nm-nearby-item-meta">
                <span className="nm-nearby-item-cat">{row.category}</span>
                <span className={`nm-nearby-item-status${row.status === "Open" ? " is-open" : ""}`}>{row.status}</span>
              </div>
            </div>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="nm-nearby-empty">
            No places match this category. Try <button type="button" onClick={setPillAll}>All</button>.
          </li>
        )}
      </ul>

      {filtered.length > 0 && (
        <div className="nm-nearby-footer">
          <button type="button" className="nm-nearby-view-more" disabled={!hasMore} onClick={hasMore ? onViewMore : undefined}>
            View More Results <ChevronDown size={18} aria-hidden />
          </button>
        </div>
      )}
    </aside>
  );
}
