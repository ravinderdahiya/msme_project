import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, LogOut, Moon, Search, Sparkles, Sun } from "lucide-react";
import "../pages/newmainmap/NewMainMapHeader.css";
import "./Header_gis_nm.css";

const SEARCH_PLACEHOLDER =
  "Search places across Haryana or use the sidebar record search";

export default function HeaderGis({
  searchQuery,
  setSearchQuery,
  searchBusy,
  onSearchSubmit,
  theme = "white",
  onToggleTheme = () => {},
  lang,
  setLang,
  languages,
}) {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const enCode =
    (languages || []).find((l) => /^en/i.test(String(l.code)))?.code ?? "en";
  const hiCode =
    (languages || []).find((l) => /^hi/i.test(String(l.code)))?.code ?? "hi";

  const cycleLang = useCallback(() => {
    if (!setLang) return;
    setLang(lang === enCode ? hiCode : enCode);
  }, [setLang, lang, enCode, hiCode]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof document === "undefined") return;

    const syncHeaderHeight = () => {
      const next = Math.max(70, Math.ceil(el.getBoundingClientRect().height));
      document.documentElement.style.setProperty("--header-h", `${next}px`);
    };

    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => syncHeaderHeight());
      ro.observe(el);
    }

    return () => {
      window.removeEventListener("resize", syncHeaderHeight);
      if (ro) ro.disconnect();
    };
  }, [lang, searchQuery, searchBusy, searchExpanded]);

  return (
    <header id="appHeader" ref={headerRef} className="nmhdr nmhdr-gis">
      <div className="nmhdr-brand">
        <div className="nmhdr-flip" aria-hidden="true">
          <div className="nmhdr-flip-inner">
            <div className="nmhdr-flip-face">
              <img src="/HARSAC-Logo.png" alt="" />
            </div>
            <div className="nmhdr-flip-face nmhdr-flip-back">
              <img src="/hepc-logo.png" alt="" />
            </div>
          </div>
        </div>
        <div className="nmhdr-titles">
          <span className="nmhdr-title">MSME, Haryana</span>
          <span className="nmhdr-subtitle">GIS Investment Portal, Haryana</span>
        </div>
      </div>

      <button
        type="button"
        className={`nmhdr-search-toggle${searchExpanded ? " is-open" : ""}`}
        aria-expanded={searchExpanded}
        aria-controls="gis-header-search-form"
        onClick={() => setSearchExpanded((v) => !v)}
      >
        <Search size={20} strokeWidth={2} />
        <span className="nmhdr-sr-only">Toggle place search</span>
      </button>

      <form
        id="gis-header-search-form"
        className={`nmhdr-search${searchExpanded ? " is-expanded" : ""}`}
        onSubmit={onSearchSubmit}
        role="search"
        aria-label="Place search"
      >
        <span className="nmhdr-search-icon" aria-hidden>
          <Search size={18} strokeWidth={2} />
        </span>
        <label htmlFor="gisGlobalSearch" className="visually-hidden">
          Search
        </label>
        <input
          id="gisGlobalSearch"
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
          Search
        </button>
      </form>

      <div className="nmhdr-actions">
        {/* <button
          type="button"
          className={`nmhdr-theme-btn${theme === "black" ? " is-dark" : ""}`}
          onClick={onToggleTheme}
          aria-pressed={theme === "black"}
          aria-label={theme === "black" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "black" ? "Light mode" : "Dark mode"}
        >
          {theme === "black" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
        </button> */}
        {/* <button type="button" className="nmhdr-icon-btn" aria-label="Assistant">
          <Sparkles size={18} strokeWidth={2} />
        </button> */}
        <button type="button" className="nmhdr-icon-btn" aria-label="History">
          <History size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="nmhdr-lang"
          onClick={cycleLang}
          aria-label="Switch language"
          title="Switch language"
        >
          <span className={lang === enCode ? "is-active" : ""}>EN</span>
          <span className="nmhdr-lang-sep" aria-hidden>
            |
          </span>
          <span className={lang === hiCode ? "is-active" : ""}>हि</span>
        </button>
        <button type="button" className="nmhdr-login" onClick={() => navigate("/newLogin")}>
          <LogOut size={18} strokeWidth={2} />
          <span className="nmhdr-login-text">Logout</span>
        </button>
      </div>
    </header>
  );
}
