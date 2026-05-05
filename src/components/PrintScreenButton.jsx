export default function PrintScreenButton({ t }) {
  return (
    <button
      type="button"
      id="closestPrintFab"
      className="closest-print-fab"
      title={t?.("printScreenPdf") || "Print screen PDF"}
      onClick={() =>
        window.msmeGisDownloadClosestPdf &&
        window.msmeGisDownloadClosestPdf()
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M6 9V3h12v6h1a3 3 0 0 1 3 3v5h-4v4H6v-4H2v-5a3 3 0 0 1 3-3h1zm2-4v4h8V5H8zm8 14v-4H8v4h8zM5 11a1 1 0 1 0 0 2h2v-2H5z"
        />
      </svg>
    </button>
  );
}
