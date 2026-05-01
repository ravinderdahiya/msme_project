// import ResultsFlyout from './ResultsFlyout.jsx'
import LandLocationReport from './LandLocationReport.jsx'
import CommunitySummaryPanel from './CommunitySummaryPanel.jsx'

export default function Sidebar({ t }) {
  // function openClosestPanelAndStart() {
  //   var spatialPanel = document.getElementById('spatialPanel')
  //   var openSpatialBtn = document.getElementById('btnOpenSpatial')
  //   if (spatialPanel && spatialPanel.classList.contains('collapsed') && openSpatialBtn) {
  //     openSpatialBtn.click()
  //   }
  //
  //   var closestTab = document.querySelector('#spatialToolbar .st-tabs .tab[data-panel="pC"]')
  //   if (closestTab && typeof closestTab.click === 'function') {
  //     closestTab.click()
  //   }
  //
  //   if (window.msmeGisStartClosestPointSelection) {
  //     window.msmeGisStartClosestPointSelection()
  //   }
  // }

  return (
    <>
      <aside
        id="spatialPanel"
        className="spatial-panel collapsed"
        aria-hidden="true"
        aria-labelledby="spatialPanelTitle"
      >
        <div className="sp-head">
          <div className="ap-head-row">
            <h2 id="spatialPanelTitle">{t('spatialTitle')}</h2>
            <button type="button" className="ap-close" id="btnSpatialClose" title={t('closePanel')}>
              ×
            </button>
          </div>
          <p className="sp-intro">{t('spatialIntro')}</p>
        </div>
        <div className="sp-scroll">
          <div id="spatialToolbar" aria-label={t('spatialToolbarAria')}>
            <div className="st-tabs" role="tablist">
              <button type="button" className="tab active" data-panel="pA" role="tab">
                {t('spatialTabBuffer')}
              </button>
              <button type="button" className="tab" data-panel="pB" role="tab">
                {t('spatialTabProximity')}
              </button>
              <button type="button" className="tab" data-panel="pC" role="tab">
                {t('spatialTabIntersect')}
              </button>
              <button type="button" className="tab" data-panel="pD" role="tab">
                {t('spatialTabMulti')}
              </button>
              <button type="button" className="tab" data-panel="pE" role="tab">
                {t('spatialTabSuit')}
              </button>
            </div>

            <div className="st-panels">
              <div id="pA" className="panel active" role="tabpanel">
                <div className="buffer-mark-row">
                  <button type="button" className="btn-secondary" id="btnBufferMarkPoint">
                    {t('bufferMark')}
                  </button>
                  <button type="button" className="btn-ghost" id="btnBufferClearMark">
                    {t('bufferClearMark')}
                  </button>
                </div>
                <div className="row">
                  <span className="lbl">{t('bufferQueryRadius')}</span>
                  <input type="range" id="bufMarkQueryRadius" min="1000" max="15000" step="500" defaultValue="5000" />
                  <span className="val" id="bufMarkQueryRadiusVal">5000</span>
                </div>
                <div className="row">
                  <span className="lbl">{t('bufferRoadSource')}</span>
                  <select id="bufRoadLayer" className="sm" title={t('bufRoadLayerTitle')} defaultValue="4">
                    <option value="4">{t('bufRoadOptLine')}</option>
                    <option value="0">{t('bufRoadOptAir')}</option>
                  </select>
                  <span className="lbl">{t('bufferDistance')}</span>
                  <input type="range" id="bufDist" min="100" max="5000" step="100" defaultValue="1500" />
                  <span className="val" id="bufDistVal">1500</span>
                  <button type="button" className="btn-run" id="runBuffer">
                    {t('runBuffer')}
                  </button>
                </div>
                <div className="buffer-mark-row">
                  <button type="button" className="btn-secondary" id="btnBufferPdf">
                    Download buffer PDF
                  </button>
                </div>
                <p className="panel-hint">{t('bufferHint')}</p>
              </div>

              <div id="pB" className="panel" role="tabpanel">
                <div className="row">
                  <label>
                    <input type="checkbox" id="proxCheckAll" /> {t('proximitySelectPoi')}
                  </label>
                  <span className="lbl">{t('proximityMaxDist')}</span>
                  <input type="range" id="proxDist" min="100" max="10000" step="100" defaultValue="2000" />
                  <span className="val" id="proxDistVal">2000</span>
                  <button type="button" className="btn-run" id="runProximity">
                    {t('proximityRun')}
                  </button>
                </div>
                <div id="proxCheckboxes" className="chk-grid"></div>
                <p className="panel-hint">{t('proximityHint')}</p>
              </div>

              <div id="pC" className="panel" role="tabpanel">
                <div className="row">
                  {/* <label>
                    <input type="checkbox" id="intCheckAll" /> {t('intersectSelectLayers')}
                  </label> */}
                  {/* <button type="button" className="btn-run" id="runIntersect">
                    {t('intersectRun')}
                  </button> */}
                </div>
                <div className="row">
                ?  <span className="lbl">{t('closestBufferDist')}</span>
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
                    {t('closestPickPoint')}
                  </button>
                </div>
                <div id="intCheckboxes" className="chk-grid"></div>
                <p className="panel-hint">{t('intersectHint')}</p>
              </div>

              <div id="pD" className="panel" role="tabpanel">
                <div className="row">
                  <label>
                    <input type="checkbox" id="multiCheckAll" /> {t('multiSelectUtility')}
                  </label>
                  <span className="lbl">{t('multiDistance')}</span>
                  <input type="range" id="multiDist" min="100" max="8000" step="100" defaultValue="2000" />
                  <span className="val" id="multiDistVal">2000</span>
                  <button type="button" className="btn-run" id="runMulti">
                    {t('multiRun')}
                  </button>
                </div>
                <div className="row">
                  <label className="lbl">{t('multiIncludeRoadsLabel')}</label>
                  <input type="checkbox" id="multiIncRoads" defaultChecked />
                </div>
                <div id="multiCheckboxes" className="chk-grid"></div>
                <p className="panel-hint">{t('multiHint')}</p>
              </div>

              <div id="pE" className="panel" role="tabpanel">
                <div className="row">
                  <span className="lbl">{t('suitNearRoad')}</span>
                  <input type="range" id="suitDist" min="500" max="10000" step="100" defaultValue="2000" />
                  <span className="val" id="suitDistVal">2000</span>
                  <button type="button" className="btn-run" id="runSuitability">
                    {t('suitRun')}
                  </button>
                </div>
                <p className="panel-hint">{t('suitHint')}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <aside id="rail">
        <div className="rail-tip">MENU</div>

        <button type="button" className="rail-btn" id="btnOpenSpatial" title={t('railTitleSpatial')}>
          <span className="rail-ico-wrap" aria-hidden>
            <svg viewBox="0 0 24 24" className="rail-ico" focusable="false">
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h16" />
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6 15l3-3 3 2 5-6 2 2" />
              <circle cx="6" cy="15" r="1.2" fill="currentColor" />
              <circle cx="12" cy="14" r="1.2" fill="currentColor" />
              <circle cx="17" cy="8" r="1.2" fill="currentColor" />
            </svg>
          </span>
        </button>

        <button type="button" className="rail-btn" id="btnOpenNav" title={t('railTitleAoi')}>
          <span className="rail-ico-wrap" aria-hidden>
            <svg viewBox="0 0 24 24" className="rail-ico" focusable="false">
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 8v8M8 12h8" />
            </svg>
          </span>
        </button>

        <button type="button" className="rail-btn active" id="btnTogglePanel" title={t('railTitleLayers')}>
          <span className="rail-ico-wrap" aria-hidden>
            <svg viewBox="0 0 24 24" className="rail-ico" focusable="false">
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 4l8 4-8 4-8-4 8-4z" />
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 12l-8 4-8-4" />
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 16l-8 4-8-4" />
            </svg>
          </span>
        </button>
        <span className="rail-tip">{t('railLayers')}</span>
        {/* <button
          type="button"
          className="rail-btn"
          id="btnClosestPointRail"
          title={t('railTitleClosestPoint')}
          onClick={openClosestPanelAndStart}
        >
          <span className="rail-ico-wrap" aria-hidden>
            <svg viewBox="0 0 24 24" className="rail-ico" focusable="false">
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
              <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2" />
            </svg>
          </span>
        </button>
        <span className="rail-tip">{t('railClosestPoint')}</span> */}
        <button
          type="button"
          className="rail-btn"
          id="btnSelectTool"
          title={t('railTitleSelect')}
          aria-pressed="false"
        >
          <span className="rail-ico-wrap" aria-hidden>
            <svg viewBox="0 0 24 24" className="rail-ico" focusable="false">
              <path fill="currentColor" d="M4 2l2 18 3.5-7 7-3.5L4 2z" />
              <circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>

        <button type="button" className="rail-btn" id="btnMapMultiSelect" title={t('railTitleMultiSelect')} aria-pressed="false">
          <span className="rail-ico-wrap" aria-hidden>
            <svg viewBox="0 0 24 24" className="rail-ico" focusable="false">
              <rect x="4" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <rect x="4" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M16 8h4M18 6v4" />
              <rect x="13" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
        </button>

        <button type="button" className="rail-btn" id="btnMapSelToAnalysis" title={t('railTitleMapSelAnalysis')}>
          <span className="rail-ico-wrap" aria-hidden>
            <svg viewBox="0 0 24 24" className="rail-ico" focusable="false">
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.2 2.5 2.7.4-1.9 1.9.5 2.7-2.5-1.3-2.5 1.3.5-2.7L8.1 5.9l2.7-.4L12 3z" />
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h10M4 15h14M4 11h8" />
            </svg>
          </span>
        </button>
      </aside>

      <aside id="toolsPanel" role="complementary" aria-labelledby="gisToolsPanelTitle">
        <div className="tp-head">
          <div className="ap-head-row">
            <h2 id="gisToolsPanelTitle">{t('layersTitle')}</h2>
            <button type="button" className="ap-close" id="btnToolsPanelClose" title={t('closePanel')}>
              ×
            </button>
          </div>
          <p>{t('layersIntro')}</p>
        </div>
        <div className="tp-scroll">
          <div id="layerListContainer" />
          <div id="status" />
        </div>
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
            <h2 id="aoiModalTitle">{t('aoiLandTitle')}</h2>
            <button type="button" className="ap-close" id="btnNavClose" title={t('closePanel')}>
              ×
            </button>
          </div>
        </div>

        <div className="ap-scroll">
          <div className="modal-tabs" role="tablist">
            <button type="button" id="tabAoi" data-mpanel="mpAoi">
              {t('tabAoi')}
            </button>

            <div id="mpAoi" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t('aoiSectionAdmin')}</h3>
                <p className="aoi-card-desc">{t('aoiHelpAdmin')}</p>

                <label>{t('state')}</label>
                <select id="stateSelect" disabled>
                  <option>HARYANA</option>
                </select>

                <label>{t('district')}</label>
                <select id="districtSelect">
                  <option value="">{t('placeholderDistrict')}</option>
                </select>

                <label>{t('tehsil')}</label>
                <select id="tehsilSelect" disabled>
                  <option value="">{t('placeholderTehsil')}</option>
                </select>

                <label>{t('village')}</label>
                <select id="villageSelect" disabled>
                  <option value="">{t('placeholderVillage')}</option>
                </select>

                <label>{t('aoiVillageBufferDistance')}</label>
                <div className="aoi-buffer-distance-row">
                  <input
                    id="aoiVillageBufferValue"
                    type="number"
                    min="0.1"
                    step="0.1"
                    defaultValue="2"
                    disabled
                  />
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
                    {t('clear')}
                  </button>
                  <button type="button" className="btn-clear btn-route" id="btnRouteFromCurrentToAoi">
                   Plan  Route
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
              {t('tabParliamentaryBoundary')}
            </button>
            <div id="mpParliamentary" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t('tabParliamentaryBoundary')}</h3>
                <p className="aoi-card-desc">{t('parliamentaryBoundaryHelp')}</p>
                <label>{t('lokSabha')}</label>
                <select id="parliamentaryLokSabhaSelect" disabled>
                  <option value="">{t('placeholderLokSabha')}</option>
                </select>
                <label>{t('constituencyBoundaries')}</label>
                <div className="const-boundary-grid" role="group" aria-label={t('constituencyBoundaries')}>
                  <label className="const-boundary-item">
                    <input type="checkbox" id="chkLokSabhaBoundary" />
                    <span>{t('lokSabhaBoundary')}</span>
                  </label>
                  <label className="const-boundary-item">
                    <input type="checkbox" id="chkParliamentaryBoundary" />
                    <span>{t('parliamentaryBoundary')}</span>
                  </label>
                  <label className="const-boundary-item">
                    <input type="checkbox" id="chkRajyaSabhaBoundary" />
                    <span>{t('rajyaSabhaBoundary')}</span>
                  </label>
                </div>
                <div className="actions">
                  <button type="button" className="btn-clear" id="btnParliamentaryClear">
                    {t('clear')}
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
                <p className="aoi-card-desc">Select district and Vidhan Sabha constituency.</p>
                <label>{t('district')}</label>
                <select id="parliamentaryDistrictSelect">
                  <option value="">{t('placeholderDistrict')}</option>
                </select>
                <label>{t('vidhanSabha')}</label>
                <select id="parliamentaryAssemblySelect" disabled>
                  <option value="">{t('placeholderVidhanSabha')}</option>
                </select>
                <div className="actions">
                  <button type="button" className="btn-clear" id="btnAssemblyBoundaryClear">
                    {t('clear')}
                  </button>
                </div>
              </section>
            </div>
            <button type="button" id="tabCad" data-mpanel="mpCad">
              {t('tabCad')}
            </button>
            <div id="mpCad" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t('aoiSectionCad')}</h3>
                <p className="aoi-card-desc">{t('cadIntro')}</p>

                <label>{t('cadDistrict')}</label>
                <select id="cadDistrictSelect">
                  <option value="">{t('placeholderDistrict')}</option>
                </select>

                <label>{t('cadTehsil')}</label>
                <select id="cadTehsilSelect" disabled>
                  <option value="">{t('placeholderTehsil')}</option>
                </select>

                <label>{t('cadVillage')}</label>
                <select id="cadVillageSelect" disabled>
                  <option value="">{t('placeholderVillage')}</option>
                </select>

                <label>{t('cadMuraba')}</label>
                <select id="cadMurabaSelect" disabled>
                  <option value="">{t('placeholderMuraba')}</option>
                </select>

                <label>{t('cadKhasra')}</label>
                <select id="cadKhasraSelect" disabled>
                  <option value="">{t('placeholderParcel')}</option>
                </select>

                <label>{t('cadRadius')}</label>
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
                  <button type="button" className="btn-clear" id="btnCadClear">
                    {t('cadClear')}
                  </button>
                  <button type="button" className="btn-go btn-go-accent" id="btnCadNearby">
                    {t('Features near me')}
                  </button>
                </div>

              </section>
            </div>
            <button type="button" id="tabHsvp" data-mpanel="mpHsvp">
              {t('tabHsvp')}
            </button>
            <div id="mpHsvp" className="modal-panel inline-tab-panel">
              <section className="aoi-card">
                <h3 className="aoi-card-title">{t('hsvpTitle')}</h3>
                <p className="aoi-card-desc">{t('hsvpIntro')}</p>

                <label>{t('district')}</label>
                <select id="hsvpDistrictSelect">
                  <option value="">{t('placeholderDistrict')}</option>
                </select>

                <label>{t('hsvpSector')}</label>
                <select id="hsvpSectorSelect" disabled>
                  <option value="">{t('placeholderHsvpSector')}</option>
                </select>

                <label>{t('hsvpPlot')}</label>
                <select id="hsvpPlotSelect" disabled>
                  <option value="">{t('placeholderHsvpPlot')}</option>
                </select>

                <div className="actions">
                  <button type="button" className="btn-go btn-go-accent" id="btnHsvpApply">
                    {t('ZOOM')}
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
            <h2 id="selectToolsTitle">{t('selectToolsLabel')}</h2>
            <button type="button" className="ap-close" id="btnSelectToolsClose" title={t('closePanel')}>
              ×
            </button>
          </div>
          <p className="stools-intro">{t('selectToolsIntro')}</p>
        </div>

        <div className="stools-body" role="toolbar" aria-label={t('selectToolsLabel')}>
          <div className="stools-grid">
            <button
              type="button"
              className="stools-btn"
              title={t('selectIdentify')}
              onClick={() => window.msmeGisActivateIdentifyMode && window.msmeGisActivateIdentifyMode()}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectIdentify')}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t('selectSketchPoint')}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch('point')}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="2.8" fill="currentColor" />
                  <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectSketchPoint')}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t('selectSketchLine')}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch('polyline')}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" d="M5 17L19 7" />
                  <circle cx="5" cy="17" r="1.9" fill="currentColor" />
                  <circle cx="19" cy="7" r="1.9" fill="currentColor" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectSketchLine')}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t('selectSketchPoly')}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch('polygon')}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M6 5h11l2 8-7 6-8-5z" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectSketchPoly')}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t('selectSketchRect')}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch('rectangle')}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <rect x="5" y="7" width="14" height="10" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectSketchRect')}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t('selectSketchCircle')}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch('circle')}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="6.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectSketchCircle')}</span>
            </button>
            <button
              type="button"
              className="stools-btn"
              title={t('selectSketchFree')}
              onClick={() => window.msmeGisStartSketch && window.msmeGisStartSketch('free')}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 17l.8 2.2L8 20l8.9-8.9-3-3L5 17zM12.9 6.1l3 3" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectSketchFree')}</span>
            </button>
            <button
              type="button"
              className="stools-btn stools-btn--ghost"
              title={t('selectClear')}
              onClick={() => window.msmeGisClearMapSelection && window.msmeGisClearMapSelection()}
            >
              <span className="stools-ico" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6-3 3H9l-3-3z" />
                  <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h16" />
                </svg>
              </span>
              <span className="stools-txt">{t('selectClear')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* <ResultsFlyout /> */}
      <CommunitySummaryPanel />
      <LandLocationReport />
    </>
  )
}
