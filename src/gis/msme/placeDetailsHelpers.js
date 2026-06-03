/** Shared place-detail field extraction for map identify + community panel. */
import Point from '@arcgis/core/geometry/Point.js'
import * as projection from '@arcgis/core/geometry/projection.js'
import { queryLayer } from './queryClient.js'
import { ADMIN_MS, LAYER_DISTRICT, LAYER_TEHSIL, LAYER_VILLAGE } from './serviceUrlsAndLayers.js'
import {
  distanceFromPointToGeometry,
  geomFromJSON,
  getGeometryCentroid,
  toEngineSR,
} from './geometryUtils.js'
import { SR_METER, SR4326 } from './spatialRefs.js'

const NEAREST_TEHSIL_SEARCH_DISTANCE_M = 120000
const NEAREST_TEHSIL_QUERY_LIMIT = 25

export function normalizePlaceValue(value) {
  if (value == null) return ''
  var text = String(value).trim()
  if (!text) return ''
  var lower = text.toLowerCase()
  if (lower === 'null' || lower === 'undefined' || lower === 'na' || lower === 'n/a' || lower === '-') {
    return ''
  }
  return text
}

export function pickPlaceField(source, keys) {
  if (!source || typeof source !== 'object') return ''
  for (var i = 0; i < keys.length; i += 1) {
    var key = keys[i]
    if (!key) continue
    var direct = normalizePlaceValue(source[key])
    if (direct) return direct
    var lower = normalizePlaceValue(source[String(key).toLowerCase()])
    if (lower) return lower
    var upper = normalizePlaceValue(source[String(key).toUpperCase()])
    if (upper) return upper
  }
  return ''
}

export function coercePlaceDetails(source) {
  if (!source || typeof source !== 'object') return null

  var district = pickPlaceField(source, ['district', 'n_d_name', 'district_name', 'dist_name', 'DISTRICT'])
  var tehsil = pickPlaceField(source, ['tehsil', 'n_t_name', 'tehsil_name', 'sub_district', 'subdistrict', 'TEHSIL'])
  var village = pickPlaceField(source, ['village', 'n_v_name', 'village_name', 'vill_name', 'VILLAGE'])
  var block = pickPlaceField(source, ['block', 'block_name', 'n_blk_name', 'development_block', 'blk_name', 'BLOCK'])
  var ward = pickPlaceField(source, ['ward', 'ward_name', 'ward_no', 'w_no', 'n_w_name', 'WARD'])
  var pincode = pickPlaceField(source, [
    'pincode',
    'pin_code',
    'pin',
    'postal_code',
    'postcode',
    'zip',
    'zipcode',
    'PINCODE',
  ])
  var mcName = pickPlaceField(source, ['mcName', 'mc_name', 'municipality', 'municipal_name', 'ulb_name', 'city'])

  if (!district && !tehsil && !village && !block && !ward && !pincode && !mcName) return null

  return {
    district: district || null,
    tehsil: tehsil || null,
    village: village || null,
    block: block || null,
    ward: ward || null,
    pincode: pincode || null,
    mcName: mcName || null,
  }
}

export function mergePlaceDetails(base, extra) {
  var out = Object.assign({}, base || {})
  var add = coercePlaceDetails(extra) || extra
  if (!add || typeof add !== 'object') return Object.keys(out).length ? out : null
  ;['district', 'tehsil', 'village', 'block', 'ward', 'pincode', 'mcName'].forEach(function (key) {
    if (!out[key] && add[key]) out[key] = add[key]
  })
  return coercePlaceDetails(out)
}

export function isAdminBoundaryIdentifyResult(res, adminMsUrl) {
  if (!res) return false
  var url = String(res._identifyUrl || '')
  if (adminMsUrl && url.indexOf(adminMsUrl) < 0 && url.indexOf('Administrative') < 0) return false
  if (url.indexOf('Administrative') < 0) return false
  var lid = Number(res.layerId)
  return lid === 1 || lid === 3 || lid === 4
}

export function extractPlaceDetailsFromIdentifyFlat(flat, adminMsUrl) {
  var merged = {}
  var hits = (flat || []).filter(function (res) {
    return isAdminBoundaryIdentifyResult(res, adminMsUrl)
  })
  hits.sort(function (a, b) {
    return Number(b.layerId) - Number(a.layerId)
  })
  hits.forEach(function (res) {
    var attrs = res.feature && res.feature.attributes
    if (!attrs) return
    mergePlaceDetails(merged, attrs)
  })
  ;(flat || []).forEach(function (res) {
    var url = String(res._identifyUrl || '')
    if (url.indexOf('Cadastral') < 0) return
    var attrs = res.feature && res.feature.attributes
    if (!attrs) return
    mergePlaceDetails(merged, attrs)
  })
  return coercePlaceDetails(merged)
}

