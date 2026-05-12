import { useCallback, useState } from 'react'
import LocationButton from './LocationButton.jsx'
import BufferButton from './BufferButton.jsx'
import PrintScreenButton from './PrintScreenButton.jsx'
import BasemapButton from './BasemapButton.jsx'
import HomeButton from './HomeButton.jsx'

export default function HaryanaMap({ t }) {
  const [legendExpanded, setLegendExpanded] = useState(false)

  const toggleLegend = useCallback(function () {
    setLegendExpanded(function (prev) {
      const next = !prev
      const panel = typeof document !== "undefined" ? document.getElementById("legendPanel") : null
      if (panel) {
        panel.classList.toggle("visible", next)
      }
      return next
    })
  }, [])

  return (
    <>
      <button
        type="button"
        id="legendFab"
        className="buffer-map-fab legend-map-fab esri-component esri-widget--button"
        data-map-label={(t && typeof t === "function" ? t("legendPanelLabel") : null) || "Legend"}
        title={(t && typeof t === "function" ? t("legendToggle") : null) || "Toggle legend"}
        aria-label={(t && typeof t === "function" ? t("legendToggle") : null) || "Toggle legend"}
        aria-expanded={legendExpanded ? "true" : "false"}
        aria-controls="legendPanel"
        onClick={toggleLegend}
      >
        <svg viewBox="0 0 24 24" className="buffer-map-fab-ico" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M4 5h16v4H4V5zm0 6h10v4H4v-4zm0 6h16v4H4v-4z"
          />
        </svg>
      </button>

      <div id="legendPanel" aria-label={t('legendPanelLabel')}>
        <div id="legendInner"></div>
      </div>

      <div id="coordBar">{t('coordPlaceholder')}</div>

      {/* <LocationButton t={t} /> */}
      <BufferButton t={t} />
      <PrintScreenButton t={t} />
      <HomeButton t={t} />
      <BasemapButton t={t} />
      <div id="gisLoadingOverlay" className="is-hidden" aria-hidden="true">
        <div className="gis-loading-chip" role="status" aria-live="polite">
          <span className="gis-loading-spinner" aria-hidden="true"></span>
          <span id="gisLoadingText">{(t && t('loading')) || 'Loading data...'}</span>
        </div>
      </div>
      <div id="viewDiv"></div>
      <div id="basemapSlot" style={{ display: "none" }}></div>
    </>
  )
}
