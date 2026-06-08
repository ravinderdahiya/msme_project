import { useEffect, useState } from "react";

export const MSME_GIS_HEADER_TOOLBAR_SELECTOR = "#appHeader .msme-gis-header-toolbar";

/** Resolves the header toolbar mount node (available once Header_gis has mounted). */
export function useHeaderToolbarHost() {
  const [host, setHost] = useState(() => {
    if (typeof document === "undefined") return null;
    return document.querySelector(MSME_GIS_HEADER_TOOLBAR_SELECTOR);
  });

  useEffect(() => {
    function sync() {
      const next = document.querySelector(MSME_GIS_HEADER_TOOLBAR_SELECTOR);
      setHost((prev) => (prev === next ? prev : next));
    }

    sync();

    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => mo.disconnect();
  }, []);

  return host;
}
