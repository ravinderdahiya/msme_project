export function formatIsoForPdf(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch (e0) {
    return String(iso);
  }
}

export function addPdfLine(doc, text, x, y, maxWidth) {
  var parts = doc.splitTextToSize(String(text == null ? "" : text), maxWidth);
  doc.text(parts, x, y);
  return y + parts.length * 14;
}
