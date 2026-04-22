import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js'
import * as jsonUtils from '@arcgis/core/geometry/support/jsonUtils.js'
import * as projection from '@arcgis/core/geometry/projection.js'
import Point from '@arcgis/core/geometry/Point.js'
import { SR_METER, SR4326 } from './spatialRefs.js'

export function geomFromJSON(g) {
  return g ? jsonUtils.fromJSON(g) : null
}

export function wkidValue(sr) {
  if (!sr) return null
  var w = sr.wkid != null ? sr.wkid : sr.latestWkid
  if (w == null) return null
  return typeof w === 'string' ? parseInt(w, 10) : w
}

export function normalizeSpatialReference(geom) {
  if (!geom || !geom.spatialReference) return geom
  var sr = geom.spatialReference
  if (sr.wkid == null && sr.latestWkid != null) {
    sr.wkid = typeof sr.latestWkid === 'string' ? parseInt(sr.latestWkid, 10) : sr.latestWkid
  }
  return geom
}

export function isWebMercatorWkid(w) {
  return w === 3857 || w === 102100 || w === 3785
}

export function coerceMissingSpatialReference(geom, defaultSR) {
  if (!geom || !defaultSR) return geom
  normalizeSpatialReference(geom)
  if (geom.spatialReference && (geom.spatialReference.wkid != null || geom.spatialReference.latestWkid != null)) {
    return geom
  }
  geom.spatialReference = defaultSR
  return geom
}

export function haversineMeters(lon1, lat1, lon2, lat2) {
  var R = 6371008.8
  var toRad = Math.PI / 180
  var phi1 = lat1 * toRad
  var phi2 = lat2 * toRad
  var dphi = (lat2 - lat1) * toRad
  var dlam = (lon2 - lon1) * toRad
  var a =
    Math.sin(dphi / 2) * Math.sin(dphi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlam / 2) * Math.sin(dlam / 2)
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** MapServer sometimes omits SR on JSON geometries — required for extent / project. */
export function ensureSR32643(geom) {
  if (!geom) return null
  normalizeSpatialReference(geom)
  if (!geom.spatialReference || (geom.spatialReference.wkid == null && geom.spatialReference.latestWkid == null)) {
    geom.spatialReference = SR_METER
  } else if (geom.spatialReference.wkid == null && geom.spatialReference.latestWkid != null) {
    geom.spatialReference.wkid =
      typeof geom.spatialReference.latestWkid === 'string'
        ? parseInt(geom.spatialReference.latestWkid, 10)
        : geom.spatialReference.latestWkid
  }
  return geom
}

export function toEngineSR(geom) {
  if (!geom) return null
  var wkid = geom.spatialReference && geom.spatialReference.wkid
  if (wkid === 32643) return geom
  return projection.project(geom, SR_METER)
}

export function geometryToQueryParams(geom) {
  if (!geom) return {}
  var g32643 = toEngineSR(geom)
  var gt = 'esriGeometryEnvelope'
  if (g32643.type === 'polygon') gt = 'esriGeometryPolygon'
  else if (g32643.type === 'polyline') gt = 'esriGeometryPolyline'
  else if (g32643.type === 'point') gt = 'esriGeometryPoint'
  else if (g32643.type === 'extent') gt = 'esriGeometryEnvelope'
  return {
    geometry: JSON.stringify(g32643.toJSON()),
    geometryType: gt,
    spatialRel: 'esriSpatialRelIntersects',
    inSR: 32643,
  }
}

export function sqlQuote(v) {
  return "'" + String(v).replace(/'/g, "''") + "'"
}

/** True if MapServer returned a drawable geometry. */
export function geometryIsUsable(geom) {
  if (!geom) return false
  if (geom.type === 'polygon') {
    if (geom.rings && geom.rings.length) return true
    if (geom.curveRings && geom.curveRings.length) return true
    return false
  }
  if (geom.type === 'polyline') return !!(geom.paths && geom.paths.length)
  if (geom.type === 'point') return geom.x != null && geom.y != null
  if (geom.type === 'multipoint') return !!(geom.points && geom.points.length)
  if (geom.type === 'extent') return true
  return false
}

export function extentLooksEmpty(ext) {
  if (!ext || !isFinite(ext.xmin) || !isFinite(ext.xmax)) return true
  return ext.width === 0 && ext.height === 0
}

/**
 * Representative interior / centre point. The sync `geometryEngine` ESM build in @arcgis/core 4.30
 * does not include `centroid`; use geometry accessors and extent fallbacks instead.
 */
export function getGeometryCentroid(geom) {
  if (!geom) return null
  normalizeSpatialReference(geom)
  try {
    if (geom.type === 'point') return geom
    if (geom.type === 'extent') return geom.center || null
    if (geom.type === 'polygon') {
      if (geom.centroid) return geom.centroid
      if (geom.extent && geom.extent.center) return geom.extent.center
      return null
    }
    if (geom.type === 'multipoint' && geom.points && geom.points.length === 1) {
      return new Point({
        x: geom.points[0][0],
        y: geom.points[0][1],
        spatialReference: geom.spatialReference,
      })
    }
    if (geom.extent && geom.extent.center) return geom.extent.center
  } catch {
    return null
  }
  return null
}

export function normalizeDistrictKey(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+division\s*$/i, '')
    .replace(/\s+district\s*$/i, '')
    .replace(/\s+/g, ' ')
}

export function geodesicDistanceMetersFallback(anchorPt32643, g32643) {
  if (!anchorPt32643 || !g32643) return null
  var pA = anchorPt32643.type === 'point' ? anchorPt32643 : null
  if (!pA) return null
  var target = g32643
  if (target.type !== 'point') {
    var nc = geometryEngine.nearestCoordinate(g32643, pA)
    if (nc && nc.coordinate) target = nc.coordinate
    else {
      target = getGeometryCentroid(g32643)
      if (!target) return null
    }
  }
  target = toEngineSR(target)
  if (!target) return null
  var a4326 = projection.project(pA, SR4326)
  var g4326 = projection.project(target, SR4326)
  if (!a4326 || !g4326) return null
  return haversineMeters(a4326.x, a4326.y, g4326.x, g4326.y)
}

export function distanceFromPointToGeometry(anchorPt32643, g32643) {
  if (!anchorPt32643 || !g32643) return null
  try {
    var g = g32643
    if (g.type === 'multipoint' && g.points && g.points.length) {
      var p0 = g.points[0]
      g = new Point({
        x: p0[0],
        y: p0[1],
        spatialReference: g.spatialReference,
      })
      g = toEngineSR(g)
    }
    if (!g) return null
    var d = geometryEngine.distance(anchorPt32643, g, 'meters')
    if (d != null && isFinite(d)) return Math.round(d)
    if (g.type !== 'point') {
      var nc = geometryEngine.nearestCoordinate(g32643, anchorPt32643)
      if (nc && nc.coordinate) {
        d = geometryEngine.distance(anchorPt32643, nc.coordinate, 'meters')
        if (d != null && isFinite(d)) return Math.round(d)
      }
    }
    var fb0 = geodesicDistanceMetersFallback(anchorPt32643, g32643)
    return fb0 != null && isFinite(fb0) ? Math.round(fb0) : null
  } catch {
    try {
      var fb = geodesicDistanceMetersFallback(anchorPt32643, g32643)
      return fb != null && isFinite(fb) ? Math.round(fb) : null
    } catch {
      return null
    }
  }
}
