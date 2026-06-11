import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, Moon, Search, Settings, Sun, X } from "lucide-react";
import { setHttpAuthToken } from "../api/axios";
import { clearAuthSession, getToken } from "../utils/authStorage";
import { logoutApi } from "../services/authService";
import "../pages/newmainmap/NewMainMapHeader.css";
import "./Header_gis_nm.css";
import { MSME_GIS_REOPEN_DRAWER_EVENT } from "./gis/GisMobilePanelCloseBehaviour.jsx";
import {
  GIS_COMPACT_SHELL_MAX_PX,
  GIS_PHONE_MAX_PX,
} from "../gis/msme/gisShellBreakpoints.js";

const SEARCH_PLACEHOLDER = "Search places in Haryana";

const TOOLBAR_DOCK_BP = 1400;
const GIS_TOOL_PANEL_IDS = [
  "spatialPanel",
  "aoiPanel",
  "toolsPanel",
  "selectToolsPanel",
  "measurementPanel",
];
export const MSME_GIS_OPEN_SETTINGS_EVENT = "msme-gis-open-settings";
export const MSME_GIS_CLOSE_DRAWER_EVENT = "msme-gis-close-drawer";

function isAnyGisToolPanelOpen() {
  if (typeof document === "undefined") return false;
  return GIS_TOOL_PANEL_IDS.some((id) => {
    const panel = document.getElementById(id);
    return panel && !panel.classList.contains("collapsed");
  });
}

function useMediaMaxWidth(maxPx) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${maxPx}px)`).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxPx}px)`);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [maxPx]);

  return matches;
}

