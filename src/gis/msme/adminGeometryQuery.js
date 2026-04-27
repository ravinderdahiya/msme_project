import { ADMIN_MS } from './serviceUrlsAndLayers.js'
import { queryLayer } from './queryClient.js'
import * as projection from '@arcgis/core/geometry/projection.js'
import { SR_METER, SR_WEB, SR4326 } from './spatialRefs.js'
import {
  geomFromJSON,
  ensureSR32643,
  geometryIsUsable,
  normalizeSpatialReference,
  wkidValue,
  isWebMercatorWkid,
  coerceMissingSpatialReference,
  toEngineSR,
} from './geometryUtils.js'

function firstXY(geom) {
  if (!geom) return null
  if (geom.type === 'point') return [Number(geom.x), Number(geom.y)]
  if (geom.type === 'polyline' && geom.paths && geom.paths[0] && geom.paths[0][0]) {
    return [Number(geom.paths[0][0][0]), Number(geom.paths[0][0][1])]
  }
  if (geom.type === 'polygon' && geom.rings && geom.rings[0] && geom.rings[0][0]) {
    return [Number(geom.rings[0][0][0]), Number(geom.rings[0][0][1])]
  }
  if (geom.type === 'extent') return [Number(geom.xmin), Number(geom.ymin)]
  return null
}

function looksLonLat(x, y) {
  return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) <= 180 && Math.abs(y) <= 90
}

function looksUtm43(x, y) {
  return (
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    x > 100000 &&
    x < 1000000 &&
    y > 2000000 &&
    y < 4000000
  )
}

function projectWithSr(geom, srFrom, srTo) {
  if (!geom) return null
  try {
    var g = geom
    g.spatialReference = srFrom
    var out = projection.project(g, srTo)
    if (out && geometryIsUsable(out)) return ensureSR32643(out)
  } catch (e0) {}
  return null
}

function toAdminGeometry32643(rawGeom, responseSr) {
  if (!rawGeom) return null
  var g = rawGeom
  normalizeSpatialReference(g)
  coerceMissingSpatialReference(g, responseSr || null)
  var xy = firstXY(g)
  var x0 = xy ? xy[0] : NaN
  var y0 = xy ? xy[1] : NaN
  var wk = wkidValue(g.spatialReference)

  // If service tagged geometry as UTM but coordinates are lon/lat, reinterpret as WGS84.
  if (wk === 32643 && looksLonLat(x0, y0)) {
    var fixedWgs0 = projectWithSr(g, SR4326, SR_METER)
    if (fixedWgs0) return fixedWgs0
  }

  // If service tagged as WebMercator but coordinates are lon/lat, reinterpret as WGS84.
  if (isWebMercatorWkid(wk) && looksLonLat(x0, y0)) {
    var fixedWgs1 = projectWithSr(g, SR4326, SR_METER)
    if (fixedWgs1) return fixedWgs1
  }

  var out = toEngineSR(g)
  if (out && geometryIsUsable(out)) return ensureSR32643(out)

  // Missing/wrong SR fallback by coordinate pattern.
  if (looksLonLat(x0, y0)) {
    var fixedWgs2 = projectWithSr(g, SR4326, SR_METER)
    if (fixedWgs2) return fixedWgs2
  }
  if (looksUtm43(x0, y0)) {
    g.spatialReference = SR_METER
    if (geometryIsUsable(g)) return ensureSR32643(g)
  }
  var fixedWeb = projectWithSr(g, SR_WEB, SR_METER)
  if (fixedWeb) return fixedWeb

  return null
}

export function pickFirstUsableGeometryFromFeatures(features, responseSr) {
  if (!features || !features.length) return null
  var i
  for (i = 0; i < features.length; i++) {
    var rawG = features[i].geometry
    if (!rawG) continue
    var g = toAdminGeometry32643(geomFromJSON(rawG), responseSr || null)
    if (geometryIsUsable(g)) return g
  }
  return null
}

/**
 * @returns {Promise<{ geometry: *, attributes: object|null }>}
 */
export function queryAdministrativeGeometryForZoom(layerId, where, outFields) {
  var fields = outFields || '*'
  return queryLayer(ADMIN_MS, layerId, {
    where: where,
    outFields: fields,
    returnGeometry: true,
    resultRecordCount: 15,
  }).then(function (data) {
    var feats = data && data.features
    if (!feats || !feats.length) return { geometry: null, attributes: null }
    var attrs = feats[0] ? feats[0].attributes : null
    var picked = pickFirstUsableGeometryFromFeatures(feats, data && data.spatialReference)
    if (picked) return { geometry: picked, attributes: attrs }
    return queryLayer(ADMIN_MS, layerId, {
      where: where,
      outFields: fields,
      returnGeometry: true,
      returnExtentOnly: true,
      resultRecordCount: 5,
    }).then(function (data2) {
      var feats2 = data2 && data2.features
      if (!feats2 || !feats2.length) return { geometry: null, attributes: attrs }
      var attrs2 = feats2[0] ? feats2[0].attributes : attrs
      var g2 = pickFirstUsableGeometryFromFeatures(feats2, data2 && data2.spatialReference)
      return { geometry: g2, attributes: attrs2 }
    })
  })
}
