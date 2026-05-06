// import ResultsFlyout from './ResultsFlyout.jsx'
import { Menu } from "lucide-react";
import LandLocationReport from './LandLocationReport.jsx'
import CommunitySummaryPanel from './CommunitySummaryPanel.jsx'
import GisLegacyPanelsHidden from './gis/GisLegacyPanelsHidden.jsx'

export default function Sidebar({ t }) {
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

  return (
    <>
      <aside id="rail" className="nm-sidebar rail-nm" aria-label="Map tools">
        <div className="nm-sidebar-left">
          <div className="nm-sidebar-brand">
            <div>
              <span className="nm-sidebar-brand-title">MENU</span>
              <p className="nm-sidebar-brand-subtitle">Map tools for land selection</p>
            </div>
            <button type="button" className="nm-sidebar-toggle" aria-label="Open menu">
              <Menu size={18} />
            </button>
          </div>

          <div className="nm-sidebar-block">
            <div className="nm-sidebar-heading">MAP TOOLS</div>
            <div className="nm-sidebar-list">
              <button type="button" className="nm-sidebar-item" id="btnOpenSpatial" title={t('railTitleSpatial')}>
                <span className="nm-sidebar-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={18} height={18} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h16" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6 15l3-3 3 2 5-6 2 2" />
                    <circle cx="6" cy="15" r="1.2" fill="currentColor" />
                    <circle cx="12" cy="14" r="1.2" fill="currentColor" />
                    <circle cx="17" cy="8" r="1.2" fill="currentColor" />
                  </svg>
                </span>
                <span>
                  <strong>{t('railAnalysis')}</strong>
                  <small>{t('railTitleSpatial')}</small>
                </span>
              </button>

              <button type="button" className="nm-sidebar-item" id="btnOpenNav" title={t('railTitleAoi')}>
                <span className="nm-sidebar-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={18} height={18} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 8v8M8 12h8" />
                  </svg>
                </span>
                <span>
                  <strong>{t('railAoi')}</strong>
                  <small>{t('railTitleAoi')}</small>
                </span>
              </button>

              <button type="button" className="nm-sidebar-item" id="btnTogglePanel" title={t('railTitleLayers')}>
                <span className="nm-sidebar-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={18} height={18} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 4l8 4-8 4-8-4 8-4z" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 12l-8 4-8-4" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 16l-8 4-8-4" />
                  </svg>
                </span>
                <span>
                  <strong>{t('railLayers')}</strong>
                  <small>{t('railTitleLayers')}</small>
                </span>
              </button>
            </div>
          </div>

          <div className="nm-sidebar-block">
            <div className="nm-sidebar-list">
              <button
                type="button"
              className="nm-sidebar-item"
                id="btnClosestPointRail"
                title={t('railTitleClosestPoint')}
                onClick={openClosestPanelAndStart}
              >
                <span className="nm-sidebar-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={18} height={18} focusable="false">
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2" />
                  </svg>
                </span>
                <span>
                  <strong>{t('railClosestPoint')}</strong>
                  <small>{t('railTitleClosestPoint')}</small>
                </span>
              </button>
              <button
                type="button"
              className="nm-sidebar-item"
                id="btnSelectTool"
                title={t('railTitleSelect')}
                aria-pressed="false"
              >
                <span className="nm-sidebar-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={18} height={18} focusable="false">
                    <path fill="currentColor" d="M4 2l2 18 3.5-7 7-3.5L4 2z" />
                    <circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <span>
                  <strong>{t('railSelect')}</strong>
                  <small>{t('railTitleSelect')}</small>
                </span>
              </button>

              <button
                type="button"
              className="nm-sidebar-item"
                id="btnMapMultiSelect"
                title={t('railTitleMultiSelect')}
                aria-pressed="false"
              >
                <span className="nm-sidebar-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={18} height={18} focusable="false">
                    <rect x="4" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <rect x="4" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M16 8h4M18 6v4" />
                    <rect x="13" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <span>
                  <strong>{t('railMultiSelect')}</strong>
                  <small>{t('railTitleMultiSelect')}</small>
                </span>
              </button>

              <button
                type="button"
              className="nm-sidebar-item"
                id="btnMapSelToAnalysis"
                title={t('railTitleMapSelAnalysis')}
              >
                <span className="nm-sidebar-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width={18} height={18} focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.2 2.5 2.7.4-1.9 1.9.5 2.7-2.5-1.3-2.5 1.3.5-2.7L8.1 5.9l2.7-.4L12 3z" />
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 19h10M4 15h14M4 11h8" />
                  </svg>
                </span>
                <span>
                  <strong>{t('railMapSelAnalysis')}</strong>
                  <small>{t('railTitleMapSelAnalysis')}</small>
                </span>
              </button>
            </div>
          </div>
        </div>

        <GisLegacyPanelsHidden t={t} />
      </aside>

      {/* <ResultsFlyout /> */}
      <CommunitySummaryPanel />
      <LandLocationReport />
    </>
  )
}
