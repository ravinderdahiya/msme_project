import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useHeaderToolbarHost } from "../gis/msme/msmeGisHeaderToolbarMount.js";

function findArcGisHomeToggle() {
  const viewDiv = document.querySelector("#viewDiv");
  if (!viewDiv) return null;
  const homeRoot = viewDiv.querySelector(".esri-home");
  if (!homeRoot) return null;
  return (
    homeRoot.querySelector("calcite-button.esri-widget--button") ||
    homeRoot.querySelector(".esri-widget--button") ||
    homeRoot.querySelector(".esri-button")
  );
}

export default function HomeButton({ t }) {
  const rootRef = useRef(null);
  const toolbarHost = useHeaderToolbarHost();
  const rawLabel = (t && typeof t === "function" ? t("home") : null) || "Home";
  const label = rawLabel ? String(rawLabel).trim() : "Home";
  const labelTitle = label ? label.charAt(0).toUpperCase() + label.slice(1) : "Home";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function onClickCapture(ev) {
      if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
      if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
      if (ev && ev.stopImmediatePropagation) ev.stopImmediatePropagation();

      if (typeof window !== "undefined" && typeof window.msmeGisShowCurrentLocation === "function") {
        window.msmeGisShowCurrentLocation();
        return;
      }
      const target = findArcGisHomeToggle();
      if (target && typeof target.click === "function") target.click();
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
      id="homeMapFab"
      className="buffer-map-fab home-map-fab esri-component esri-widget--button"
      data-map-label={labelTitle}
      aria-label={labelTitle}
    >
      <svg viewBox="0 0 24 24" className="buffer-map-fab-ico" aria-hidden="true" focusable="false">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
          d="M5 11.5 12 5l7 6.5V19a1 1 0 0 1-1 1h-4.5v-5H10.5v5H6a1 1 0 0 1-1-1v-7.5z"
        />
      </svg>
    </button>
  );

  return toolbarHost ? createPortal(button, toolbarHost) : button;
}
