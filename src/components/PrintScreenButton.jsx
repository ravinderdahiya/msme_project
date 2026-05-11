import { useEffect, useRef } from "react";

export default function PrintScreenButton({ t }) {
  const rootRef = useRef(null);

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

    const originalParent = root.parentElement;
    const originalNextSibling = root.nextSibling;
    let mo = null;
    let moveTimer = null;

    function moveIntoTopRight() {
      const host = document.querySelector("#viewDiv .esri-ui-top-right.esri-ui-corner");
      if (!host || !root) return false;
      if (root.parentElement !== host) {
        host.appendChild(root);
      }
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
      id="closestPrintFab"
      className="closest-print-fab esri-component esri-widget--button"
      title={t?.("printScreenPdf") || "Print"}
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
}
