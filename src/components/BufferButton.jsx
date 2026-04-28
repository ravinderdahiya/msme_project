export default function BufferButton({ t }) {
  var label = t && typeof t === "function" ? t("spatialTabBuffer") : "Buffer";
  function stopQuickBufferOnDoubleClick(ev) {
    if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
    if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
    if (window.msmeGisStopQuickBuffer) window.msmeGisStopQuickBuffer();
  }
  return (
    <button
      type="button"
      id="bufferMapFab"
      className="buffer-map-fab"
      title={`${label} (1500 m)`}
      aria-label="Quick buffer 1500 meters"
      aria-pressed="false"
      onClick={() =>
        window.msmeGisStartQuickBuffer &&
        window.msmeGisStartQuickBuffer()
      }
      onDoubleClick={stopQuickBufferOnDoubleClick}
    >
      <svg
        viewBox="0 0 24 24"
        className="buffer-map-fab-ico"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        <circle cx="12" cy="12" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" opacity="0.9" />
        <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      </svg>
    </button>
  );
}
