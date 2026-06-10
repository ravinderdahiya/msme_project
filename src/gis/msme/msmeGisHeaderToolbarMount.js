import { useEffect, useState } from "react";

export const MSME_GIS_HEADER_TOOLBAR_SELECTOR = "#appHeader .msme-gis-header-toolbar";
export const MSME_GIS_MAP_TOOLBAR_DOCK_SELECTOR = "#msmeGisMapToolbarDock .msme-gis-header-toolbar";
export const MSME_GIS_TOOLBAR_DOCK_BP = 1400;

/** Pick header slot (desktop) or map overlay dock (tablet/mobile). */
export function resolveHeaderToolbarHost() {
  if (typeof document === "undefined") return null;
  const docked = window.matchMedia(`(max-width: ${MSME_GIS_TOOLBAR_DOCK_BP - 1}px)`).matches;
  if (docked) {
    return document.querySelector(MSME_GIS_MAP_TOOLBAR_DOCK_SELECTOR);
  }
  return document.querySelector(MSME_GIS_HEADER_TOOLBAR_SELECTOR);
}

/** Resolves the toolbar mount node (available once Header_gis / page shell has mounted). */
export function useHeaderToolbarHost() {
  const [host, setHost] = useState(() => resolveHeaderToolbarHost());

  useEffect(() => {
    function sync() {
      const next = resolveHeaderToolbarHost();
      setHost((prev) => (prev === next ? prev : next));
    }

    sync();

    const mq = window.matchMedia(`(max-width: ${MSME_GIS_TOOLBAR_DOCK_BP - 1}px)`);
    const onMq = () => sync();
    mq.addEventListener("change", onMq);

    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mq.removeEventListener("change", onMq);
      mo.disconnect();
    };
  }, []);

  return host;
}
