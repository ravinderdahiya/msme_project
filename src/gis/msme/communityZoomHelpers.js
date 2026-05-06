export function deriveCommunityZoomLabel(detail) {
  if (!detail) return "Selected location";
  var item = detail.item || {};
  return item.name || item.Name || item.label || item.title || item.itiName || item.iti_name || "Selected location";
}

export function resolveCommunityZoomPoint4326(detail, deps) {
  if (!detail || !deps) return null;
  var Point = deps.Point;
  var SR4326 = deps.SR4326;
  var geomFromJSON = deps.geomFromJSON;
  var coerceMissingSpatialReference = deps.coerceMissingSpatialReference;
  var projection = deps.projection;
  var getGeometryCentroid = deps.getGeometryCentroid;

  function toNum(v) {
    var n = Number(v);
    return isFinite(n) ? n : NaN;
  }

  function tryLatLngFrom(obj) {
    if (!obj) return null;
    var latCandidates = [
      obj.lat, obj.latitude, obj.Lat, obj.LAT, obj.y, obj.Y, obj.Latitude, obj.LATITUDE
    ];
    var lngCandidates = [
      obj.lng, obj.lon, obj.long, obj.longitude, obj.Long, obj.LONG, obj.Lon, obj.LON, obj.x, obj.X, obj.Longitude, obj.LONGITUDE
    ];
    var lat = NaN;
    var lng = NaN;
    for (var i = 0; i < latCandidates.length; i++) {
      lat = toNum(latCandidates[i]);
      if (isFinite(lat)) break;
    }
    for (var j = 0; j < lngCandidates.length; j++) {
      lng = toNum(lngCandidates[j]);
      if (isFinite(lng)) break;
    }
    if (!isFinite(lat) || !isFinite(lng)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      if (Math.abs(lng) <= 90 && Math.abs(lat) <= 180) {
        var t = lat;
        lat = lng;
        lng = t;
      }
    }
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return new Point({ x: lng, y: lat, spatialReference: SR4326 });
  }

  var direct = tryLatLngFrom(detail);
  if (direct) return direct;

  var item = detail.item || {};
  var fromItem = tryLatLngFrom(item) || tryLatLngFrom(item.attributes || {}) || tryLatLngFrom(item.properties || {});
  if (fromItem) return fromItem;

  var rawGeom = null;
  try {
    rawGeom = geomFromJSON(item.geometry || item.geomJson || item.geometryJson);
  } catch (e0) {
    rawGeom = null;
  }
  if (!rawGeom && item.geometry && typeof item.geometry === "object") {
    var gx = Number(item.geometry.x);
    var gy = Number(item.geometry.y);
    if (isFinite(gx) && isFinite(gy)) {
      rawGeom = new Point({
        x: gx,
        y: gy,
        spatialReference: item.geometry.spatialReference || SR4326
      });
    }
  }
  if (!rawGeom) return null;

  coerceMissingSpatialReference(rawGeom, rawGeom.spatialReference || SR4326);
  var g4326 = projection.project(rawGeom, SR4326) || rawGeom;
  var pt = g4326 && g4326.type === "point" ? g4326 : getGeometryCentroid(g4326);
  if (!pt) return null;

  var latOut = Number(pt.y);
  var lngOut = Number(pt.x);
  if (!isFinite(latOut) || !isFinite(lngOut)) return null;
  if (Math.abs(latOut) > 90 || Math.abs(lngOut) > 180) return null;
  return new Point({ x: lngOut, y: latOut, spatialReference: SR4326 });
}
