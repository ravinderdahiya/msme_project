export default function SearchPanel() {
  return (
    <div className="search-panel">
      <h3>Advanced Land Search</h3>

      <label>Location</label>
      <input type="text" placeholder="Keyword..." />

      <label>Land Type</label>
      <select>
        <option>Select type</option>
        <option>Industrial</option>
        <option>Commercial</option>
      </select>

      <label>Area Size</label>
      <input type="range" />

      <label>Budget</label>
      <input type="range" />

      <button>Search →</button>
    </div>
  );
}