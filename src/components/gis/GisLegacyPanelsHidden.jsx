/**
 * GIS panel DOM — required by initMsmeWebGis (getElementById / LayerList mount).
 * Mounted inside `#rail` beside the nm-sidebar controls; styled by MSMEGisPageShell.css.
 */
import { useEffect, useMemo, useState } from "react";
import { POI_LAYERS } from "../../gis/msme/serviceUrlsAndLayers.js";
import { haversineMeters } from "../../gis/msme/geometryUtils.js";
import { closeMeasurementPanel } from "../../gis/msme/measurementPanelShell.js";
import GisPanelHeader from "./GisPanelHeader.jsx";
import "../../css/MeasurementDistancePanel.css";

const ANALYZE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" focusable="false">
    <path d="M4 18V6M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 14l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ROUTE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" focusable="false">
    <path d="M5 19c2-4 4-6 7-6s5 2 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="7" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

function AoiAccTab({ id, panelId, label }) {
  return (
    <button type="button" id={id} data-mpanel={panelId} className="aoi-acc-tab">
      <span className="aoi-acc-tab__label">{label}</span>
      <span className="aoi-acc-tab__chev" aria-hidden />
    </button>
  );
}

const SPATIAL_DISTANCE_UNIT_OPTIONS = (
  <>
    <option value="km">Kilometer</option>
    <option value="m">Meter</option>
    <option value="yd">Yard</option>
    <option value="ft">Feet</option>
  </>
);

function populatePoiCheckboxGrid(containerId, checkboxClass, selectAllId) {
  const container = document.getElementById(containerId);
  if (!container || container.children.length > 0) return;

  POI_LAYERS.forEach((layer) => {
    const isDefaultOff = /bus\s*stops?|metro\s*network/i.test(String(layer?.label || ""));
    const label = document.createElement("label");
    label.innerHTML =
      `<input type="checkbox" class="${checkboxClass}" data-url="${layer.url}" data-layer="${layer.layerId}" ${isDefaultOff ? "" : "checked"} /> ` +
      layer.label;
    container.appendChild(label);
  });

  const selectAll = document.getElementById(selectAllId);
  if (selectAll && !selectAll.dataset.poiBound) {
    selectAll.dataset.poiBound = "1";
    selectAll.addEventListener("change", function onSelectAllChange() {
      container.querySelectorAll(`.${checkboxClass}`).forEach((input) => {
        input.checked = selectAll.checked;
      });
    });
  }
}

function parseMeasureCoord(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

function isValidMeasureLat(lat) {
  return Number.isFinite(lat) && Math.abs(lat) <= 90;
}

function isValidMeasureLon(lon) {
  return Number.isFinite(lon) && Math.abs(lon) <= 180;
}

function formatMeasureMeters(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n >= 1000) {
    return `${(n / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km (${Math.round(n)} m)`;
  }
  return `${Math.round(n)} m`;
}

function formatMeasureKm(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n >= 1) {
    return `${n.toLocaleString(undefined, { maximumFractionDigits: 3 })} km`;
  }
  return `${(n * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} m`;
}

