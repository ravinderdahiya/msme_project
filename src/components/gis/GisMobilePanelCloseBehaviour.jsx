import { useEffect } from "react";

const MOBILE_BP = 768;

export const MSME_GIS_REOPEN_DRAWER_EVENT = "msme-gis-mobile-reopen-drawer";

function isMobileLayout() {
  return typeof window !== "undefined" && window.matchMedia(`(max-width: ${MOBILE_BP}px)`).matches;
}

/**
 * Mobile GIS: panel X — if user did not meaningfully use the tool, reopen the sidebar drawer.
 * Meaningful = input/change, or click except close button (spatial: also excludes A/B/C tabs).
 */
export default function GisMobilePanelCloseBehaviour() {
  useEffect(() => {
    const touched = {
      spatial: false,
      aoi: false,
      tools: false,
      selectTools: false,
      measurement: false,
    };

    function resetWhenPanelOpens(panelEl, key) {
      if (!panelEl) return null;
      const obs = new MutationObserver(() => {
        if (!panelEl.classList.contains("collapsed")) {
          touched[key] = false;
        }
      });
      obs.observe(panelEl, { attributes: true, attributeFilter: ["class"] });
      return obs;
    }

    const spatial = document.getElementById("spatialPanel");
    const aoi = document.getElementById("aoiPanel");
    const tools = document.getElementById("toolsPanel");
    const selectTools = document.getElementById("selectToolsPanel");
    const measurement = document.getElementById("measurementPanel");

    const observers = [
      resetWhenPanelOpens(spatial, "spatial"),
      resetWhenPanelOpens(aoi, "aoi"),
      resetWhenPanelOpens(tools, "tools"),
      resetWhenPanelOpens(selectTools, "selectTools"),
      resetWhenPanelOpens(measurement, "measurement"),
    ].filter(Boolean);

    function markSpatialInteraction(e) {
      if (!spatial?.contains(e.target)) return;
      if (e.target.closest("#btnSpatialClose")) return;
      if (e.target.closest(".st-tabs button.tab")) return;
      touched.spatial = true;
    }

    function markAoiInteraction(e) {
      if (!aoi?.contains(e.target)) return;
      if (e.target.closest("#btnNavClose")) return;
      if (e.target.closest(".modal-tabs > button")) return;
      touched.aoi = true;
    }

    function markToolsInteraction(e) {
      if (!tools?.contains(e.target)) return;
      if (e.target.closest("#btnToolsPanelClose")) return;
      touched.tools = true;
    }

    function markSelectToolsInteraction(e) {
      if (!selectTools?.contains(e.target)) return;
      if (e.target.closest("#btnSelectToolsClose")) return;
      touched.selectTools = true;
    }

    function onSpatialChange() {
      touched.spatial = true;
    }
    function onAoiChange() {
      touched.aoi = true;
    }
    function onToolsChange() {
      touched.tools = true;
    }
    function onSelectToolsChange() {
      touched.selectTools = true;
    }
    function markMeasurementInteraction(e) {
      if (!measurement?.contains(e.target)) return;
      if (e.target.closest("#btnMeasurementClose")) return;
      touched.measurement = true;
    }
    function onMeasurementChange() {
      touched.measurement = true;
    }

    spatial?.addEventListener("click", markSpatialInteraction, true);
    spatial?.addEventListener("change", onSpatialChange);
    spatial?.addEventListener("input", onSpatialChange);

    aoi?.addEventListener("click", markAoiInteraction, true);
    aoi?.addEventListener("change", onAoiChange);
    aoi?.addEventListener("input", onAoiChange);

    tools?.addEventListener("click", markToolsInteraction, true);
    tools?.addEventListener("change", onToolsChange);
    tools?.addEventListener("input", onToolsChange);

    selectTools?.addEventListener("click", markSelectToolsInteraction, true);
    selectTools?.addEventListener("change", onSelectToolsChange);
    selectTools?.addEventListener("input", onSelectToolsChange);

    measurement?.addEventListener("click", markMeasurementInteraction, true);
    measurement?.addEventListener("change", onMeasurementChange);
    measurement?.addEventListener("input", onMeasurementChange);

    function makeCloseHandler(panelId, key) {
      return function handleClose() {
        if (!isMobileLayout()) return;
        const wasTouched = touched[key];
        window.setTimeout(() => {
          const panel = document.getElementById(panelId);
          if (panel?.classList.contains("collapsed") && !wasTouched) {
            window.dispatchEvent(new CustomEvent(MSME_GIS_REOPEN_DRAWER_EVENT));
          }
          touched[key] = false;
        }, 120);
      };
    }

    const hSpatial = makeCloseHandler("spatialPanel", "spatial");
    const hAoi = makeCloseHandler("aoiPanel", "aoi");
    const hTools = makeCloseHandler("toolsPanel", "tools");
    const hSel = makeCloseHandler("selectToolsPanel", "selectTools");
    const hMeasurement = makeCloseHandler("measurementPanel", "measurement");

    const btnSpatial = document.getElementById("btnSpatialClose");
    const btnNav = document.getElementById("btnNavClose");
    const btnTools = document.getElementById("btnToolsPanelClose");
    const btnSel = document.getElementById("btnSelectToolsClose");
    const btnMeasurement = document.getElementById("btnMeasurementClose");

    btnSpatial?.addEventListener("click", hSpatial);
    btnNav?.addEventListener("click", hAoi);
    btnTools?.addEventListener("click", hTools);
    btnSel?.addEventListener("click", hSel);
    btnMeasurement?.addEventListener("click", hMeasurement);

    return () => {
      observers.forEach((o) => o.disconnect());
      spatial?.removeEventListener("click", markSpatialInteraction, true);
      spatial?.removeEventListener("change", onSpatialChange);
      spatial?.removeEventListener("input", onSpatialChange);
      aoi?.removeEventListener("click", markAoiInteraction, true);
      aoi?.removeEventListener("change", onAoiChange);
      aoi?.removeEventListener("input", onAoiChange);
      tools?.removeEventListener("click", markToolsInteraction, true);
      tools?.removeEventListener("change", onToolsChange);
      tools?.removeEventListener("input", onToolsChange);
      selectTools?.removeEventListener("click", markSelectToolsInteraction, true);
      selectTools?.removeEventListener("change", onSelectToolsChange);
      selectTools?.removeEventListener("input", onSelectToolsChange);
      measurement?.removeEventListener("click", markMeasurementInteraction, true);
      measurement?.removeEventListener("change", onMeasurementChange);
      measurement?.removeEventListener("input", onMeasurementChange);
      btnMeasurement?.removeEventListener("click", hMeasurement);
      btnSpatial?.removeEventListener("click", hSpatial);
      btnNav?.removeEventListener("click", hAoi);
      btnTools?.removeEventListener("click", hTools);
      btnSel?.removeEventListener("click", hSel);
    };
  }, []);

  return null;
}
