import { Search } from "lucide-react";

const SEARCH_PLACEHOLDER = "Search places in Haryana";

export default function GisMobileSearchDock({
  searchQuery,
  setSearchQuery,
  searchBusy,
  onSearchSubmit,
}) {
  return (
    <div id="msmeGisMapSearchDock" className="msme-gis-map-search-dock" aria-label="Map search">
      <form
        id="gis-mobile-search-form"
        className="nmhdr-search msme-gis-mobile-search"
        onSubmit={onSearchSubmit}
        role="search"
        aria-label="Place search"
      >
        <label htmlFor="gisMobileGlobalSearch" className="visually-hidden">
          Search
        </label>
        <input
          id="gisMobileGlobalSearch"
          type="search"
          name="q"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          aria-label="Search places"
          disabled={searchBusy}
          autoComplete="off"
        />
        <button type="submit" className="nmhdr-search-btn" disabled={searchBusy} aria-label="Search">
          <Search size={18} strokeWidth={2.25} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