export default function HeaderGis({
  dmpShell = false,
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
  const settingsRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  /** Desktop / tablet: hide rail for full-width map */
  const [railHidden, setRailHidden] = useState(false);
  /** Mobile: overlay menu open (reference Digital Land Record drawer) */
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [gisToolPanelOpen, setGisToolPanelOpen] = useState(false);

  /** ≤1024px: iPad Mini / tablet + phone compact shell */
  const isCompactShell = useMediaMaxWidth(GIS_COMPACT_SHELL_MAX_PX);
  /** ≤767px: small-phone tweaks only */
  const isPhone = useMediaMaxWidth(GIS_PHONE_MAX_PX);

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
    if (!isCompactShell) setMobileDrawerOpen(false);
  }, [isCompactShell]);

  useEffect(() => {
    const onReopen = () => setMobileDrawerOpen(true);
    window.addEventListener(MSME_GIS_REOPEN_DRAWER_EVENT, onReopen);
    return () => window.removeEventListener(MSME_GIS_REOPEN_DRAWER_EVENT, onReopen);
  }, []);

  useEffect(() => {
    const onOpenSettings = () => setSettingsOpen(true);
    window.addEventListener(MSME_GIS_OPEN_SETTINGS_EVENT, onOpenSettings);
    return () => window.removeEventListener(MSME_GIS_OPEN_SETTINGS_EVENT, onOpenSettings);
  }, []);

  useEffect(() => {
    const onCloseDrawer = () => setMobileDrawerOpen(false);
    window.addEventListener(MSME_GIS_CLOSE_DRAWER_EVENT, onCloseDrawer);
    return () => window.removeEventListener(MSME_GIS_CLOSE_DRAWER_EVENT, onCloseDrawer);
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    function onDocClick(ev) {
      if (settingsRef.current && !settingsRef.current.contains(ev.target)) {
        setSettingsOpen(false);
      }
    }
    function onKey(ev) {
      if (ev.key === "Escape") setSettingsOpen(false);
    }
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [settingsOpen]);

  useEffect(() => {
    const root = document.getElementById("msmeGisRoot");
    if (!root) return;

    let observers = [];
    let retryId = 0;

    const sync = () => {
      const open = isAnyGisToolPanelOpen();
      setGisToolPanelOpen(open);
      root.classList.toggle("msme-gis-mobile-tool-open", open);
    };

    const attach = () => {
      observers.forEach((obs) => obs.disconnect());
      observers = [];

      const panels = GIS_TOOL_PANEL_IDS.map((id) => document.getElementById(id)).filter(Boolean);
      if (!panels.length) return false;

      sync();
      observers = panels.map((panel) => {
        const obs = new MutationObserver(sync);
        obs.observe(panel, { attributes: true, attributeFilter: ["class"] });
        return obs;
      });
      return true;
    };

    if (!attach()) {
      retryId = window.setTimeout(() => attach(), 120);
    }

    return () => {
      window.clearTimeout(retryId);
      observers.forEach((obs) => obs.disconnect());
      root.classList.remove("msme-gis-mobile-tool-open");
    };
  }, []);

  useEffect(() => {
    const root = typeof document !== "undefined" ? document.getElementById("msmeGisRoot") : null;
    if (!root) return;
    root.classList.toggle(
      "msme-gis-rail-hidden",
      (!isCompactShell && railHidden) || (isCompactShell && !mobileDrawerOpen && !gisToolPanelOpen)
    );
    root.classList.toggle("msme-gis-mobile-drawer-open", isCompactShell && mobileDrawerOpen);
    root.classList.toggle("msme-gis-compact-shell", isCompactShell);
    root.classList.toggle("msme-gis-phone-shell", isPhone);
    root.classList.toggle("msme-gis-tablet-shell", isCompactShell && !isPhone);
    return () => {
      root.classList.remove("msme-gis-rail-hidden");
      root.classList.remove("msme-gis-mobile-drawer-open");
      root.classList.remove("msme-gis-compact-shell");
      root.classList.remove("msme-gis-phone-shell");
      root.classList.remove("msme-gis-tablet-shell");
    };
  }, [isCompactShell, isPhone, railHidden, mobileDrawerOpen, gisToolPanelOpen]);

  useEffect(() => {
    if (!isCompactShell || !mobileDrawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCompactShell, mobileDrawerOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (isCompactShell && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
        return;
      }
      /* Close visible GIS bottom sheet first (mobile tool panels live under #rail) */
      if (isCompactShell && !mobileDrawerOpen) {
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
      if (!isCompactShell && railHidden) setRailHidden(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCompactShell, mobileDrawerOpen, railHidden]);

  /* Close mobile drawer after choosing a rail tool (DMP: .nm-rail-btn, legacy: .nm-sidebar-item) */
  useEffect(() => {
    if (!isCompactShell || !mobileDrawerOpen) return;
    const rail = document.getElementById("rail");
    if (!rail) return;
    const onPick = (e) => {
      if (e.target.closest(".nm-rail-btn") || e.target.closest(".nm-sidebar-item")) {
        setMobileDrawerOpen(false);
      }
    };
    rail.addEventListener("click", onPick);
    return () => rail.removeEventListener("click", onPick);
  }, [isCompactShell, mobileDrawerOpen]);

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
  }, [isCompactShell, railHidden, mobileDrawerOpen]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof document === "undefined") return;

    const syncHeaderHeight = () => {
      if (dmpShell) {
        const headerBarH = Math.max(52, Math.ceil(el.getBoundingClientRect().height));
        document.documentElement.style.setProperty("--nm-dmp-header-h", `${headerBarH}px`);

        const toolbar = el.querySelector(".msme-gis-header-toolbar");
        const mapDock = document.getElementById("msmeGisMapToolbarDock");
        const docked =
          typeof window !== "undefined" &&
          window.matchMedia(`(max-width: ${TOOLBAR_DOCK_BP - 1}px)`).matches;
        const mobileMq =
          typeof window !== "undefined" &&
          window.matchMedia(`(max-width: ${GIS_COMPACT_SHELL_MAX_PX}px)`).matches;
        const phoneMq =
          typeof window !== "undefined" &&
          window.matchMedia(`(max-width: ${GIS_PHONE_MAX_PX}px)`).matches;
        let searchDockH = 0;
        if (phoneMq) {
          const searchDock = document.getElementById("msmeGisMapSearchDock");
          if (searchDock) {
            const sh = Math.ceil(searchDock.getBoundingClientRect().height);
            searchDockH = sh > 0 ? sh : 0;
          }
        }

        let dockH = 0;
        if (docked && mapDock) {
          const th = Math.ceil(mapDock.getBoundingClientRect().height);
          dockH = th > 0 ? th + 4 : 0;
        } else if (docked && toolbar) {
          const th = Math.ceil(toolbar.getBoundingClientRect().height);
          dockH = th > 0 ? th + 4 : 0;
        }

        const chromeTop = mobileMq ? headerBarH + searchDockH : headerBarH;
        const totalH = chromeTop + dockH;
        document.documentElement.style.setProperty("--msme-gis-mobile-search-h", `${searchDockH}px`);
        document.documentElement.style.setProperty(
          "--msme-gis-mobile-chrome-top",
          `${chromeTop}px`
        );
        document.documentElement.style.setProperty("--header-h", `${totalH}px`);
        document.documentElement.style.setProperty("--msme-gis-toolbar-dock-h", `${dockH}px`);
        document.documentElement.style.setProperty("--msme-gis-map-toolbar-top", `${totalH}px`);
        document.documentElement.style.setProperty("--msme-gis-content-top", `${totalH}px`);
        try {
          const view = typeof window !== "undefined" ? window.__msmeGisMapView : null;
          if (view && view.destroyed === false && typeof view.resize === "function") {
            view.resize();
          }
        } catch {
          /* ignore */
        }
        return;
      }
      const next = Math.max(70, Math.ceil(el.getBoundingClientRect().height));
      document.documentElement.style.setProperty("--header-h", `${next}px`);
    };

    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);

    const dockMq =
      typeof window !== "undefined"
        ? window.matchMedia(`(max-width: ${TOOLBAR_DOCK_BP - 1}px)`)
        : null;
    const onDockBp = () => syncHeaderHeight();
    dockMq?.addEventListener("change", onDockBp);

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => syncHeaderHeight());
      ro.observe(el);
      const toolbar = el.querySelector(".msme-gis-header-toolbar");
      if (toolbar) ro.observe(toolbar);
      const mapDock = document.getElementById("msmeGisMapToolbarDock");
      if (mapDock) ro.observe(mapDock);
      const searchDock = document.getElementById("msmeGisMapSearchDock");
      if (searchDock) ro.observe(searchDock);
    }

    return () => {
      window.removeEventListener("resize", syncHeaderHeight);
      dockMq?.removeEventListener("change", onDockBp);
      if (ro) ro.disconnect();
    };
  }, [dmpShell, lang, searchQuery, searchBusy, searchExpanded, railHidden, mobileDrawerOpen, isCompactShell]);

  function handleDrawerClick() {
    if (isCompactShell) {
      setMobileDrawerOpen((v) => !v);
    } else {
      setRailHidden((v) => !v);
    }
  }

  const drawerExpanded = isCompactShell ? mobileDrawerOpen : !railHidden;

  return (
    <header
      id="appHeader"
      ref={headerRef}
      className={`nmhdr nmhdr-gis${dmpShell ? " msme-gis-hdr-dmp" : ""}${
        dmpShell && isCompactShell ? " msme-gis-hdr-mobile" : ""
      }`}
    >
      {isCompactShell && mobileDrawerOpen && (
        <button
          type="button"
          className="msme-gis-mobile-drawer-scrim"
          aria-label="Close menu"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
      {dmpShell ? (
        <>
          <div className="nmhdr-dmp-rail-slot">
            <button
              type="button"
              className={`nmhdr-drawer-btn${isCompactShell && mobileDrawerOpen ? " is-close" : ""}`}
              aria-label={
                isCompactShell
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
                isCompactShell
                  ? mobileDrawerOpen
                    ? "Close"
                    : "Map tools"
                  : railHidden
                    ? "Show map tools"
                    : "Full map"
              }
              onClick={handleDrawerClick}
            >
              {isCompactShell && mobileDrawerOpen ? (
                <X size={20} strokeWidth={2} />
              ) : (
                <Menu size={20} strokeWidth={2} />
              )}
            </button>
          </div>
          <div className="nmhdr-dmp-brand">
            <img src="/images/hepc-logo.png" alt="MSME Haryana" className="nmhdr-dmp-logo" />
            <span className="nmhdr-dmp-sep" aria-hidden />
            <div className="nmhdr-dmp-titles">
              <span className="nmhdr-dmp-title">Invest, Haryana</span>
              <span className="nmhdr-dmp-subtitle">GIS Investment Portal, Haryana</span>
            </div>
          </div>
        </>
      ) : (
      <div className="nmhdr-brand">
        <button
          type="button"
          className={`nmhdr-drawer-btn${isCompactShell && mobileDrawerOpen ? " is-close" : ""}`}
          aria-label={
            isCompactShell
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
            isCompactShell
              ? mobileDrawerOpen
                ? "Close"
                : "Map tools"
              : railHidden
                ? "Show map tools"
                : "Full map"
          }
          onClick={handleDrawerClick}
        >
          {isCompactShell && mobileDrawerOpen ? (
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
      )}

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

      <div className="nmhdr-center">
        <form
          id="gis-header-search-form"
          className={`nmhdr-search${searchExpanded ? " is-expanded" : ""}`}
          onSubmit={onSearchSubmit}
          role="search"
          aria-label="Place search"
        >
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
            <Search size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </form>
        <div
          id="msmeGisHeaderToolbar"
          className="msme-gis-header-toolbar"
          aria-label="Map tools"
        />
      </div>

      <div className="nmhdr-actions">
        {isCompactShell ? (
          <div className="nmhdr-settings-wrap" ref={settingsRef}>
            <button
              type="button"
              className={`nmhdr-settings-btn${settingsOpen ? " is-open" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen((v) => !v);
              }}
              aria-expanded={settingsOpen}
              aria-haspopup="dialog"
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} strokeWidth={2} />
            </button>
            {settingsOpen ? (
              <div className="nmhdr-settings-panel" role="dialog" aria-label="Settings">
                <p className="nmhdr-settings-panel__title">Settings</p>
                <button
                  type="button"
                  className="nmhdr-settings-panel__row"
                  onClick={() => {
                    onToggleTheme();
                  }}
                >
                  <span className="nmhdr-settings-panel__icon" aria-hidden>
                    {theme === "black" ? <Sun size={18} /> : <Moon size={18} />}
                  </span>
                  <span>{theme === "black" ? "Light mode" : "Dark mode"}</span>
                </button>
                <fieldset className="nmhdr-settings-panel__lang">
                  <legend className="nmhdr-settings-panel__legend">Language</legend>
                  <label className="nmhdr-settings-panel__radio">
                    <input
                      type="radio"
                      name="gis-lang"
                      checked={lang === enCode}
                      onChange={() => setLang?.(enCode)}
                    />
                    <span>English</span>
                  </label>
                  <label className="nmhdr-settings-panel__radio">
                    <input
                      type="radio"
                      name="gis-lang"
                      checked={lang === hiCode}
                      onChange={() => setLang?.(hiCode)}
                    />
                    <span>Hindi</span>
                  </label>
                </fieldset>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="nmhdr-actions-desktop">
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
        </div>

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
