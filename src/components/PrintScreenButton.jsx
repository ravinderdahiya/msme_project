import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useHeaderToolbarHost } from "../gis/msme/msmeGisHeaderToolbarMount.js";

export default function PrintScreenButton({ t }) {
  const rootRef = useRef(null);
  const toolbarHost = useHeaderToolbarHost();

  function triggerPrint() {
    if (typeof window !== "undefined" && typeof window.msmeGisDownloadClosestPdf === "function") {
      window.msmeGisDownloadClosestPdf();
    } else {
      const legacyBtn = document.getElementById("btnClosestPdf");
      if (legacyBtn && typeof legacyBtn.click === "function") legacyBtn.click();
    }
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function onClickCapture(ev) {
      if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
      if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
      if (ev && ev.stopImmediatePropagation) ev.stopImmediatePropagation();
      triggerPrint();
    }

    root.addEventListener("click", onClickCapture, true);

    return () => {
      root.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  const button = (
    <button
      ref={rootRef}
      type="button"
      id="closestPrintFab"
      className="closest-print-fab esri-component esri-widget--button"
      data-map-label={t?.("printScreenPdf") || "Print"}
      aria-label={t?.("printScreenPdf") || "Print"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M6 9V3h12v6h1a3 3 0 0 1 3 3v5h-4v4H6v-4H2v-5a3 3 0 0 1 3-3h1zm2-4v4h8V5H8zm8 14v-4H8v4h8zM5 11a1 1 0 1 0 0 2h2v-2H5z"
        />
      </svg>
    </button>
  );

  return toolbarHost ? createPortal(button, toolbarHost) : button;
}
