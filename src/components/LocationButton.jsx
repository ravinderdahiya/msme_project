export default function LocationButton({ t }) {
  return (
    <button
      type="button"
      id="currentLocationFab"
      title={t?.('currentLocation') || 'Current Location'}
      onClick={() =>
        window.msmeGisShowCurrentLocation &&
        window.msmeGisShowCurrentLocation()
      }
      style={{
        position: 'absolute',
        top: '300px',
        right: '52px',
        zIndex: 46,
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        border: '1px solid #d7e0ea',
        background: 'rgba(255,255,255,0.92)',
        cursor: 'pointer',
        boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#0f5c99"
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
        />
      </svg>
    </button>
  )
}