function finiteNumber(value) {
  var num = Number(value)
  return Number.isFinite(num) ? num : null
}

function normalizeLonLat(lonLike, latLike) {
  var lon = finiteNumber(lonLike)
  var lat = finiteNumber(latLike)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    if (Math.abs(lon) <= 90 && Math.abs(lat) <= 180) {
      var swapLat = lon
      var swapLon = lat
      lat = swapLat
      lon = swapLon
    }
  }
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  return { lat: lat, lon: lon }
}

export function extractPointForPlaceLookup(summary, report) {
  var candidates = []
  if (report && typeof report === 'object') {
    candidates.push(report)
    if (report.domContext && typeof report.domContext === 'object') candidates.push(report.domContext)
    if (Array.isArray(report.clicks) && report.clicks.length) {
      candidates.push(report.clicks[report.clicks.length - 1] || null)
    }
  }
  if (summary && typeof summary === 'object') {
    candidates.push(summary)
    if (summary.domContext && typeof summary.domContext === 'object') candidates.push(summary.domContext)
  }

  for (var i = 0; i < candidates.length; i += 1) {
    var src = candidates[i]
    if (!src || typeof src !== 'object') continue

    var point = normalizeLonLat(
      src.lon ?? src.lng ?? src.long ?? src.longitude ?? src.x,
      src.lat ?? src.latitude ?? src.y,
    )
    if (point) return point

    var geom = src.geometry
    if (geom && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
      point = normalizeLonLat(geom.coordinates[0], geom.coordinates[1])
      if (point) return point
    }
    if (geom && typeof geom === 'object') {
      point = normalizeLonLat(
        geom.lon ?? geom.lng ?? geom.long ?? geom.longitude ?? geom.x,
        geom.lat ?? geom.latitude ?? geom.y,
      )
      if (point) return point
    }
  }
  return null
}

function queryAdminPointLayer(layerId, point) {
  return queryLayer(ADMIN_MS, layerId, {
    where: '1=1',
    geometryType: 'esriGeometryPoint',
    geometry: `${point.lon},${point.lat}`,
    inSR: 4326,
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: false,
    resultRecordCount: 1,
  })
    .then(function (data) {
      var feature = data && Array.isArray(data.features) ? data.features[0] : null
      return feature && feature.attributes ? coercePlaceDetails(feature.attributes) : null
    })
    .catch(function () {
      return null
    })
}

function tehsilCentroidWgs84(geometry32643) {
  if (!geometry32643) return null
  var centroid = getGeometryCentroid(geometry32643)
  if (!centroid) return null
  try {
    var wgs = projection.project(centroid, SR4326)
    return normalizeLonLat(wgs && wgs.x, wgs && wgs.y)
  } catch (_e0) {
    return null
  }
}

function queryTehsilCandidatesNearPoint(point, useDistanceBuffer) {
  var query = {
    where: '1=1',
    geometryType: 'esriGeometryPoint',
    geometry: `${point.lon},${point.lat}`,
    inSR: 4326,
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: true,
    resultRecordCount: useDistanceBuffer ? NEAREST_TEHSIL_QUERY_LIMIT : 1,
  }
  if (useDistanceBuffer) {
    query.distance = NEAREST_TEHSIL_SEARCH_DISTANCE_M
    query.units = 'esriSRUnit_Meter'
  }
  return queryLayer(ADMIN_MS, LAYER_TEHSIL, query)
}

function pickNearestTehsilFeature(data, anchor32643) {
  var feats = data && Array.isArray(data.features) ? data.features : []
  if (!feats.length || !anchor32643) return null

  var best = null
  var bestDist = null
  feats.forEach(function (feature) {
    var rawG = feature && feature.geometry
    if (!rawG) return
    var g = toEngineSR(geomFromJSON(rawG))
    if (!g) return
    var d = distanceFromPointToGeometry(anchor32643, g)
    if (d == null) return
    if (bestDist == null || d < bestDist) {
      bestDist = d
      best = { feature: feature, geometry: g, distanceM: d }
    }
  })
  return best
}

/**
 * When a map click is outside tehsil polygons, find the nearest tehsil boundary
 * and return its attributes, centroid (WGS84), and geometry for downstream lookups.
 */
