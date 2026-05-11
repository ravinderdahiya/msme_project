import { useEffect, useRef } from "react";

function findBasemapToggle() {
  const viewDiv = document.querySelector("#viewDiv");
  if (!viewDiv) return null;

  function pickToggleFromRoot(root) {
    if (!root) return null;
    return (
      root.querySelector(".esri-expand__toggle") ||
      root.querySelector(".esri-widget--button") ||
      root.querySelector(".esri-button") ||
      root.querySelector("calcite-button.esri-widget--button")
    );
  }

  const icon = viewDiv.querySelector(".esri-icon-basemap");
  if (icon) {
    const root = icon.closest(".esri-expand") || icon.closest(".esri-component");
    const toggle = pickToggleFromRoot(root);
    if (toggle) return toggle;
  }

  const btn = viewDiv.querySelector(".esri-basemap-toggle .esri-widget--button, .esri-basemap-toggle .esri-button");
  if (btn) return btn;

  const expands = Array.from(viewDiv.querySelectorAll(".esri-expand"));
  for (const ex of expands) {
    if (ex.querySelector(".esri-basemap-gallery")) {
      const toggle = pickToggleFromRoot(ex);
      if (toggle) return toggle;
    }
  }

  return null;
}

export default function BasemapButton({ t }) {
  const rootRef = useRef(null);
  const rawLabel = (t && typeof t === "function" ? t("basemap") : null) || "Basemap";
  const label = rawLabel ? String(rawLabel).trim() : "Basemap";
  const labelTitle = label ? label.charAt(0).toUpperCase() + label.slice(1) : "Basemap";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function onClickCapture(ev) {
      if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
      if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
      if (ev && ev.stopImmediatePropagation) ev.stopImmediatePropagation();

      const target = findBasemapToggle();
      if (target && typeof target.click === "function") {
        target.click();
      }
    }

    root.addEventListener("click", onClickCapture, true);

    const originalParent = root.parentElement;
    const originalNextSibling = root.nextSibling;
    let mo = null;
    let moveTimer = null;

    function moveIntoTopRight() {
      const host = document.querySelector("#viewDiv .esri-ui-top-right.esri-ui-corner");
      if (!host || !root) return false;
      if (root.parentElement !== host) host.appendChild(root);
      return true;
    }

    if (!moveIntoTopRight()) {
      mo = new MutationObserver(() => {
        if (moveIntoTopRight() && mo) {
          mo.disconnect();
          mo = null;
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      moveTimer = window.setTimeout(() => {
        if (mo) {
          mo.disconnect();
          mo = null;
        }
      }, 10000);
    }

    return () => {
      root.removeEventListener("click", onClickCapture, true);
      if (mo) mo.disconnect();
      if (moveTimer) window.clearTimeout(moveTimer);
      if (!root || !originalParent) return;
      if (root.parentElement !== originalParent) {
        if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
          originalParent.insertBefore(root, originalNextSibling);
        } else {
          originalParent.appendChild(root);
        }
      }
    };
  }, []);

  return (
    <button
      ref={rootRef}
      type="button"
      id="basemapFab"
      className="buffer-map-fab basemap-map-fab esri-component esri-widget--button"
      data-map-label={labelTitle}
      title={labelTitle}
      aria-label={labelTitle}
      aria-haspopup="dialog"
    >
      <svg viewBox="0 0 24 24" className="buffer-map-fab-ico" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M4.5 4.5h7v7h-7v-7zm8 0h7v7h-7v-7zm-8 8h7v7h-7v-7zm8 0h7v7h-7v-7z"
        />
      </svg>
    </button>
  );
}
