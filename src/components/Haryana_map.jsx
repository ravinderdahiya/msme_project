// export default function HaryanaMap({ t }) {
//   return (
//     <>
//       <button
//         type="button"
//         id="legendFab"
//         title={t('legendToggle')}
//         aria-expanded="false"
//         aria-controls="legendPanel"
//       >
//         ◧
//       </button>

//       <div id="legendPanel" aria-label={t('legendPanelLabel')}>
//         <div id="legendInner"></div>
//       </div>

//       <div id="coordBar">{t('coordPlaceholder')}</div>

//       {/* Current location button */}
//       <button
//         type="button"
//         id="currentLocationFab"
//         title={t('currentLocation') || 'Current Location'}
//         onClick={() =>
//           window.msmeGisShowCurrentLocation &&
//           window.msmeGisShowCurrentLocation()
//         }
//         style={{
//           position: 'absolute',
//           bottom: '155px',
//           left: '66px',
//           zIndex: 46,
//           width: '46px',
//           height: '46px',
//           borderRadius: '50%',
//           border: '1px solid #d7e0ea',
//           background: 'rgba(255,255,255,0.92)',
//           cursor: 'pointer',
//           boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
//           fontSize: '18px',
//         }}
//       >
//         ◎
//       </button>

//       <div id="viewDiv"></div>
//       <div id="basemapSlot" style={{ display: 'none' }}></div>
//     </>
//   )
// }
import LocationButton from './LocationButton.jsx'

export default function HaryanaMap({ t }) {
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

      <LocationButton t={t} />

      <div id="viewDiv"></div>
      <div id="basemapSlot" style={{ display: 'none' }}></div>
    </>
  )
}