export default function GisLegacyPanelsHidden({ t }) {
  const [layerSearch, setLayerSearch] = useState("");
  const [measureLat1, setMeasureLat1] = useState("");
  const [measureLon1, setMeasureLon1] = useState("");
  const [measureLat2, setMeasureLat2] = useState("");
  const [measureLon2, setMeasureLon2] = useState("");
  const [measureLineDistanceM, setMeasureLineDistanceM] = useState(null);
  const [measureLineDrawing, setMeasureLineDrawing] = useState(false);

  const measureDistanceM = useMemo(function () {
    const aLat = parseMeasureCoord(measureLat1);
    const aLon = parseMeasureCoord(measureLon1);
    const bLat = parseMeasureCoord(measureLat2);
    const bLon = parseMeasureCoord(measureLon2);
    if (!isValidMeasureLat(aLat) || !isValidMeasureLon(aLon) || !isValidMeasureLat(bLat) || !isValidMeasureLon(bLon)) {
      return null;
    }
    return haversineMeters(aLon, aLat, bLon, bLat);
  }, [measureLat1, measureLon1, measureLat2, measureLon2]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer = null;

    function ensurePoiGrids() {
      if (cancelled) return;
      populatePoiCheckboxGrid("bufCheckboxes", "buf-cb", "bufCheckAll");
      populatePoiCheckboxGrid("closestCheckboxes", "closest-cb", "closestCheckAll");
      attempts += 1;
      if (attempts < 40) {
        timer = window.setTimeout(ensurePoiGrids, 300);
      }
    }

    ensurePoiGrids();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("layerListContainer");
    if (!container) return;

    const applyThemeVars = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "black";
      const darkText = "#0f233f";
      const mutedText = "#5f718f";

      // Set vars on container (cascades into Calcite web-components).
      container.style.setProperty("--calcite-color-text-1", darkText);
      container.style.setProperty("--calcite-color-text-2", mutedText);
      container.style.setProperty("--calcite-color-text-3", mutedText);
      container.style.setProperty("--calcite-color-icon", mutedText);
      container.style.setProperty("--calcite-color-brand", "#2159d8");
      container.style.setProperty("--calcite-color-brand-hover", "#2159d8");
      container.style.setProperty("--calcite-color-background", isDark ? "#ffffff" : "transparent");
      container.style.setProperty("--calcite-color-foreground-1", "#ffffff");
      container.style.setProperty("--calcite-color-foreground-2", "#ffffff");
      container.style.setProperty("--calcite-color-foreground-3", "#ffffff");

      // Ensure list + items are not dimmed by internal defaults.
      const lists = container.querySelectorAll("calcite-list, calcite-list-item");
      lists.forEach((el) => {
        el.style.setProperty("--calcite-color-text-1", darkText);
        el.style.setProperty("--calcite-color-text-2", mutedText);
        el.style.setProperty("--calcite-color-icon", mutedText);
        el.style.setProperty("--calcite-color-brand", "#2159d8");
        el.style.setProperty("--calcite-ui-foreground-hover", "rgba(33,89,216,0.08)");
        el.style.setProperty("--calcite-color-background", "#ffffff");
        el.style.setProperty("--calcite-color-foreground-1", "#ffffff");
        el.style.setProperty("--calcite-color-foreground-2", "#ffffff");
        el.style.setProperty("--calcite-color-foreground-3", "#ffffff");
        if (isDark) el.setAttribute("calcite-mode", "light");
        el.style.opacity = "1";
        el.style.filter = "none";
      });
    };

    // Observe LayerList DOM updates (LayerList renders async + updates as layers load).
    const mo = new MutationObserver(() => applyThemeVars());
    mo.observe(container, { childList: true, subtree: true });

    // Observe theme changes.
    const ao = new MutationObserver(() => applyThemeVars());
    ao.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "calcite-mode"] });

    applyThemeVars();
    return () => {
      mo.disconnect();
      ao.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("layerListContainer");
    if (!root) return;

    const q = String(layerSearch || "").trim().toLowerCase();
    const items = root.querySelectorAll("calcite-list-item, .esri-layer-list__item, [role='listitem']");
    if (!q) {
      items.forEach((el) => {
        el.style.removeProperty("display");
      });
      return;
    }

    items.forEach((el) => {
      const txt = (el.textContent || "").trim().toLowerCase();
      el.style.display = txt.includes(q) ? "" : "none";
    });
  }, [layerSearch]);

  useEffect(function () {
    function onLineDistance(ev) {
      const meters = ev && ev.detail ? ev.detail.meters : null;
      if (meters == null) {
        setMeasureLineDistanceM(null);
        return;
      }
      setMeasureLineDistanceM(Number(meters));
      setMeasureLineDrawing(false);
    }
    window.addEventListener("msme-measurement-line-distance", onLineDistance);
    return function () {
      window.removeEventListener("msme-measurement-line-distance", onLineDistance);
    };
  }, []);

  useEffect(function () {
    const panel = document.getElementById("measurementPanel");
    if (!panel) return;

    function onPanelClosed() {
      setMeasureLineDrawing(false);
      if (typeof window.msmeGisStopMeasurementLineDraw === "function") {
        window.msmeGisStopMeasurementLineDraw();
      }
    }

    const obs = new MutationObserver(function () {
      if (panel.classList.contains("collapsed")) onPanelClosed();
    });
    obs.observe(panel, { attributes: true, attributeFilter: ["class"] });
    return function () {
      obs.disconnect();
      onPanelClosed();
    };
  }, []);

  function startMeasureLineDraw() {
    if (typeof window.msmeGisStartMeasurementLineDraw !== "function") {
      window.alert(t("measurementMapNotReady"));
      return;
    }
    const ok = window.msmeGisStartMeasurementLineDraw();
    if (!ok) {
      window.alert(t("measurementMapNotReady"));
      return;
    }
    setMeasureLineDrawing(true);
    setMeasureLineDistanceM(null);
  }

  function clearMeasureLineDraw() {
    if (typeof window.msmeGisClearMeasurementLine === "function") {
      window.msmeGisClearMeasurementLine();
    }
    setMeasureLineDrawing(false);
    setMeasureLineDistanceM(null);
  }

  function resetLayerSearch() {
    setLayerSearch("");
  }

  function applyLayersClosePanel() {
    const btn = document.getElementById("btnTogglePanel");
    if (btn && typeof btn.click === "function") btn.click();
  }

  return (
    <div className="nm-sidebar-gis-panels">
      <aside
        id="spatialPanel"
        className="spatial-panel collapsed"
        aria-hidden="true"
        aria-labelledby="spatialPanelTitle"
      >
        <GisPanelHeader
          titleId="spatialPanelTitle"
          title={t("spatialTitle")}
          closeId="btnSpatialClose"
          closeTitle={t("closePanel")}
        />
        <div className="sp-scroll">
          <div id="spatialToolbar" aria-label={t("spatialToolbarAria")}>
            <div className="st-tabs" role="tablist">
              <button type="button" className="tab active" data-panel="pA" role="tab">
                {t("spatialTabBuffer")}
              </button>
              <button type="button" className="tab" data-panel="pB" role="tab">
                {t("spatialTabProximity")}
              </button>
              <button type="button" className="tab" data-panel="pC" role="tab">
                {t("spatialTabIntersect")}
              </button>
            </div>

            <div className="st-panels">
              <div id="pA" className="panel active" role="tabpanel">
                <div className="buffer-mark-row">
                  <input
                    type="number"
                    id="bufferPickDistNum"
                    className="closest-dist-num"
                    min="0.1"
                    step="0.5"
                    defaultValue="5"
                    aria-label="Buffer distance value"
                  />
                  <select id="bufferPickDistUnit" className="sm" defaultValue="km" aria-label="Buffer distance unit">
                    {SPATIAL_DISTANCE_UNIT_OPTIONS}
                  </select>
                  <button type="button" className="btn-secondary" id="btnBufferPickPoint">
                    {t("closestPickPoint")}
                  </button>
                  <button type="button" className="btn-ghost" id="btnBufferClearMark">
                    {t("bufferClearMark")}
                  </button>
                  {/* <button type="button" className="btn-secondary" id="btnTrackPickPoint">
                    NH-44 Select (500m)
                  </button> */}
                </div>
                {/* <div className="row">
                  <span className="lbl">{t("bufferQueryRadius")}</span>
                  <input type="range" id="bufMarkQueryRadius" min="1000" max="15000" step="500" defaultValue="5000" />
                  <span className="val" id="bufMarkQueryRadiusVal">
                    5000
                  </span>
                </div> */}
                <div className="row">
                  {/* <span className="lbl">{t("bufferRoadSource")}</span>
                  <select id="bufRoadLayer" className="sm" title={t("bufRoadLayerTitle")} defaultValue="4">
                    <option value="4">{t("bufRoadOptLine")}</option>
                    <option value="0">{t("bufRoadOptAir")}</option>
                  </select>
                  <span className="lbl">{t("bufferDistance")}</span>
                  <input type="range" id="bufDist" min="100" max="5000" step="100" defaultValue="1500" />
                  <span className="val" id="bufDistVal">
                    1500
                  </span> */}
                  <button type="button" className="btn-run" id="runBuffer">
                    {t("runBuffer")}
                  </button>
                </div>
                <div className="row">
                  <label>
                    <input type="checkbox" id="bufCheckAll" defaultChecked /> {t("proximitySelectPoi")}
                  </label>
                </div>
                <div id="bufCheckboxes" className="chk-grid"></div>
                {/* <div className="buffer-mark-row">
                  <button type="button" className="btn-secondary" id="btnBufferPdf">
                    Download buffer PDF
                  </button>
                </div> */}
                {/* <p className="panel-hint">{t("bufferHint")}</p> */}
              </div>

              <div id="pB" className="panel" role="tabpanel">
                <div className="row">
                  <input
                    type="number"
                    id="proximityPickDistNum"
                    className="closest-dist-num"
                    min="0.1"
                    step="0.5"
                    defaultValue="5"
                    aria-label="Proximity distance value"
                  />
                  <select id="proximityPickDistUnit" className="sm" defaultValue="km" aria-label="Proximity distance unit">
                    {SPATIAL_DISTANCE_UNIT_OPTIONS}
                  </select>
                  <button type="button" className="btn-secondary" id="btnProximityPickPoint">
                    {t("closestPickPoint")}
                  </button>
                </div>
                <div className="row">
                  {/* <label>
                    <input type="checkbox" id="proxCheckAll" /> {t("proximitySelectPoi")}
                  </label>
                  <span className="lbl">{t("proximityMaxDist")}</span>
                  <input type="range" id="proxDist" min="100" max="10000" step="100" defaultValue="2000" />
                  <span className="val" id="proxDistVal">
                    2000
                  </span> */}
                  <button type="button" className="btn-run" id="runProximity">
                    {t("proximityRun")}
                  </button>
                </div>
                <div id="proxCheckboxes" className="chk-grid"></div>
                {/* <p className="panel-hint">{t("proximityHint")}</p> */}
              </div>

              <div id="pC" className="panel" role="tabpanel">
               
                <div className="row">
                  <span className="lbl">{t("closestBufferDist")}</span>
                  <input
                    type="number"
                    id="closestDistNum"
                    className="closest-dist-num"
                    min="0.1"
                    step="0.5"
                    defaultValue="5"
                    aria-label="Closest distance value"
                  />
                  <select id="closestDistUnit" className="sm" defaultValue="km" aria-label="Closest distance unit">
                    {SPATIAL_DISTANCE_UNIT_OPTIONS}
                  </select>
                  <button type="button" className="btn-secondary" id="btnClosestPickPoint">
                    {t("closestPickPoint")}
                  </button>
                </div>
                <div className="row">
                  <label>
                    <input type="checkbox" id="closestCheckAll" defaultChecked /> {t("proximitySelectPoi")}
                  </label>
                </div>
                <div id="closestCheckboxes" className="chk-grid"></div>
              </div>

              <div id="pE" className="panel" role="tabpanel">
                <div className="row">
                  <span className="lbl">{t("suitNearRoad")}</span>
                  <input type="range" id="suitDist" min="500" max="10000" step="100" defaultValue="2000" />
                  <span className="val" id="suitDistVal">
                    2000
                  </span>
                  <button type="button" className="btn-run" id="runSuitability">
                    {t("suitRun")}
                  </button>
                </div>
                <p className="panel-hint">{t("suitHint")}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <aside
        id="toolsPanel"
        className="gis-tools-layer-panel collapsed"
        aria-hidden="true"
        role="complementary"
        aria-labelledby="gisToolsPanelTitle"
      >
        <GisPanelHeader
          titleId="gisToolsPanelTitle"
          title={t("layersTitle")}
          closeId="btnToolsPanelClose"
          closeTitle={t("closePanel")}
        />
        <div className="gis-tools-layer-search">
          <span className="gis-tools-layer-search-ico" aria-hidden>
            🔎
          </span>
          <input
            type="search"
            value={layerSearch}
            onChange={(e) => setLayerSearch(e.target.value)}
            placeholder="Search layers..."
            aria-label="Search layers"
          />
        </div>
        <div className="tp-scroll">
          <div id="layerListContainer" className="gis-layer-list-mount" />
          {/* <div id="status" /> */}
        </div>
        {/* <div className="gis-tools-layer-footer">
          <button type="button" className="nm-btn nm-btn-primary gis-tools-layer-apply" onClick={applyLayersClosePanel}>
            Apply Layers
          </button>
          <button type="button" className="gis-tools-layer-reset" onClick={resetLayerSearch}>
            Reset
          </button>
        </div> */}
      </aside>

      <aside
        id="aoiPanel"
        className="aoi-panel collapsed"
        aria-hidden="true"
        role="complementary"
        aria-labelledby="aoiModalTitle"
      >
        <GisPanelHeader
          titleId="aoiModalTitle"
          title={t("aoiLandTitle")}
          closeId="btnNavClose"
          closeTitle={t("closePanel")}
        />

        <div className="ap-scroll">
          <div className="modal-tabs aoi-acc-stack" role="tablist">
            <AoiAccTab id="tabAoi" panelId="mpAoi" label={t("tabAoi")} />

            <div id="mpAoi" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t("aoiSectionAdmin")}</h3>
                <p className="aoi-card-desc">{t("aoiHelpAdmin")}</p>

                <label>{t("state")}</label>
                <select id="stateSelect" disabled>
                  <option>HARYANA</option>
                </select>

                <label>{t("district")}</label>
                <select id="districtSelect">
                  <option value="">{t("placeholderDistrict")}</option>
                </select>

                <label>{t("tehsil")}</label>
                <select id="tehsilSelect" disabled>
                  <option value="">{t("placeholderTehsil")}</option>
                </select>

                <label>{t("village")}</label>
                <select id="villageSelect" disabled>
                  <option value="">{t("placeholderVillage")}</option>
                </select>

                <label>{t("aoiVillageBufferDistance")}</label>
                <div className="aoi-buffer-distance-row">
                  <input id="aoiVillageBufferValue" type="number" min="0.1" step="0.1" defaultValue="0" disabled />
                  <select id="aoiVillageBufferUnit" defaultValue="km" disabled>
                    <option value="km">Kilometer</option>
                    <option value="m">Meter</option>
                  </select>
                </div>

                <div className="actions">
                  <button type="button" className="btn-go aoi-btn-analyze" id="btnNavApply">
                    <span className="aoi-btn-icon" aria-hidden>
                      {ANALYZE_ICON}
                    </span>
                    Analyze
                  </button>
                  <button type="button" className="btn-clear" id="btnNavClear">
                    {t("clear")}
                  </button>
                  <button type="button" className="btn-route" id="btnRouteFromCurrentToAoi">
                    <span className="aoi-btn-icon" aria-hidden>
                      {ROUTE_ICON}
                    </span>
                    Plan Route
                  </button>
                </div>

                <div id="aoiRoutePanel" className="aoi-route-panel" aria-live="polite">
                  <div className="aoi-route-head">
                    <strong>Route details</strong>
                    <button type="button" className="aoi-route-close" id="btnAoiRouteClose">
                      Hide
                    </button>
                  </div>
                  <div id="aoiRouteSummary" className="aoi-route-summary">
                    Select AOI and click Route to view directions.
                  </div>
                  <ol id="aoiRouteSteps" className="aoi-route-steps"></ol>
                </div>
              </section>
            </div>

            <AoiAccTab
              id="tabParliamentary"
              panelId="mpParliamentary"
              label={t("tabParliamentaryBoundary")}
            />
            <div id="mpParliamentary" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t("tabParliamentaryBoundary")}</h3>
                {/* <p className="aoi-card-desc">{t("parliamentaryBoundaryHelp")}</p> */}
                <label>{t("lokSabha")}</label>
                <select id="parliamentaryLokSabhaSelect" disabled>
                  <option value="">{t("placeholderLokSabha")}</option>
                </select>
                <label>{t("constituencyBoundaries")}</label>
                <div className="const-boundary-grid" role="group" aria-label={t("constituencyBoundaries")}>
                  <label className="const-boundary-item">
                    <input type="checkbox" id="chkLokSabhaBoundary" />
                    <span>{t("lokSabhaBoundary")}</span>
                  </label>
                  {/* <label className="const-boundary-item">
                    <input type="checkbox" id="chkParliamentaryBoundary" />
                    <span>{t("parliamentaryBoundary")}</span>
                  </label>
                  <label className="const-boundary-item">
                    <input type="checkbox" id="chkRajyaSabhaBoundary" />
                    <span>{t("rajyaSabhaBoundary")}</span>
                  </label> */}
                </div>
                <div className="actions">
                  <button type="button" className="btn-clear" id="btnParliamentaryClear">
                    {t("clear")}
                  </button>
                </div>
              </section>
            </div>

            <AoiAccTab
              id="tabAssemblyBoundary"
              panelId="mpAssemblyBoundary"
              label="Assembly Boundary"
            />
            <div id="mpAssemblyBoundary" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">Assembly Boundary</h3>
                <p className="aoi-card-desc"> Vidhan Sabha constituency.</p>
                {/* <label>{t("district")}</label>
                <select id="parliamentaryDistrictSelect">
                  <option value="">{t("placeholderDistrict")}</option>
                </select> */}
                <label>{t("vidhanSabha")}</label>
                <select id="parliamentaryAssemblySelect" disabled>
                  <option value="">{t("placeholderVidhanSabha")}</option>
                </select>
                <div className="actions">
                  <button type="button" className="btn-clear" id="btnAssemblyBoundaryClear">
                    {t("clear")}
                  </button>
                </div>
              </section>
            </div>

            <AoiAccTab id="tabCad" panelId="mpCad" label={t("tabCad")} />
            <div id="mpCad" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t("aoiSectionCad")}</h3>
                <p className="aoi-card-desc">{t("cadIntro")}</p>

                <label>{t("cadDistrict")}</label>
                <select id="cadDistrictSelect">
                  <option value="">{t("placeholderDistrict")}</option>
                </select>

                <label>{t("cadTehsil")}</label>
                <select id="cadTehsilSelect" disabled>
                  <option value="">{t("placeholderTehsil")}</option>
                </select>

                <label>{t("cadVillage")}</label>
                <select id="cadVillageSelect" disabled>
                  <option value="">{t("placeholderVillage")}</option>
                </select>

                <label>{t("cadMuraba")}</label>
                <select id="cadMurabaSelect" disabled>
                  <option value="">{t("placeholderMuraba")}</option>
                </select>

                <label>{t("cadKhasra")}</label>
                <select id="cadKhasraSelect" disabled>
                  <option value="">{t("placeholderParcel")}</option>
                </select>

                <label>{t("cadRadius")}</label>
                <div className="aoi-buffer-distance-row">
                  <input id="cadNearM" type="number" min="0.1" step="0.1" defaultValue="0" />
                  <select id="cadNearUnit" defaultValue="km">
                    <option value="km">Kilometer</option>
                    <option value="m">Meter</option>
                  </select>
                </div>

                <div className="cad-near-hidden" aria-hidden="true">
                  <div id="cadNearChecks" className="chk-grid cad-near-grid"></div>
                  <input type="checkbox" id="cadNearAll" defaultChecked />
                </div>

                <div className="actions actions-spaced">
                  {/* <button type="button" className="btn-go" id="btnCadShow">
                    {t("cadShow")}
                  </button> */}
                  <button type="button" className="btn-go btn-go-accent" id="btnCadNearby">
                    {t("Features near me")}
                  </button>
                </div>

                <div className="actions">
                  {/* <button type="button" className="btn-clear" id="btnCadRoute" title={t("cadRoute")}>
                    {t("cadRoute")}
                  </button> */}
                  <button type="button" className="btn-clear" id="btnCadClear">
                    {t("cadClear")}
                  </button>
                </div>

                {/* <div id="cadResults" className="cad-results"></div> */}
              </section>
            </div>

            <AoiAccTab id="tabHsvp" panelId="mpHsvp" label={t("tabHsvp")} />
            <div id="mpHsvp" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t("hsvpTitle")}</h3>
                <p className="aoi-card-desc">{t("hsvpIntro")}</p>

                <label>{t("district")}</label>
                <select id="hsvpDistrictSelect">
                  <option value="">{t("placeholderDistrict")}</option>
                </select>

                <label>{t("hsvpSector")}</label>
                <select id="hsvpSectorSelect" disabled>
                  <option value="">{t("placeholderHsvpSector")}</option>
                </select>

                <label>{t("hsvpPlot")}</label>
                <select id="hsvpPlotSelect" disabled>
                  <option value="">{t("placeholderHsvpPlot")}</option>
                </select>

                <div className="actions">
                  <button type="button" className="btn-go btn-go-accent" id="btnHsvpApply">
                    {t("ZOOM")}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </aside>

      <aside
        id="selectToolsPanel"
        className="select-tools-panel collapsed"
        aria-hidden="true"
        role="complementary"
        aria-labelledby="selectToolsTitle"
      >
        <GisPanelHeader
          titleId="selectToolsTitle"
          title={t("selectToolsLabel")}
          closeId="btnSelectToolsClose"
          closeTitle={t("closePanel")}
        />
        <p className="msme-gis-panel-intro stools-intro">{t("selectToolsIntro")}</p>

        <div className="stools-body" role="toolbar" aria-label={t("selectToolsLabel")}>
          <div className="stools-grid">
            <button
              type="button"
              className="stools-btn"
              title={t("selectIdentify")}
              onClick={() => window.msmeGisActivateIdentifyMode && window.msmeGisActivateIdentifyMode()}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                </svg>
              </span>
              <span className="stools-txt">{t("selectIdentify")}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t("selectSketchPoint")}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch("point")}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="2.8" fill="currentColor" />
                  <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
                </svg>
              </span>
              <span className="stools-txt">{t("selectSketchPoint")}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t("selectSketchLine")}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch("polyline")}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" d="M5 17L19 7" />
                  <circle cx="5" cy="17" r="1.9" fill="currentColor" />
                  <circle cx="19" cy="7" r="1.9" fill="currentColor" />
                </svg>
              </span>
              <span className="stools-txt">{t("selectSketchLine")}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t("selectSketchPoly")}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch("polygon")}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M6 5h11l2 8-7 6-8-5z" />
                </svg>
              </span>
              <span className="stools-txt">{t("selectSketchPoly")}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t("selectSketchRect")}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch("rectangle")}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <rect x="5" y="7" width="14" height="10" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <span className="stools-txt">{t("selectSketchRect")}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t("selectSketchCircle")}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch("circle")}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="6.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <span className="stools-txt">{t("selectSketchCircle")}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t("selectSketchFree")}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch("free")}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 17l.8 2.2L8 20l8.9-8.9-3-3L5 17zM12.9 6.1l3 3"
                  />
                </svg>
              </span>
              <span className="stools-txt">{t("selectSketchFree")}</span>
            </button>
            <button
              type="button"
              className="stools-btn stools-btn--ghost"
              title={t("selectClear")}
              onClick={() => window.msmeGisClearMapSelection && window.msmeGisClearMapSelection()}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6-3 3H9l-3-3z" />
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h16" />
                </svg>
              </span>
              <span className="stools-txt">{t("selectClear")}</span>
            </button>
          </div>
        </div>
      </aside>

      <aside
        id="measurementPanel"
        className="measurement-panel collapsed"
        aria-hidden="true"
        role="complementary"
        aria-labelledby="measurementPanelTitle"
      >
        <GisPanelHeader
          titleId="measurementPanelTitle"
          title={t("measurementPanelTitle")}
          closeId="btnMeasurementClose"
          closeTitle={t("closePanel")}
          onClose={closeMeasurementPanel}
        />
        <p className="msme-gis-panel-intro sp-intro">{t("measurementPanelIntro")}</p>
        <div className="sp-scroll">
          <div id="measurementToolbar" aria-label={t("measurementPanelTitle")}>
            <section className="aoi-card">
              <h3 className="aoi-card-title">{t("measurementPointA")}</h3>
              <label>{t("measurementLatitude")}</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="29.15"
                value={measureLat1}
                onChange={(e) => setMeasureLat1(e.target.value)}
              />
              <label>{t("measurementLongitude")}</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="76.82"
                value={measureLon1}
                onChange={(e) => setMeasureLon1(e.target.value)}
              />
            </section>

            <section className="aoi-card">
              <h3 className="aoi-card-title">{t("measurementPointB")}</h3>
              <label>{t("measurementLatitude")}</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="28.46"
                value={measureLat2}
                onChange={(e) => setMeasureLat2(e.target.value)}
              />
              <label>{t("measurementLongitude")}</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="77.03"
                value={measureLon2}
                onChange={(e) => setMeasureLon2(e.target.value)}
              />
            </section>

            <div className="row measure-distance-row" aria-live="polite">
              <span className="lbl">{t("measurementDistance")}</span>
              <span className="val">
                {measureDistanceM == null ? t("measurementEnterBothPoints") : formatMeasureMeters(measureDistanceM)}
              </span>
            </div>

            <p className="aoi-card-desc measure-divider">{t("measurementOr")}</p>

            <section className="aoi-card">
              <h3 className="aoi-card-title">{t("measurementDrawLine")}</h3>
              <p className="aoi-card-desc">{t("measurementDrawLineHint")}</p>
              <div className="actions">
                <button type="button" className="btn-secondary" onClick={startMeasureLineDraw}>
                  {t("measurementDrawLineBtn")}
                </button>
                <button type="button" className="btn-ghost" onClick={clearMeasureLineDraw}>
                  {t("measurementClearLine")}
                </button>
              </div>
              {measureLineDrawing ? (
                <p className="aoi-card-desc">{t("measurementDrawingLine")}</p>
              ) : null}
              <div className="row measure-distance-row" aria-live="polite">
                <span className="lbl">{t("measurementLineDistance")}</span>
                <span className="val">
                  {measureLineDistanceM == null
                    ? t("measurementLineEmpty")
                    : formatMeasureKm(measureLineDistanceM / 1000)}
                </span>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
