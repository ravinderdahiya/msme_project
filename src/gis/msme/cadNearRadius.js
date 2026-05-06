export function readCadNearRadiusMeters() {
  var vEl = document.getElementById("cadNearM");
  var uEl = document.getElementById("cadNearUnit");
  var n = vEl ? parseFloat(vEl.value) : NaN;
  if (!isFinite(n) || n <= 0) n = 2;
  var unit = uEl ? String(uEl.value || "km").toLowerCase() : "km";
  var meters = unit === "m" ? n : (n * 1000);
  if (!isFinite(meters) || meters <= 0) meters = 2000;
  return Math.round(meters);
}
