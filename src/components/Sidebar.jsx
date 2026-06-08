// import ResultsFlyout from './ResultsFlyout.jsx'

import { useEffect } from "react";

import LandLocationReport from './LandLocationReport.jsx'

import CommunitySummaryPanel from './CommunitySummaryPanel.jsx'

import GisLegacyPanelsHidden from './gis/GisLegacyPanelsHidden.jsx'

import {
  bindAoiPanelCloseOnPlanRoute,
  bindMeasurementPanelExclusivity,
  toggleMeasurementPanel,
} from '../gis/msme/measurementPanelShell.js'

export default function Sidebar({ t, onOpenAssemblyMap }) {
  useEffect(function () {
    bindAoiPanelCloseOnPlanRoute()
    bindMeasurementPanelExclusivity()
    const btn = document.getElementById('btnMeasurementTool')
    if (!btn) return
    function onClick() {
      toggleMeasurementPanel()
    }
    btn.addEventListener('click', onClick)
    return function () {
      btn.removeEventListener('click', onClick)
    }
  }, [])

  function openClosestPanelAndStart() {
    var spatialPanel = document.getElementById("spatialPanel");
    var openSpatialBtn = document.getElementById("btnOpenSpatial");
    if (spatialPanel && spatialPanel.classList.contains("collapsed") && openSpatialBtn) {
      openSpatialBtn.click();
    }

    var closestTab = document.querySelector('#spatialToolbar .st-tabs .tab[data-panel="pC"]');
    if (closestTab && typeof closestTab.click === "function") {
      closestTab.click();
    }

    if (window.msmeGisStartClosestPointSelection) {
      window.msmeGisStartClosestPointSelection();
    }
  }

  function openAssemblyMapInline() {
    if (typeof onOpenAssemblyMap === "function") {
      onOpenAssemblyMap();
    }
  }

  return (
    <>
      <aside id="rail" className="nm-sidebar nm-sidebar-dmp rail-nm" aria-label="Map tools">
        <nav className="nm-sidebar-rail" aria-label="Map tools">
          <ul className="nm-rail-list">
            <li>
              <button
                type="button"
                className="nm-rail-btn"
                id="btnOpenSpatial"
                title={t('railTitleSpatial')}
              >
                <span className="nm-rail-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={28} height={28} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h16" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6 15l3-3 3 2 5-6 2 2" />
                    <circle cx="6" cy="15" r="1.2" fill="currentColor" />
                    <circle cx="12" cy="14" r="1.2" fill="currentColor" />
                    <circle cx="17" cy="8" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                <span className="nm-rail-label">{t('railAnalysis')}</span>
              </button>
            </li>
            <li>
              <button type="button" className="nm-rail-btn" id="btnOpenNav" title={t('railTitleAoi')}>
                <span className="nm-rail-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={28} height={28} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 8v8M8 12h8" />
                  </svg>
                </span>
                <span className="nm-rail-label">{t('railAoi')}</span>
              </button>
            </li>
            <li>
              <button type="button" className="nm-rail-btn" id="btnTogglePanel" title={t('railTitleLayers')}>
                <span className="nm-rail-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={28} height={28} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 4l8 4-8 4-8-4 8-4z" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 12l-8 4-8-4" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 16l-8 4-8-4" />
                  </svg>
                </span>
                <span className="nm-rail-label">{t('railLayers')}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nm-rail-btn"
                id="btnMeasurementTool"
                title={t('railTitleMeasurementTool')}
                aria-controls="measurementPanel"
              >
                <span className="nm-rail-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={28} height={28} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M5 7h14M7 9v2M11 9v4M15 9v2M19 9v4" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M5 7l2-2M19 7l-2-2" />
                  </svg>
                </span>
                <span className="nm-rail-label">{t('railMeasurementTool')}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nm-rail-btn"
                id="btnMapSelToAnalysis"
                title={t('railTitleMapSelAnalysis')}
                onClick={openAssemblyMapInline}
              >
                <span className="nm-rail-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={28} height={28} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.2 2.5 2.7.4-1.9 1.9.5 2.7-2.5-1.3-2.5 1.3.5-2.7L8.1 5.9l2.7-.4L12 3z" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h10M4 15h14M4 11h8" />
                  </svg>
                </span>
                <span className="nm-rail-label">Assembly</span>
              </button>
            </li>
          </ul>
          <div className="nm-rail-brand" aria-hidden>
            <img src="/images/HARSAC-Logo.png" alt="" className="nm-rail-brand-img" />
          </div>
        </nav>

        <GisLegacyPanelsHidden t={t} />
      </aside>

      {/* <ResultsFlyout /> */}
      <CommunitySummaryPanel />
      <LandLocationReport />
    </>
  )
}
