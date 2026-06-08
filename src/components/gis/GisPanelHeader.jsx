/**
 * Shared header for MSME GIS rail panels (title + close).
 * Body content stays panel-specific below this block.
 */
export default function GisPanelHeader({ titleId, title, closeId, closeTitle, onClose }) {
  return (
    <header className="msme-gis-panel-head">
      <div className="msme-gis-panel-head__row">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="msme-gis-panel-head__close ap-close"
          id={closeId}
          title={closeTitle}
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </header>
  );
}
