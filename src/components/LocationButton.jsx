export default function LocationButton({ t }) {
  return (
    <button
      type="button"
      id="currentLocationFab"
      className="current-location-fab"
      title={t?.('currentLocation') || 'Current Location'}
      onClick={() =>
        window.msmeGisShowCurrentLocation &&
        window.msmeGisShowCurrentLocation()
      }
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
