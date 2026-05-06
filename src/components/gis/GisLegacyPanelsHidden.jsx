/**
 * GIS panel DOM — required by initMsmeWebGis (getElementById / LayerList mount).
 * Mounted inside `#rail` beside the nm-sidebar controls; styled by MSMEGisPageShell.css.
 */
import { useEffect, useState } from "react";

export default function GisLegacyPanelsHidden({ t }) {
  const [layerSearch, setLayerSearch] = useState("");

  useEffect(() => {
    const container = document.getElementById("layerListContainer");
    if (!container) return;

    const applyThemeVars = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "black";

      // Set vars on container (cascades into Calcite web-components).
      container.style.setProperty("--calcite-color-text-1", isDark ? "rgba(241,245,253,0.96)" : "#0f233f");
      container.style.setProperty("--calcite-color-text-2", isDark ? "rgba(148,163,184,0.92)" : "#5f718f");
      container.style.setProperty("--calcite-color-text-3", isDark ? "rgba(148,163,184,0.9)" : "#5f718f");
      container.style.setProperty("--calcite-color-icon", isDark ? "rgba(184,197,217,0.92)" : "#5f718f");
      container.style.setProperty("--calcite-color-brand", isDark ? "#6ea0ff" : "#2159d8");
      container.style.setProperty("--calcite-color-brand-hover", isDark ? "#9ec5ff" : "#2159d8");
      container.style.setProperty("--calcite-color-background", "transparent");

      // Ensure list + items are not dimmed by internal defaults.
      const lists = container.querySelectorAll("calcite-list, calcite-list-item");
      lists.forEach((el) => {
        el.style.setProperty("--calcite-color-text-1", isDark ? "rgba(241,245,253,0.96)" : "#0f233f");
        el.style.setProperty("--calcite-color-text-2", isDark ? "rgba(148,163,184,0.92)" : "#5f718f");
        el.style.setProperty("--calcite-color-icon", isDark ? "rgba(184,197,217,0.92)" : "#5f718f");
        el.style.setProperty("--calcite-color-brand", isDark ? "#6ea0ff" : "#2159d8");
        el.style.setProperty("--calcite-ui-foreground-hover", isDark ? "rgba(110,160,255,0.14)" : "rgba(33,89,216,0.06)");
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
        <div className="sp-head">
          <div className="ap-head-row">
            <h2 id="spatialPanelTitle">{t("spatialTitle")}</h2>
            <button type="button" className="ap-close" id="btnSpatialClose" title={t("closePanel")}>
              &times;
            </button>
          </div>
          <p className="sp-intro">{t("spatialIntro")}</p>
        </div>
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
                    defaultValue="1.5"
                    aria-label="Buffer distance value"
                  />
                  <select id="bufferPickDistUnit" className="sm" defaultValue="km" aria-label="Buffer distance unit">
                    <option value="km">Kilometer</option>
                    <option value="m">Meter</option>
                  </select>
                  <button type="button" className="btn-secondary" id="btnBufferPickPoint">
                    {t("closestPickPoint")}
                  </button>
                  <button type="button" className="btn-ghost" id="btnBufferClearMark">
                    {t("bufferClearMark")}
                  </button>
                </div>
                <div className="row">
                  <span className="lbl">{t("bufferQueryRadius")}</span>
                  <input type="range" id="bufMarkQueryRadius" min="1000" max="15000" step="500" defaultValue="5000" />
                  <span className="val" id="bufMarkQueryRadiusVal">
                    5000
                  </span>
                </div>
                <div className="row">
                  <span className="lbl">{t("bufferRoadSource")}</span>
                  <select id="bufRoadLayer" className="sm" title={t("bufRoadLayerTitle")} defaultValue="4">
                    <option value="4">{t("bufRoadOptLine")}</option>
                    <option value="0">{t("bufRoadOptAir")}</option>
                  </select>
                  <span className="lbl">{t("bufferDistance")}</span>
                  <input type="range" id="bufDist" min="100" max="5000" step="100" defaultValue="1500" />
                  <span className="val" id="bufDistVal">
                    1500
                  </span>
                  <button type="button" className="btn-run" id="runBuffer">
                    {t("runBuffer")}
                  </button>
                </div>
                <div className="buffer-mark-row">
                  <button type="button" className="btn-secondary" id="btnBufferPdf">
                    Download buffer PDF
                  </button>
                </div>
                <p className="panel-hint">{t("bufferHint")}</p>
              </div>

              <div id="pB" className="panel" role="tabpanel">
                <div className="row">
                  <input
                    type="number"
                    id="proximityPickDistNum"
                    className="closest-dist-num"
                    min="0.1"
                    step="0.5"
                    defaultValue="2"
                    aria-label="Proximity distance value"
                  />
                  <select id="proximityPickDistUnit" className="sm" defaultValue="km" aria-label="Proximity distance unit">
                    <option value="km">Kilometer</option>
                    <option value="m">Meter</option>
                  </select>
                  <button type="button" className="btn-secondary" id="btnProximityPickPoint">
                    {t("closestPickPoint")}
                  </button>
                </div>
                <div className="row">
                  <label>
                    <input type="checkbox" id="proxCheckAll" /> {t("proximitySelectPoi")}
                  </label>
                  <span className="lbl">{t("proximityMaxDist")}</span>
                  <input type="range" id="proxDist" min="100" max="10000" step="100" defaultValue="2000" />
                  <span className="val" id="proxDistVal">
                    2000
                  </span>
                  <button type="button" className="btn-run" id="runProximity">
                    {t("proximityRun")}
                  </button>
                </div>
                <div id="proxCheckboxes" className="chk-grid"></div>
                <p className="panel-hint">{t("proximityHint")}</p>
              </div>

              <div id="pC" className="panel" role="tabpanel">
                <div className="row"></div>
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
                    <option value="km">Kilometer</option>
                    <option value="m">Meter</option>
                  </select>
                  <button type="button" className="btn-secondary" id="btnClosestPickPoint">
                    {t("closestPickPoint")}
                  </button>
                </div>
                <div id="intCheckboxes" className="chk-grid"></div>
                <p className="panel-hint">{t("intersectHint")}</p>
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
        <div className="tp-head">
          <div className="ap-head-row">
            <h2 id="gisToolsPanelTitle">{t("layersTitle")}</h2>
            <button type="button" className="ap-close" id="btnToolsPanelClose" title={t("closePanel")}>
              &times;
            </button>
          </div>
          {/* <p>{t("layersIntro")}</p> */}
        </div>
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
          <div id="status" />
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
        <div className="ap-head">
          <div className="ap-head-row">
            <h2 id="aoiModalTitle">{t("aoiLandTitle")}</h2>
            <button type="button" className="ap-close" id="btnNavClose" title={t("closePanel")}>
              &times;
            </button>
          </div>
        </div>

        <div className="ap-scroll">
          <div className="modal-tabs" role="tablist">
            <button type="button" id="tabAoi" data-mpanel="mpAoi">
              {t("tabAoi")}
            </button>

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
                  <input id="aoiVillageBufferValue" type="number" min="0.1" step="0.1" defaultValue="2" disabled />
                  <select id="aoiVillageBufferUnit" defaultValue="km" disabled>
                    <option value="km">Kilometer</option>
                    <option value="m">Meter</option>
                  </select>
                </div>

                <div className="actions">
                  <button type="button" className="btn-go" id="btnNavApply">
                    Analyze
                  </button>
                  <button type="button" className="btn-clear" id="btnNavClear">
                    {t("clear")}
                  </button>
                  <button type="button" className="btn-clear btn-route" id="btnRouteFromCurrentToAoi">
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

            <button type="button" id="tabParliamentary" data-mpanel="mpParliamentary">
              {t("tabParliamentaryBoundary")}
            </button>
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

            <button type="button" id="tabAssemblyBoundary" data-mpanel="mpAssemblyBoundary">
              Assembly Boundary
            </button>
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

            <button type="button" id="tabCad" data-mpanel="mpCad">
              {t("tabCad")}
            </button>
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
                  <input id="cadNearM" type="number" min="0.1" step="0.1" defaultValue="5" />
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
                  <button type="button" className="btn-go" id="btnCadShow">
                    {t("cadShow")}
                  </button>
                  <button type="button" className="btn-go btn-go-accent" id="btnCadNearby">
                    {t("Features near me")}
                  </button>
                </div>

                <div className="actions">
                  <button type="button" className="btn-clear" id="btnCadRoute" title={t("cadRoute")}>
                    {t("cadRoute")}
                  </button>
                  <button type="button" className="btn-clear" id="btnCadClear">
                    {t("cadClear")}
                  </button>
                </div>

                <div id="cadResults" className="cad-results"></div>
              </section>
            </div>

            <button type="button" id="tabHsvp" data-mpanel="mpHsvp">
              {t("tabHsvp")}
            </button>
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
        <div className="stools-head">
          <div className="ap-head-row">
            <h2 id="selectToolsTitle">{t("selectToolsLabel")}</h2>
            <button type="button" className="ap-close" id="btnSelectToolsClose" title={t("closePanel")}>
              &times;
            </button>
          </div>
          <p className="stools-intro">{t("selectToolsIntro")}</p>
        </div>

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
    </div>
  );
}
