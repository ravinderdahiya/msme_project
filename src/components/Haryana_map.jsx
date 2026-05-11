import LocationButton from './LocationButton.jsx'
import BufferButton from './BufferButton.jsx'
import PrintScreenButton from './PrintScreenButton.jsx'
import BasemapButton from './BasemapButton.jsx'
import HomeButton from './HomeButton.jsx'

export default function HaryanaMap({ t }) {
  // Custom FABs proxy ArcGIS widgets where needed.

  return (
    <>
      <button
        type="button"
        id="legendFab"
        title={t('legendToggle')}
        aria-expanded="false"
        aria-controls="legendPanel"
      >
        ◧
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
