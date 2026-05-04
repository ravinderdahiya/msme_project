import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, LogIn, Moon, Search, Sparkles, Sun } from "lucide-react";
import "./NewMainMapHeader.css";

const SEARCH_PLACEHOLDER =
  "Search places across Haryana or use the sidebar record search";

export default function NewMainMapHeader({
  search,
  setSearch,
  onSearchSubmit,
  theme = "light",
  onToggleTheme = () => {},
}) {
  const navigate = useNavigate();
  const [langEn, setLangEn] = useState(true);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearchSubmit?.(search);
    },
    [onSearchSubmit, search]
  );

  return (
    <header className="nmhdr">
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
        aria-controls="nmhdr-search-form"
        onClick={() => setSearchExpanded((v) => !v)}
      >
        <Search size={20} strokeWidth={2} />
        <span className="nmhdr-sr-only">Toggle place search</span>
      </button>

      <form
        id="nmhdr-search-form"
        className={`nmhdr-search${searchExpanded ? " is-expanded" : ""}`}
        onSubmit={handleSubmit}
        role="search"
      >
        <span className="nmhdr-search-icon" aria-hidden>
          <Search size={18} strokeWidth={2} />
        </span>
        <input
          type="search"
          name="q"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          aria-label="Search places"
        />
        <button type="submit" className="nmhdr-search-btn">
          Search
        </button>
      </form>

      <div className="nmhdr-actions">
        <button
          type="button"
          className={`nmhdr-theme-btn${theme === "dark" ? " is-dark" : ""}`}
          onClick={onToggleTheme}
          aria-pressed={theme === "dark"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
        </button>
        <button type="button" className="nmhdr-icon-btn" aria-label="Assistant">
          <Sparkles size={18} strokeWidth={2} />
        </button>
        <button type="button" className="nmhdr-icon-btn" aria-label="History">
          <History size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="nmhdr-lang"
          onClick={() => setLangEn((v) => !v)}
          aria-pressed={langEn}
          title="Toggle language"
        >
          <span className={langEn ? "is-active" : ""}>EN</span>
          <span className="nmhdr-lang-sep" aria-hidden>
            |
          </span>
          <span className={!langEn ? "is-active" : ""}>हि</span>
        </button>
        <button
          type="button"
          className="nmhdr-login"
          // onClick={() => navigate("/newLogin")}
        >
          <LogIn size={18} strokeWidth={2} />
          <span className="nmhdr-login-text">Logout</span>
        </button>
      </div>
    </header>
  );
}