export function queryNearestTehsilAtPointWgs84(point) {
  if (!point || typeof point !== 'object') return Promise.resolve(null)
  var normalized = normalizeLonLat(point.lon, point.lat)
  if (!normalized) return Promise.resolve(null)

  return projection
    .load()
    .then(function () {
      var anchor4326 = new Point({
        x: normalized.lon,
        y: normalized.lat,
        spatialReference: SR4326,
      })
      var anchor32643 = projection.project(anchor4326, SR_METER)
      if (!anchor32643) return null

      return queryTehsilCandidatesNearPoint(normalized, false).then(function (hitData) {
        var picked = pickNearestTehsilFeature(hitData, anchor32643)
        if (picked) return picked
        return queryTehsilCandidatesNearPoint(normalized, true).then(function (bufferData) {
          return pickNearestTehsilFeature(bufferData, anchor32643)
        })
      })
    })
    .then(function (picked) {
      if (!picked) return null
      var attrs = picked.feature && picked.feature.attributes ? picked.feature.attributes : null
      var placeDetails = coercePlaceDetails(attrs)
      var centroid = tehsilCentroidWgs84(picked.geometry)
      var geometryJson = null
      try {
        geometryJson = picked.geometry && picked.geometry.toJSON ? picked.geometry.toJSON() : null
      } catch (_e1) {
        geometryJson = null
      }
      return {
        placeDetails,
        attributes: attrs,
        centroid,
        geometryJson,
        distanceM: picked.distanceM,
        tehsil:
          (placeDetails && placeDetails.tehsil) ||
          pickPlaceField(attrs, ['tehsil', 'n_t_name', 'tehsil_name', 'TEHSIL']),
      }
    })
    .catch(function () {
      return null
    })
}

export function queryPlaceDetailsByPointWgs84(point) {
  if (!point || typeof point !== 'object') return Promise.resolve(null)
  var normalized = normalizeLonLat(point.lon, point.lat)
  if (!normalized) return Promise.resolve(null)

  return Promise.all([
    queryAdminPointLayer(LAYER_VILLAGE, normalized),
    queryAdminPointLayer(LAYER_TEHSIL, normalized),
    queryAdminPointLayer(LAYER_DISTRICT, normalized),
  ]).then(function (parts) {
    var villageData = parts[0]
    var tehsilData = parts[1]
    var districtData = parts[2]
    var merged = mergePlaceDetails(mergePlaceDetails(villageData, tehsilData), districtData)
    if (merged && merged.tehsil) return merged
    return queryNearestTehsilAtPointWgs84(normalized).then(function (nearest) {
      if (!nearest || !nearest.placeDetails) return merged
      return mergePlaceDetails(merged, nearest.placeDetails)
    })
  })
}

function collectGeometryJsonCandidates(summary, report) {
  var out = []
  var sources = [report, summary]
  sources.forEach(function (src) {
    if (!src || typeof src !== 'object') return
    ;[
      src.summaryGeometryJson,
      src.queryGeometryJson,
      src.analysisGeometryJson,
      src.geometryJson,
      src.geometry,
      src.summaryGeometry,
    ].forEach(function (v) {
      if (v != null) out.push(v)
    })
  })
  return out
}

function parseGeometryJsonCandidate(raw) {
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch (_e0) {
      return null
    }
  }
  if (typeof raw === 'object') return raw
  return null
}

export function resolvePlaceLookupPointFromGeometry(summary, report) {
  var candidates = collectGeometryJsonCandidates(summary, report)
  if (!candidates.length) return Promise.resolve(null)

  return Promise.all([
    import('@arcgis/core/geometry/support/jsonUtils.js'),
    import('@arcgis/core/geometry/projection'),
    import('@arcgis/core/geometry/SpatialReference.js'),
  ])
    .then(function (mods) {
      var jsonUtils = mods[0]
      var projection = mods[1]
      var SpatialReference = mods[2] && mods[2].default ? mods[2].default : mods[2]
      if (!jsonUtils || typeof jsonUtils.fromJSON !== 'function' || !projection) return null

      return projection.load().then(function () {
        var sr4326 = new SpatialReference({ wkid: 4326 })

        for (var i = 0; i < candidates.length; i += 1) {
          var gj = parseGeometryJsonCandidate(candidates[i])
          if (!gj) continue

          var geom = null
          try {
            geom = jsonUtils.fromJSON(gj)
          } catch (_e1) {
            geom = null
          }
          if (!geom) continue

          var anchor = null
          if (geom.type === 'point') anchor = geom
          else if (geom.extent && geom.extent.center) anchor = geom.extent.center
          else if (geom.type === 'extent' && geom.center) anchor = geom.center
          if (!anchor) continue

          var wgsPoint = anchor
          try {
            if (!anchor.spatialReference || Number(anchor.spatialReference.wkid) !== 4326) {
              var projected = projection.project(anchor, sr4326)
              if (projected) wgsPoint = projected
            }
          } catch (_e2) {
            wgsPoint = anchor
          }

          var normalized = normalizeLonLat(wgsPoint.x, wgsPoint.y)
          if (normalized) return normalized
        }
        return null
      })
    })
    .catch(function () {
      return null
    })
}
