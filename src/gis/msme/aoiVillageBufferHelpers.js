export function readAoiVillageBufferMeters() {
  var valEl = document.getElementById("aoiVillageBufferValue");
  var unitEl = document.getElementById("aoiVillageBufferUnit");
  var n = valEl ? parseFloat(valEl.value) : NaN;
  if (!isFinite(n) || n <= 0) n = 2;
  var unit = unitEl ? String(unitEl.value || "km").toLowerCase() : "km";
  var meters = unit === "m" ? n : (n * 1000);
  if (!isFinite(meters) || meters <= 0) meters = 2000;
  return Math.round(meters);
}

export function syncAoiVillageBufferState() {
  var aoiVillageBufferValueSelect = document.getElementById("aoiVillageBufferValue");
  var aoiVillageBufferUnitSelect = document.getElementById("aoiVillageBufferUnit");
  var villageSelect = document.getElementById("villageSelect");
  if (!aoiVillageBufferValueSelect && !aoiVillageBufferUnitSelect) return;
  var hasVillage = !!(villageSelect && villageSelect.value && String(villageSelect.value).trim());
  if (aoiVillageBufferValueSelect) aoiVillageBufferValueSelect.disabled = !hasVillage;
  if (aoiVillageBufferUnitSelect) aoiVillageBufferUnitSelect.disabled = !hasVillage;
}
