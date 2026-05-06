function setSliderDistanceValue(sliderId, outId, nextMeters, fallbackMeters) {
  var d = parseInt(nextMeters, 10);
  if (!isFinite(d) || d <= 0) d = fallbackMeters;
  var slider = document.getElementById(sliderId);
  var out = document.getElementById(outId);
  if (slider) {
    var minV = parseInt(slider.min, 10);
    var maxV = parseInt(slider.max, 10);
    if (isFinite(minV)) d = Math.max(minV, d);
    if (isFinite(maxV)) d = Math.min(maxV, d);
    slider.value = String(d);
    try {
      slider.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (e0) {
      if (out) out.textContent = String(d);
    }
  } else if (out) {
    out.textContent = String(d);
  }
  return d;
}

export function setBufferDistanceMeters(nextMeters) {
  return setSliderDistanceValue("bufDist", "bufDistVal", nextMeters, 1500);
}

export function setProximityDistanceMeters(nextMeters) {
  return setSliderDistanceValue("proxDist", "proxDistVal", nextMeters, 2000);
}

export function setBufferQueryRadiusMeters(nextMeters) {
  return setSliderDistanceValue("bufMarkQueryRadius", "bufMarkQueryRadiusVal", nextMeters, 5000);
}

export function readDistanceMetersFromNumUnit(numId, unitId, fallbackMeters) {
  var raw = Number((document.getElementById(numId) || {}).value);
  var unit = String(((document.getElementById(unitId) || {}).value) || "m").toLowerCase();
  var m = NaN;
  if (isFinite(raw) && raw > 0) {
    m = unit === "km" ? Math.round(raw * 1000) : Math.round(raw);
  }
  if (!isFinite(m) || m <= 0) m = Number(fallbackMeters);
  if (!isFinite(m) || m <= 0) m = 1000;
  return Math.round(m);
}

export function readBufferPickDistanceMetersFromUi() {
  var slider = document.getElementById("bufDist");
  var fallback = slider ? parseInt(slider.value, 10) : 1500;
  return readDistanceMetersFromNumUnit("bufferPickDistNum", "bufferPickDistUnit", fallback);
}

export function readProximityDistanceMetersFromUi() {
  var slider = document.getElementById("proxDist");
  var fallback = slider ? parseInt(slider.value, 10) : 2000;
  return readDistanceMetersFromNumUnit("proximityPickDistNum", "proximityPickDistUnit", fallback);
}

export function readClosestDistanceMetersFromUi() {
  var dMeters = NaN;
  var numEl = document.getElementById("closestDistNum");
  var unitEl = document.getElementById("closestDistUnit");
  var rawNum = numEl ? Number(numEl.value) : NaN;
  var unit = unitEl ? String(unitEl.value || "m").toLowerCase() : "m";
  if (isFinite(rawNum) && rawNum > 0) {
    dMeters = unit === "km" ? Math.round(rawNum * 1000) : Math.round(rawNum);
  }
  if (!isFinite(dMeters) || dMeters <= 0) {
    var el = document.getElementById("closestDist");
    if (el) dMeters = parseInt(el.value, 10);
  }
  if (!isFinite(dMeters) || dMeters <= 0) {
    var slider = document.getElementById("bufDist");
    dMeters = slider ? parseInt(slider.value, 10) : NaN;
  }
  if (!isFinite(dMeters) || dMeters <= 0) dMeters = 1500;
  return Math.round(dMeters);
}
