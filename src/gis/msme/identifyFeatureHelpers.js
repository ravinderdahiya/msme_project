import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js'
import { CAD_MS } from './serviceUrlsAndLayers.js'
import {
  geomFromJSON,
  coerceMissingSpatialReference,
  ensureSR32643,
  geometryIsUsable,
  toEngineSR,
} from './geometryUtils.js'
import { SR_WEB } from './spatialRefs.js'

/** Administrative / electoral outlines — skip for map highlight & simple popup. */
export function isBoundaryLayerName(layerName) {
  var n = String(layerName || '').toLowerCase()
  if (!n) return false
  if (/\bboundary\b/.test(n)) return true
  if (/\bconstituenc/.test(n)) return true
  if (/\bassembly\b/.test(n) && /\bbound/.test(n)) return true
  if (/\bparliament\b/.test(n) && /\bbound/.test(n)) return true
  if (n.indexOf('administrative') !== -1) return true
  if (/\bpolice\b/.test(n) && /\bbound/.test(n)) return true
  if (/\bdemography\b/.test(n)) return true
  if (/\bmurabba grid\b/.test(n) || (/\bgrid\b/.test(n) && n.indexOf('murabba') !== -1)) return true
  if (/\bdistrict\b/.test(n) && /\bbound/.test(n)) return true
  if (/\btehsil\b/.test(n) && /\bbound/.test(n)) return true
  if (/\bvillage\b/.test(n) && /\bbound/.test(n)) return true
  return false
}

export function pickSmallestPolygonFromIdentifyFlat(flat) {
  var candidates = []
  ;(flat || []).forEach(function (res) {
    if (isBoundaryLayerName(res.layerName)) return
    var gj = res.feature && res.feature.geometry
    var g = gj ? geomFromJSON(gj) : null
    if (!g || g.type !== 'polygon' || !geometryIsUsable(g)) return
    var g32643 = toEngineSR(g)
    if (!g32643 || !g32643.extent) return
    var area = Math.abs(g32643.extent.width * g32643.extent.height)
    candidates.push({ g: g32643, area: area })
  })
  if (!candidates.length) return null
  candidates.sort(function (a, b) {
    return a.area - b.area
  })
  return candidates[0].g
}

/**
 * One feature to draw on the map (avoid painting every overlapping polygon).
 * Prefers non-boundary cadastral, else smallest polygon, else first point/line.
 */
export function pickPrimaryIdentifyHitsForMap(flat) {
  if (!flat || !flat.length) return []
  var nb = flat.filter(function (r) {
    return !isBoundaryLayerName(r.layerName)
  })
  var pool = nb.length ? nb : []
  if (!pool.length) return []
  var cad = pool.filter(function (r) {
    return r._identifyUrl === CAD_MS
  })
  var work = cad.length ? cad : pool
  var polys = []
  work.forEach(function (res) {
    var gj = res.feature && res.feature.geometry
    var g = gj ? geomFromJSON(gj) : null
    if (!g || g.type !== 'polygon' || !geometryIsUsable(g)) return
    coerceMissingSpatialReference(g, SR_WEB)
    var g326 = toEngineSR(g)
    if (!g326 || !g326.extent) return
    var area = Math.abs(g326.extent.width * g326.extent.height)
    polys.push({ res: res, area: area })
  })
  if (polys.length) {
    polys.sort(function (a, b) {
      return a.area - b.area
    })
    return [polys[0].res]
  }
  var i
  for (i = 0; i < work.length; i++) {
    var gj2 = work[i].feature && work[i].feature.geometry
    var g2 = gj2 ? geomFromJSON(gj2) : null
    if (!g2) continue
    coerceMissingSpatialReference(g2, SR_WEB)
    if (g2.type === 'point' || g2.type === 'multipoint') return [work[i]]
  }
  for (i = 0; i < work.length; i++) {
    var gj3 = work[i].feature && work[i].feature.geometry
    var g3 = gj3 ? geomFromJSON(gj3) : null
    if (g3 && (g3.type === 'polyline' || g3.type === 'polygon')) return [work[i]]
  }
  return []
}

export function identifyResultDedupeKey(res) {
  var a = (res.feature && res.feature.attributes) || {}
  var oid = a.OBJECTID != null ? a.OBJECTID : a.FID != null ? a.FID : ''
  return (
    String(res._identifyUrl || '') +
    '|' +
    String(res.layerId != null ? res.layerId : '') +
    '|' +
    String(res.layerName || '') +
    '|' +
    String(oid)
  )
}

/** Draw many non-boundary hits (roads, POI, cad, etc.) — not cad-only. */
export function pickIdentifyHitsForHighlight(mergedFlat, maxN) {
  maxN = maxN || 24
  if (!mergedFlat || !mergedFlat.length) return []
  var nb = mergedFlat.filter(function (r) {
    return !isBoundaryLayerName(r.layerName)
  })
  var pool = nb.length ? nb : mergedFlat
  var seen = {}
  var out = []
  pool.forEach(function (res) {
    if (out.length >= maxN) return
    var gj = res.feature && res.feature.geometry
    var g = gj ? geomFromJSON(gj) : null
    if (!g || !geometryIsUsable(g)) return
    var k = identifyResultDedupeKey(res)
    if (seen[k]) return
    seen[k] = true
    out.push(res)
  })
  return out
}

export function escapeHtml(s) {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildSimpleIdentifyPopupHtml(lat, lon, primaryLayerName, distM, mapPopupTitleFallback) {
  var title = primaryLayerName
    ? escapeHtml(primaryLayerName)
    : escapeHtml(mapPopupTitleFallback || 'Features at this location')
  var distStr = distM != null && isFinite(distM) && distM < 1e6 ? Math.round(distM) + ' m' : '—'
  return (
    '<div style="font-size:12px;line-height:1.45;max-width:260px;padding:2px 0;">' +
    '<p style="margin:0 0 4px;font-weight:600;color:#202124;font-size:13px;">' +
    title +
    '</p>' +
    '<p style="margin:0;color:#5f6368;font-size:11px;">' +
    lat.toFixed(5) +
    '°, ' +
    lon.toFixed(5) +
    '° · ' +
    distStr +
    '</p></div>'
  )
}

export function computeUnionGeometryFromFlats(flatList) {
  if (!flatList || !flatList.length) return null
  var geoms = []
  flatList.forEach(function (res) {
    if (isBoundaryLayerName(res.layerName)) return
    var gj = res.feature && res.feature.geometry
    var g = gj ? geomFromJSON(gj) : null
    if (!g || !geometryIsUsable(g)) return
    coerceMissingSpatialReference(g, SR_WEB)
    var g326 = toEngineSR(g)
    if (!g326) return
    if (g326.type === 'point' || g326.type === 'multipoint') {
      try {
        var bp = geometryEngine.buffer(g326, 120, 'meters')
        if (bp && geometryIsUsable(bp)) geoms.push(ensureSR32643(bp))
      } catch (eB) {
        console.warn('[union buffer point]', eB)
      }
    } else {
      geoms.push(g326)
    }
  })
  if (!geoms.length) return null
  if (geoms.length === 1) return geoms[0]
  try {
    var u = geometryEngine.union(geoms)
    return u && geometryIsUsable(u) ? ensureSR32643(u) : null
  } catch (eU) {
    console.warn('[union session]', eU)
    return null
  }
}
