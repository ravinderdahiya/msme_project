export function formatDistanceLabel(meters) {
  var m = Number(meters);
  if (!isFinite(m) || m < 0) return "-";
  if (m >= 1000) return (m / 1000).toFixed(2) + " km";
  return Math.round(m) + " m";
}
