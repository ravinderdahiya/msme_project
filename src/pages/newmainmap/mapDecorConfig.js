/** Normalized 0–100 coords; paths scale with map frame (any basemap image). */
export const NM_DECOR_ROADS = [
  "M 6 48 C 18 44, 28 52, 40 46 S 62 42, 78 46 L 94 42",
  "M 10 62 L 28 58 L 46 64 L 64 56 L 88 60",
  "M 22 34 Q 38 30, 52 36 T 84 32",
];

/** top/left in % of map frame; type: car | plane | hub */
export const NM_DECOR_MARKERS = [
  { id: "c1", type: "car", top: 46, left: 14 },
  { id: "c2", type: "car", top: 45, left: 22 },
  { id: "c3", type: "car", top: 47, left: 30 },
  { id: "c4", type: "car", top: 44, left: 38 },
  { id: "c5", type: "car", top: 46, left: 46 },
  { id: "c6", type: "car", top: 45, left: 54 },
  { id: "c7", type: "car", top: 47, left: 62 },
  { id: "c8", type: "car", top: 44, left: 70 },
  { id: "c9", type: "car", top: 46, left: 78 },
  { id: "c10", type: "car", top: 58, left: 26 },
  { id: "c11", type: "car", top: 60, left: 44 },
  { id: "c12", type: "car", top: 58, left: 66 },
  { id: "p1", type: "plane", top: 22, left: 82 },
  { id: "h1", type: "hub", top: 52, left: 51 },
];

/** Map center in same % space (viewport center). */
export const NM_MAP_CENTER = { left: 50, top: 50 };

export function findClosestDecorMarker() {
  const { left: cx, top: cy } = NM_MAP_CENTER;
  let best = null;
  let bestD = Infinity;
  for (const m of NM_DECOR_MARKERS) {
    const d = Math.hypot(m.left - cx, m.top - cy);
    if (d < bestD) {
      bestD = d;
      best = m;
    }
  }
  const label =
    best?.type === "plane" ? "Airport / transport" : best?.type === "hub" ? "Hub site" : "Road corridor point";
  const approxKm = Math.max(0.5, (bestD / 12) * 35).toFixed(1);
  return { marker: best, approxKm, label };
}
