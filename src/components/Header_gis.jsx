import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, Moon, Search, Sun, X } from "lucide-react";
import { setHttpAuthToken } from "../api/axios";
import { clearAuthSession, getToken } from "../utils/authStorage";
import { logoutApi } from "../services/authService";
import "../pages/newmainmap/NewMainMapHeader.css";
import "./Header_gis_nm.css";
import { MSME_GIS_REOPEN_DRAWER_EVENT } from "./gis/GisMobilePanelCloseBehaviour.jsx";

const SEARCH_PLACEHOLDER =
  "Search places across Haryana or use the sidebar record search";

const MOBILE_DRAWER_BP = 768;

function useIsMobileNav(breakpoint = MOBILE_DRAWER_BP) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpoint]);

  return isMobile;
}

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
  const location = useLocation();
  const headerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));
  const [searchExpanded, setSearchExpanded] = useState(false);
  /** Desktop / tablet: hide rail for full-width map */
  const [railHidden, setRailHidden] = useState(false);
  /** Mobile: overlay menu open (reference Digital Land Record drawer) */
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isMobile = useIsMobileNav(MOBILE_DRAWER_BP);

  const enCode =
    (languages || []).find((l) => /^en/i.test(String(l.code)))?.code ?? "en";
  const hiCode =
    (languages || []).find((l) => /^hi/i.test(String(l.code)))?.code ?? "hi";

  const cycleLang = useCallback(() => {
    if (!setLang) return;
    setLang(lang === enCode ? hiCode : enCode);
  }, [setLang, lang, enCode, hiCode]);

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(Boolean(getToken()));
    syncAuth();
    window.addEventListener("msme-auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("msme-auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogin = useCallback(() => {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    navigate(`/login?redirect=${redirect}`);
  }, [location.pathname, location.search, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.warn("Logout request failed:", error?.message || error);
    } finally {
      clearAuthSession();
      setHttpAuthToken("");
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileDrawerOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const onReopen = () => setMobileDrawerOpen(true);
    window.addEventListener(MSME_GIS_REOPEN_DRAWER_EVENT, onReopen);
    return () => window.removeEventListener(MSME_GIS_REOPEN_DRAWER_EVENT, onReopen);
  }, []);

  useEffect(() => {
    const root = typeof document !== "undefined" ? document.getElementById("msmeGisRoot") : null;
    if (!root) return;
    root.classList.toggle("msme-gis-rail-hidden", !isMobile && railHidden);
    root.classList.toggle("msme-gis-mobile-drawer-open", isMobile && mobileDrawerOpen);
    return () => {
      root.classList.remove("msme-gis-rail-hidden");
      root.classList.remove("msme-gis-mobile-drawer-open");
    };
  }, [isMobile, railHidden, mobileDrawerOpen]);

  useEffect(() => {
    if (!isMobile || !mobileDrawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileDrawerOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (isMobile && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
        return;
      }
      /* Close visible GIS bottom sheet first (mobile tool panels live under #rail) */
      if (isMobile && !mobileDrawerOpen) {
        const spatial = document.getElementById("spatialPanel");
        const aoi = document.getElementById("aoiPanel");
        const tools = document.getElementById("toolsPanel");
        const selectTools = document.getElementById("selectToolsPanel");
        if (spatial && !spatial.classList.contains("collapsed")) {
          document.getElementById("btnSpatialClose")?.click();
          return;
        }
        if (aoi && !aoi.classList.contains("collapsed")) {
          document.getElementById("btnNavClose")?.click();
          return;
        }
        if (tools && !tools.classList.contains("collapsed")) {
          document.getElementById("btnToolsPanelClose")?.click();
          return;
        }
        if (selectTools && !selectTools.classList.contains("collapsed")) {
          document.getElementById("btnSelectToolsClose")?.click();
          return;
        }
      }
      if (!isMobile && railHidden) setRailHidden(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, mobileDrawerOpen, railHidden]);

  /* Close mobile drawer after choosing a rail tool */
  useEffect(() => {
    if (!isMobile || !mobileDrawerOpen) return;
    const rail = document.getElementById("rail");
    if (!rail) return;
    const onPick = (e) => {
      if (e.target.closest(".nm-sidebar-item")) {
        window.setTimeout(() => setMobileDrawerOpen(false), 280);
      }
    };
    rail.addEventListener("click", onPick);
    return () => rail.removeEventListener("click", onPick);
  }, [isMobile, mobileDrawerOpen]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const view = typeof window !== "undefined" ? window.__msmeGisMapView : null;
        if (view && view.destroyed === false && typeof view.resize === "function") {
          view.resize();
        }
      } catch {
        /* ignore */
      }
    }, 320);
    return () => window.clearTimeout(t);
  }, [isMobile, railHidden, mobileDrawerOpen]);

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
  }, [lang, searchQuery, searchBusy, searchExpanded, railHidden, mobileDrawerOpen]);

  function handleDrawerClick() {
    if (isMobile) {
      setMobileDrawerOpen((v) => !v);
    } else {
      setRailHidden((v) => !v);
    }
  }

  const drawerExpanded = isMobile ? mobileDrawerOpen : !railHidden;

  return (
    <header id="appHeader" ref={headerRef} className="nmhdr nmhdr-gis">
      {isMobile && mobileDrawerOpen && (
        <button
          type="button"
          className="msme-gis-mobile-drawer-scrim"
          aria-label="Close menu"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
      <div className="nmhdr-brand">
        <button
          type="button"
          className={`nmhdr-drawer-btn${isMobile && mobileDrawerOpen ? " is-close" : ""}`}
          aria-label={
            isMobile
              ? mobileDrawerOpen
                ? "Close menu"
                : "Open map tools"
              : railHidden
                ? "Show map tools sidebar"
                : "Hide sidebar — full map"
          }
          aria-expanded={drawerExpanded}
          aria-controls="rail"
          title={
            isMobile
              ? mobileDrawerOpen
                ? "Close"
                : "Map tools"
              : railHidden
                ? "Show map tools"
                : "Full map"
          }
          onClick={handleDrawerClick}
        >
          {isMobile && mobileDrawerOpen ? (
            <X size={20} strokeWidth={2} />
          ) : (
            <Menu size={20} strokeWidth={2} />
          )}
        </button>
        <div className="nmhdr-flip" aria-hidden="true">
          <div className="nmhdr-flip-face">
            <img src="/images/hepc-logo.png" alt="HEPC" />
          </div>
        </div>
        <div className="nmhdr-titles">
          <span className="nmhdr-title">Invest, Haryana</span>
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
        <button
          type="button"
          className={`nmhdr-theme-btn${theme === "black" ? " is-dark" : ""}`}
          onClick={onToggleTheme}
          aria-pressed={theme === "black"}
          aria-label={theme === "black" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "black" ? "Light mode" : "Dark mode"}
        >
          {theme === "black" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
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
        {isLoggedIn ? (
          <button type="button" className="nmhdr-login" onClick={handleLogout}>
            <LogOut size={18} strokeWidth={2} />
            <span className="nmhdr-login-text">Logout</span>
          </button>
        ) : (
          <button
            type="button"
            className="nmhdr-login nmhdr-login--signin"
            onClick={handleLogin}
          >
            <LogIn size={18} strokeWidth={2} />
            <span className="nmhdr-login-text">Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
