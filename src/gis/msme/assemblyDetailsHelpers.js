import Point from '@arcgis/core/geometry/Point.js'
import * as projection from '@arcgis/core/geometry/projection.js'
import { queryLayer } from './queryClient.js'
import { CON_MS, LAYER_CON_ASSEMBLY } from './serviceUrlsAndLayers.js'
import {
  getAssemblyBoundaryInvesthrySources,
  getAssemblyInvesthryQuerySources,
  getAssemblyMetricInvesthrySources,
} from './assemblyInvesthrySources.js'
import { resolveInvesthryFeatureUrl } from './resolveMapServiceUrl.js'
import {
  distanceFromPointToGeometry,
  geomFromJSON,
  toEngineSR,
} from './geometryUtils.js'
import { SR_METER, SR4326 } from './spatialRefs.js'
import {
  normalizePlaceValue,
  pickPlaceField,
  queryNearestTehsilAtPointWgs84,
} from './placeDetailsHelpers.js'

const ASSEMBLY_POINT_SEARCH_DISTANCE_M = 120000
const ASSEMBLY_POINT_QUERY_LIMIT = 25

function normalizePercent(value) {
  var text = normalizePlaceValue(value)
  if (!text) return null
  var num = Number(String(text).replace(/[^\d.-]/g, ''))
  if (!Number.isFinite(num)) return text
  return num
}

function normalizeCount(value) {
  var text = normalizePlaceValue(value)
  if (!text) return null
  var num = Number(String(text).replace(/[^\d.-]/g, ''))
  if (!Number.isFinite(num)) return text
  return Math.max(0, Math.round(num))
}

function toNormalizedPoint(point) {
  if (!point || typeof point !== 'object') return null
  var lon = Number(point.lon)
  var lat = Number(point.lat)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    if (Math.abs(lon) <= 90 && Math.abs(lat) <= 180) {
      var swappedLat = lon
      var swappedLon = lat
      lat = swappedLat
      lon = swappedLon
    }
  }
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  return { lat: lat, lon: lon }
}

function parseGeometryJson(raw) {
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

function geometryTypeForQuery(geom) {
  if (!geom || typeof geom !== 'object') return null
  if (Array.isArray(geom.rings)) return 'esriGeometryPolygon'
  if (Array.isArray(geom.paths)) return 'esriGeometryPolyline'
  if (Array.isArray(geom.points)) return 'esriGeometryMultipoint'
  if (geom.x != null && geom.y != null) return 'esriGeometryPoint'
  if (geom.xmin != null && geom.ymin != null && geom.xmax != null && geom.ymax != null) {
    return 'esriGeometryEnvelope'
  }
  return null
}

function inSrFromGeometry(geom) {
  var sr = geom && geom.spatialReference ? geom.spatialReference : null
  var wkid = Number(sr && (sr.wkid != null ? sr.wkid : sr.latestWkid))
  return Number.isFinite(wkid) && wkid > 0 ? wkid : null
}

export function coerceAssemblyDetails(source) {
  if (!source || typeof source !== 'object') return null

  var vidhanSabha = pickPlaceField(source, [
    'ac_name',
    'acname',
    'AC_NAME',
    'const_name',
    'constituency',
    'vidhan_sabha',
    'vidhansabha',
    'assembly_name',
    'ASSEMBLY_NAME',
    'vs_name',
    'name',
    'NAME',
  ])
  var vidhanSabhaCode = pickPlaceField(source, [
    'ac_no',
    'acno',
    'AC_NO',
    'ac_code',
    'const_id',
    'assembly_code',
    'assembly_no',
    'code',
    'CODE',
  ])
  var district = pickPlaceField(source, [
    'n_d_name',
    'district',
    'district_name',
    'dist_name',
    'DISTRICT',
    'DISTRICT_NAME',
    'DIST_NAME',
  ])
  var proposedPolicy = pickPlaceField(source, [
    'area_tyep',
    'area_type',
    'AREA_TYEP',
    'AREA_TYPE',
    'proposed_new_policy',
    'new_policy',
    'policy_year',
    'policy',
    'proposed_policy',
    'PROPOSED_POLICY',
    'PROPOSED_NEW_POLICY',
    'POLICY_YEAR',
    'POLICY',
  ])
  var developmentPlan = pickPlaceField(source, [
    'developmentPlan',
    'development_plan',
    'DEVELOPMENT_PLAN',
    'area_tyep',
    'area_type',
    'AREA_TYEP',
    'AREA_TYPE',
    'proposedPolicy',
    'proposed_policy',
    'PROPOSED_POLICY',
  ])
  var proposedAreaPct = normalizePercent(
    pickPlaceField(source, [
      'proposedAreaPct',
      'controlled',
      'CONTROLLED',
      'proposed_area_pct',
      'proposed_area_perc',
      'proposed_area',
      'PROPOSED_AREA_PCT',
      'PROPOSED_AREA',
    ]),
  )
  var controlledArea = normalizePercent(
    pickPlaceField(source, [
      'controlledArea',
      'controlled_area',
      'CONTROLLED_AREA',
      'controlled',
      'CONTROLLED',
      'proposedAreaPct',
      'proposed_area_pct',
      'PROPOSED_AREA_PCT',
    ]),
  )
  var intermediateAreaPct = normalizePercent(
    pickPlaceField(source, [
      'intermediateAreaPct',
      'im_per',
      'IM_PER',
      'per_im',
      'PER_IM',
      'intermediate_area_pct',
      'intermediate_area_perc',
      'intermediate_pct',
      'intermediate',
      'int_area_pct',
      'ia_pct',
      'INTERMEDIATE_AREA_PCT',
      'INTERMEDIATE_PCT',
      'INTERMEDIATE_AREA',
      'intermediatearea',
      'intermediate_area',
    ]),
  )
  var coreAreaPct = normalizePercent(
    pickPlaceField(source, [
      'coreAreaPct',
      'core_per',
      'CORE_PER',
      'per_core',
      'PER_CORE',
      'core_area_pct',
      'core_area_perc',
      'core_pct',
      'core_area',
      'ca_pct',
      'CORE_AREA_PCT',
      'CORE_PCT',
      'CORE_AREA',
      'corearea',
      'CoreArea',
    ]),
  )
  var subPrimeAreaPct = normalizePercent(
    pickPlaceField(source, [
      'subPrimeAreaPct',
      'sp_per',
      'SP_PER',
      'per_sp',
      'PER_SP',
      'sub_prime_area_pct',
      'subprime_area_pct',
      'sub_prime_pct',
      'subprime_pct',
      'sub_prime',
      'subprime',
      'spa_pct',
      'SUB_PRIME_AREA_PCT',
      'SUBPRIME_PCT',
      'SUB_PRIME_PCT',
      'subprime_area',
      'sub_prime_area',
    ]),
  )
  var mcPct = normalizePercent(
    pickPlaceField(source, [
      'mcPct',
      'mcper',
      'MCPER',
      'MC_PER',
      'mc_pct',
      'mc_percentage',
      'municipal_pct',
      'municipal_corporation_pct',
      'MC_PCT',
      'MC_PERCENTAGE',
    ]),
  )
  var existingIndustry = normalizePercent(
    pickPlaceField(source, [
      'existingIndustry',
      'areacont',
      'AREACONT',
      'area_cont',
      'existing_industry',
      'existing_industries',
      'existing_industry_count',
      'industry_count',
      'no_of_industry',
      'total_industry',
      'EXISTING_INDUSTRY',
      'EXISTING_INDUSTRIES',
      'EXISTINGINDUSTRY',
      'NO_OF_INDUSTRY',
    ]),
  )

  var nearestTehsil = pickPlaceField(source, ['nearestTehsil', 'nearest_tehsil'])
  var usedTehsilFallback = Boolean(source.usedTehsilFallback)

  if (
    !vidhanSabha &&
    !district &&
    !proposedPolicy &&
    !developmentPlan &&
    proposedAreaPct == null &&
    controlledArea == null &&
    !nearestTehsil &&
    !usedTehsilFallback &&
    intermediateAreaPct == null &&
    coreAreaPct == null &&
    subPrimeAreaPct == null &&
    mcPct == null &&
    existingIndustry == null
  ) {
    return null
  }

  return {
    vidhanSabha: vidhanSabha || null,
    vidhanSabhaCode: vidhanSabhaCode || null,
    district: district || null,
    proposedPolicy: proposedPolicy || null,
    developmentPlan: developmentPlan || proposedPolicy || null,
    proposedAreaPct: proposedAreaPct == null ? null : proposedAreaPct,
    controlledArea: controlledArea == null ? proposedAreaPct : controlledArea,
    intermediateAreaPct: intermediateAreaPct == null ? null : intermediateAreaPct,
    coreAreaPct: coreAreaPct == null ? null : coreAreaPct,
    subPrimeAreaPct: subPrimeAreaPct == null ? null : subPrimeAreaPct,
    mcPct: mcPct == null ? null : mcPct,
    existingIndustry: existingIndustry == null ? null : existingIndustry,
    nearestTehsil: nearestTehsil || null,
    usedTehsilFallback: usedTehsilFallback,
  }
}

function hasMeaningfulAssemblyValue(value) {
  return !(value == null || value === '')
}

var ASSEMBLY_METRIC_KEYS = [
  'proposedPolicy',
  'developmentPlan',
  'proposedAreaPct',
  'controlledArea',
  'intermediateAreaPct',
  'coreAreaPct',
  'subPrimeAreaPct',
  'mcPct',
  'existingIndustry',
]

export function mergeAssemblyDetails(base, extra) {
  var left = coerceAssemblyDetails(base) || {}
  var right = coerceAssemblyDetails(extra) || {}
  var merged = Object.assign({}, left)

  ;[
    'vidhanSabha',
    'vidhanSabhaCode',
    'district',
    'proposedPolicy',
    'developmentPlan',
    'proposedAreaPct',
    'controlledArea',
    'intermediateAreaPct',
    'coreAreaPct',
    'subPrimeAreaPct',
    'mcPct',
    'existingIndustry',
    'nearestTehsil',
    'usedTehsilFallback',
  ].forEach(function (key) {
    var preferRight =
      ASSEMBLY_METRIC_KEYS.indexOf(key) >= 0 &&
      hasMeaningfulAssemblyValue(right[key])
    if (preferRight) {
      merged[key] = right[key]
      return
    }
    if (merged[key] == null && right[key] != null) merged[key] = right[key]
  })

  return coerceAssemblyDetails(merged)
}

function mergeAssemblyDetailsList(list) {
  var merged = null
  ;(list || []).forEach(function (row) {
    merged = mergeAssemblyDetails(merged, row)
  })
  return merged
}

function attrsFromQueryResult(data) {
  var feature = data && Array.isArray(data.features) ? data.features[0] : null
  return feature && feature.attributes ? feature.attributes : null
}

function pickNearestAssemblyAttrsFromQuery(data, normalizedPoint) {
  var feats = data && Array.isArray(data.features) ? data.features : []
  if (!feats.length) return Promise.resolve(null)
  if (feats.length === 1) {
    var single = feats[0] && feats[0].attributes ? feats[0].attributes : null
    return Promise.resolve(single)
  }
  if (!normalizedPoint) return Promise.resolve(attrsFromQueryResult(data))

  return projection.load().then(function () {
    var anchor4326 = new Point({
      x: normalizedPoint.lon,
      y: normalizedPoint.lat,
      spatialReference: SR4326,
    })
    var anchor32643 = projection.project(anchor4326, SR_METER)
    if (!anchor32643) return attrsFromQueryResult(data)

    var bestAttrs = null
    var bestDist = null
    feats.forEach(function (feature) {
      var rawG = feature && feature.geometry
      var attrs = feature && feature.attributes
      if (!attrs) return
      if (!rawG) {
        if (bestAttrs == null) bestAttrs = attrs
        return
      }
      var g = toEngineSR(geomFromJSON(rawG))
      if (!g) return
      var d = distanceFromPointToGeometry(anchor32643, g)
      if (d == null) return
      if (bestDist == null || d < bestDist) {
        bestDist = d
        bestAttrs = attrs
      }
    })
    return bestAttrs || attrsFromQueryResult(data)
  })
}

function queryFeatureServerAtPoint(serviceUrl, layerId, geometryType, geometry, inSR, normalizedPoint) {
  if (!serviceUrl) return Promise.resolve(null)
  return queryLayer(serviceUrl, layerId, {
    where: '1=1',
    geometryType: geometryType,
    geometry: geometry,
    inSR: inSR,
    spatialRel: 'esriSpatialRelIntersects',
    distance: ASSEMBLY_POINT_SEARCH_DISTANCE_M,
    units: 'esriSRUnit_Meter',
    outFields: '*',
    returnGeometry: true,
    resultRecordCount: ASSEMBLY_POINT_QUERY_LIMIT,
  })
    .then(function (data) {
      return pickNearestAssemblyAttrsFromQuery(data, normalizedPoint).then(function (attrs) {
        return coerceAssemblyDetails(attrs)
      })
    })
    .catch(function () {
      return null
    })
}

function escapeSqlLiteral(value) {
  return String(value || '').trim().replace(/'/g, "''")
}

function normalizeDistrictForQuery(districtName) {
  return normalizePlaceValue(districtName).toUpperCase()
}

function districtWhereClause(districtName) {
  var district = normalizeDistrictForQuery(districtName)
  if (!district) return ''
  return `UPPER(n_d_name) = '${escapeSqlLiteral(district)}'`
}

function tehsilWhereClause(districtName, tehsilName) {
  var district = normalizeDistrictForQuery(districtName)
  var tehsil = normalizePlaceValue(tehsilName).toUpperCase()
  if (!district || !tehsil) return ''
  return `UPPER(n_d_name) = '${escapeSqlLiteral(district)}' AND UPPER(ac_name) = '${escapeSqlLiteral(tehsil)}'`
}

function tehsilFuzzyWhereClause(districtName, tehsilName) {
  var district = normalizeDistrictForQuery(districtName)
  var tehsil = normalizePlaceValue(tehsilName).toUpperCase()
  if (!district || !tehsil) return ''
  return (
    `UPPER(n_d_name) = '${escapeSqlLiteral(district)}' AND UPPER(ac_name) LIKE '%${escapeSqlLiteral(tehsil)}%'`
  )
}

/** Direct HTTP query via backend mapserver proxy (reliable in Vite dev). */
function fetchMapserverFeatureQuery(serviceKey, queryParams) {
  var serviceUrl = resolveInvesthryFeatureUrl(serviceKey)
  if (!serviceUrl) return Promise.resolve(null)

  var url = String(serviceUrl).replace(/\/+$/, '') + '/0/query'
  var search = new URLSearchParams()
  search.set('f', 'json')
  Object.keys(queryParams || {}).forEach(function (key) {
    var val = queryParams[key]
    if (val != null && val !== '') search.set(key, String(val))
  })

  return fetch(url + '?' + search.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    })
    .then(function (data) {
      if (data && data.error) {
        console.warn('[assembly metrics query]', serviceKey, data.error)
        return null
      }
      return data
    })
}

function coerceAssemblyDetailsFromQueryData(data, normalized) {
  if (!data) return null
  if (!normalized) {
    return coerceAssemblyDetails(attrsFromQueryResult(data))
  }
  return pickNearestAssemblyAttrsFromQuery(data, normalized).then(function (attrs) {
    return coerceAssemblyDetails(attrs)
  })
}

/** Attribute-only query (no map click geometry) — tehsil/district name is enough. */
function queryInvesthryServiceByWhere(serviceKey, whereClause, normalized) {
  if (!whereClause) return Promise.resolve(null)

  var queryParams = {
    where: whereClause,
    outFields: '*',
    returnGeometry: 'false',
    resultRecordCount: String(ASSEMBLY_POINT_QUERY_LIMIT),
  }

  return fetchMapserverFeatureQuery(serviceKey, queryParams)
    .then(function (data) {
      return coerceAssemblyDetailsFromQueryData(data, normalized)
    })
    .catch(function () {
      var serviceUrl = resolveInvesthryFeatureUrl(serviceKey)
      if (!serviceUrl) return null
      return queryLayer(serviceUrl, 0, {
        where: whereClause,
        outFields: '*',
        returnGeometry: false,
        resultRecordCount: ASSEMBLY_POINT_QUERY_LIMIT,
      })
        .then(function (data) {
          return coerceAssemblyDetailsFromQueryData(data, normalized)
        })
        .catch(function () {
          return null
        })
    })
}

function queryInvesthryServiceWhereNearPoint(serviceKey, whereClause, normalized, inSR) {
  var serviceUrl = resolveInvesthryFeatureUrl(serviceKey)
  if (!serviceUrl || !whereClause || !normalized) return Promise.resolve(null)

  return queryLayer(serviceUrl, 0, {
    where: whereClause,
    geometryType: 'esriGeometryPoint',
    geometry: `${normalized.lon},${normalized.lat}`,
    inSR: inSR || 4326,
    spatialRel: 'esriSpatialRelIntersects',
    distance: ASSEMBLY_POINT_SEARCH_DISTANCE_M,
    units: 'esriSRUnit_Meter',
    outFields: '*',
    returnGeometry: true,
    resultRecordCount: ASSEMBLY_POINT_QUERY_LIMIT,
  })
    .then(function (data) {
      return pickNearestAssemblyAttrsFromQuery(data, normalized).then(function (attrs) {
        return coerceAssemblyDetails(attrs)
      })
    })
    .catch(function () {
      return null
    })
}

function queryInvesthryServiceInDistrictNearPoint(serviceKey, districtName, normalized, inSR) {
  var whereDistrict = districtWhereClause(districtName)
  if (!whereDistrict) return Promise.resolve(null)

  return queryInvesthryServiceByWhere(serviceKey, whereDistrict, normalized).then(function (
    byAttribute,
  ) {
    if (byAttribute && hasAssemblyMetricValues(byAttribute)) return byAttribute
    if (!normalized) return byAttribute
    return queryInvesthryServiceWhereNearPoint(serviceKey, whereDistrict, normalized, inSR)
  })
}

function queryInvesthryServiceForTehsilNearPoint(serviceKey, districtName, tehsilName, normalized, inSR) {
  var whereTehsil = tehsilWhereClause(districtName, tehsilName)
  if (!whereTehsil) return Promise.resolve(null)

  return queryInvesthryServiceByWhere(serviceKey, whereTehsil, normalized).then(function (byAttribute) {
    if (byAttribute && hasAssemblyMetricValues(byAttribute)) return byAttribute
    if (!normalized) return byAttribute
    return queryInvesthryServiceWhereNearPoint(serviceKey, whereTehsil, normalized, inSR)
  })
}

function queryVidhanSabhaCoreAreaInDistrictNearPoint(districtName, normalized, inSR) {
  return queryInvesthryServiceInDistrictNearPoint(
    'VIDHANSABHA_CORE_AREA',
    districtName,
    normalized,
    inSR,
  )
}

function queryDistrictWiseAreaInDistrictNearPoint(districtName, normalized, inSR) {
  return queryInvesthryServiceInDistrictNearPoint(
    'DISTRICT_WISE_AREA',
    districtName,
    normalized,
    inSR,
  )
}

function queryVidhanSabhaCoreAreaForTehsilNearPoint(districtName, tehsilName, normalized, inSR) {
  return queryInvesthryServiceForTehsilNearPoint(
    'VIDHANSABHA_CORE_AREA',
    districtName,
    tehsilName,
    normalized,
    inSR,
  )
}

function queryDistrictWiseAreaForTehsilNearPoint(districtName, tehsilName, normalized, inSR) {
  return queryInvesthryServiceForTehsilNearPoint(
    'DISTRICT_WISE_AREA',
    districtName,
    tehsilName,
    normalized,
    inSR,
  )
}

function queryInvesthrySourceListAtPoint(sources, normalized, inSR) {
  if (!sources.length) return Promise.resolve(null)
  var geometry = `${normalized.lon},${normalized.lat}`

  return Promise.all(
    sources.map(function (src) {
      return queryFeatureServerAtPoint(
        src.url,
        src.layerId,
        'esriGeometryPoint',
        geometry,
        inSR,
        normalized,
      )
    }),
  ).then(function (rows) {
    return mergeAssemblyDetailsList(rows)
  })
}

function queryInvesthryAssemblySourcesAtPoint(normalized, inSR) {
  var metricSources = getAssemblyMetricInvesthrySources()
  var boundarySources = getAssemblyBoundaryInvesthrySources()
  if (!metricSources.length && !boundarySources.length) return Promise.resolve(null)

  return queryInvesthrySourceListAtPoint(metricSources, normalized, inSR).then(function (
    metricDetails,
  ) {
    if (assemblyLookupSatisfied(metricDetails)) return metricDetails
    return queryInvesthrySourceListAtPoint(boundarySources, normalized, inSR).then(function (
      boundaryDetails,
    ) {
      return mergeAssemblyDetails(metricDetails, boundaryDetails)
    })
  })
}

function queryLegacyConstituencyAtPoint(layerId, geometryType, geometry, inSR) {
  if (!CON_MS) return Promise.resolve(null)
  return queryFeatureServerAtPoint(CON_MS, layerId, geometryType, geometry, inSR)
}

function queryAllAssemblySourcesAtPoint(normalized, inSR) {
  var geometry = `${normalized.lon},${normalized.lat}`
  return queryInvesthryAssemblySourcesAtPoint(normalized, inSR).then(function (investhryDetails) {
    return queryLegacyConstituencyAtPoint(
      LAYER_CON_ASSEMBLY,
      'esriGeometryPoint',
      geometry,
      inSR,
    ).then(function (legacyDetails) {
      return mergeAssemblyDetails(investhryDetails, legacyDetails)
    })
  })
}

function queryInvesthryAssemblySourcesByGeometry(geom, geometryType, inSr) {
  var sources = getAssemblyInvesthryQuerySources()
  if (!sources.length) return Promise.resolve(null)

  var query = {
    where: '1=1',
    geometryType: geometryType,
    geometry: JSON.stringify(geom),
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: false,
    resultRecordCount: 1,
  }
  if (inSr) query.inSR = inSr

  return Promise.all(
    sources.map(function (src) {
      if (!src.url) return Promise.resolve(null)
      return queryLayer(src.url, src.layerId, query)
        .then(function (data) {
          return coerceAssemblyDetails(attrsFromQueryResult(data))
        })
        .catch(function () {
          return null
        })
    }),
  ).then(function (rows) {
    return mergeAssemblyDetailsList(rows)
  })
}

function withTehsilContext(details, districtName, tehsilName) {
  return mergeAssemblyDetails(details, {
    district: districtName || (details && details.district) || null,
    nearestTehsil: tehsilName || (details && details.nearestTehsil) || null,
    vidhanSabha:
      (details && details.vidhanSabha) ||
      tehsilName ||
      (details && details.nearestTehsil) ||
      null,
  })
}

/**
 * Single entry for Community panel Vidhan Sabha card — tehsil/district from pinned place, then point query.
 */
export function loadVidhanSabhaPanelForCommunity(point, districtHint, tehsilHint) {
  var normalized = toNormalizedPoint(point)
  if (!normalized) return Promise.resolve(null)

  var districtName = normalizePlaceValue(districtHint) || ''
  var tehsilName = normalizePlaceValue(tehsilHint) || ''

  function finish(details) {
    if (assemblyLookupSatisfied(details) && hasAssemblyMetricValues(details)) {
      return withTehsilContext(details, districtName, tehsilName)
    }
    return applyNearestTehsilAssemblyFallback(normalized, details)
  }

  var tehsilFirst =
    districtName && tehsilName
      ? fillAssemblyMetricsForTehsil(districtName, tehsilName, normalized)
      : Promise.resolve(null)

  return tehsilFirst.then(function (byTehsil) {
    if (byTehsil && hasAssemblyMetricValues(byTehsil)) {
      return withTehsilContext(byTehsil, districtName, tehsilName)
    }

    return queryAssemblyDetailsByPointWgs84(normalized).then(function (details) {
      if (assemblyLookupSatisfied(details) && hasAssemblyMetricValues(details)) {
        return withTehsilContext(details, districtName || details.district, tehsilName)
      }

      var district =
        normalizeDistrictForQuery(details && details.district) ||
        normalizeDistrictForQuery(districtHint) ||
        ''

      if (!district) {
        return finish(details)
      }

      return fillAssemblyMetricsForDistrict(district, normalized).then(function (byDistrict) {
        var merged = mergeAssemblyDetails(details, byDistrict)
        if (hasAssemblyMetricValues(merged)) {
          return withTehsilContext(merged, district, tehsilName)
        }
        if (districtName && tehsilName) {
          return fillAssemblyMetricsForTehsil(districtName, tehsilName, normalized).then(function (
            tehsilRetry,
          ) {
            merged = mergeAssemblyDetails(merged, tehsilRetry)
            if (assemblyLookupSatisfied(merged)) {
              return withTehsilContext(merged, districtName, tehsilName)
            }
            return finish(merged)
          })
        }
        return finish(merged)
      })
    })
  })
}

function queryVidhanSabhaMetricsByWhere(whereClause, normalized) {
  if (!whereClause) return Promise.resolve(null)
  return queryInvesthryServiceByWhere('VIDHANSABHA_CORE_AREA', whereClause, normalized).then(
    function (byCore) {
      if (hasAssemblyMetricValues(byCore)) return byCore
      return queryInvesthryServiceByWhere('DISTRICT_WISE_AREA', whereClause, normalized)
    },
  )
}

/** Load area % metrics for pinned tehsil (assembly name often matches tehsil, e.g. Fatehabad). */
export function fillAssemblyMetricsForTehsil(districtName, tehsilName, point) {
  if (!normalizeDistrictForQuery(districtName) || !normalizePlaceValue(tehsilName)) {
    return Promise.resolve(null)
  }
  var normalized = toNormalizedPoint(point)
  var exactWhere = tehsilWhereClause(districtName, tehsilName)
  var fuzzyWhere = tehsilFuzzyWhereClause(districtName, tehsilName)

  return queryVidhanSabhaMetricsByWhere(exactWhere, normalized).then(function (byExact) {
    if (hasAssemblyMetricValues(byExact)) {
      return mergeAssemblyDetails(byExact, {
        nearestTehsil: tehsilName,
        district: districtName,
        vidhanSabha: (byExact && byExact.vidhanSabha) || tehsilName,
      })
    }
    if (!fuzzyWhere || fuzzyWhere === exactWhere) {
      return queryVidhanSabhaCoreAreaInDistrictNearPoint(districtName, normalized, 4326).then(
        function (byDistrict) {
          return mergeAssemblyDetails(byExact, byDistrict)
        },
      )
    }
    return queryVidhanSabhaMetricsByWhere(fuzzyWhere, normalized).then(function (byFuzzy) {
      if (hasAssemblyMetricValues(byFuzzy)) {
        return mergeAssemblyDetails(byFuzzy, {
          nearestTehsil: tehsilName,
          district: districtName,
          vidhanSabha: (byFuzzy && byFuzzy.vidhanSabha) || tehsilName,
        })
      }
      return queryVidhanSabhaCoreAreaInDistrictNearPoint(districtName, normalized, 4326).then(
        function (byDistrict) {
          return mergeAssemblyDetails(byExact, mergeAssemblyDetails(byFuzzy, byDistrict))
        },
      )
    })
  })
}

/** Load area % metrics when district is known (e.g. from tehsil) but point query returned empty. */
export function fillAssemblyMetricsForDistrict(districtName, point) {
  var normalized = toNormalizedPoint(point)
  if (!normalized || !normalizeDistrictForQuery(districtName)) return Promise.resolve(null)

  return queryVidhanSabhaCoreAreaInDistrictNearPoint(districtName, normalized, 4326).then(function (
    byAssembly,
  ) {
    if (assemblyLookupSatisfied(byAssembly)) return byAssembly
    return queryDistrictWiseAreaInDistrictNearPoint(districtName, normalized, 4326).then(function (
      byDistrict,
    ) {
      return mergeAssemblyDetails(byAssembly, byDistrict)
    })
  })
}

export function queryAssemblyDetailsByPointWgs84(point) {
  var normalized = toNormalizedPoint(point)
  if (!normalized) return Promise.resolve(null)

  function finish(details) {
    if (assemblyLookupSatisfied(details)) return details
    return applyNearestTehsilAssemblyFallback(normalized, details)
  }

  return queryAllAssemblySourcesAtPoint(normalized, 4326).then(function (details4326) {
    if (assemblyLookupSatisfied(details4326)) {
      return details4326
    }

    return import('@arcgis/core/geometry/projection')
      .then(function (projection) {
        return projection.load().then(function () {
          return import('@arcgis/core/geometry/Point.js').then(function (PointMod) {
            var Point = PointMod.default || PointMod
            var wgs = new Point({
              x: normalized.lon,
              y: normalized.lat,
              spatialReference: { wkid: 4326 },
            })
            var projected = projection.project(wgs, { wkid: 32643 })
            if (!projected || projected.x == null || projected.y == null) {
              return finish(details4326)
            }
            var normalized32643 = { lat: projected.y, lon: projected.x }
            return queryAllAssemblySourcesAtPoint(normalized32643, 32643).then(function (
              details32643,
            ) {
              var merged = mergeAssemblyDetails(details4326, details32643)
              if (assemblyLookupSatisfied(merged)) return merged
              return finish(merged)
            })
          })
        })
      })
      .catch(function () {
        return finish(details4326)
      })
  })
}

export function queryAssemblyDetailsByGeometry(geometryJsonLike) {
  var geom = parseGeometryJson(geometryJsonLike)
  if (!geom) return Promise.resolve(null)
  var geometryType = geometryTypeForQuery(geom)
  if (!geometryType) return Promise.resolve(null)

  var inSr = inSrFromGeometry(geom)
  var query = {
    where: '1=1',
    geometryType: geometryType,
    geometry: JSON.stringify(geom),
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: false,
    resultRecordCount: 1,
  }
  if (inSr) query.inSR = inSr

  return queryInvesthryAssemblySourcesByGeometry(geom, geometryType, inSr).then(function (
    investhryDetails,
  ) {
    if (!CON_MS) return investhryDetails
    return queryLayer(CON_MS, LAYER_CON_ASSEMBLY, query)
      .then(function (data) {
        return mergeAssemblyDetails(investhryDetails, coerceAssemblyDetails(attrsFromQueryResult(data)))
      })
      .catch(function () {
        return investhryDetails
      })
  })
}

function hasAssemblyMetricValues(details) {
  if (!details) return false
  return (
    details.proposedPolicy != null ||
    details.developmentPlan != null ||
    details.proposedAreaPct != null ||
    details.controlledArea != null ||
    details.intermediateAreaPct != null ||
    details.coreAreaPct != null ||
    details.subPrimeAreaPct != null ||
    details.mcPct != null ||
    details.existingIndustry != null
  )
}

function assemblyLookupSatisfied(details) {
  if (!details) return false
  if (hasAssemblyMetricValues(details)) return true
  return !!details.vidhanSabha
}

function applyNearestTehsilAssemblyFallback(normalized, currentDetails) {
  return queryNearestTehsilAtPointWgs84(normalized).then(function (tehsilHit) {
    if (!tehsilHit) return currentDetails

    var merged = mergeAssemblyDetails(currentDetails, coerceAssemblyDetails(tehsilHit.attributes))
    if (tehsilHit.placeDetails && tehsilHit.placeDetails.district) {
      merged = mergeAssemblyDetails(merged, { district: tehsilHit.placeDetails.district })
    }
    if (tehsilHit.tehsil) {
      merged = mergeAssemblyDetails(merged, {
        nearestTehsil: tehsilHit.tehsil,
        usedTehsilFallback: true,
      })
    } else {
      merged = mergeAssemblyDetails(merged, { usedTehsilFallback: true })
    }

    var geometryPromise = tehsilHit.geometryJson
      ? queryAssemblyDetailsByGeometry(tehsilHit.geometryJson)
      : Promise.resolve(null)

    var districtName =
      (tehsilHit.placeDetails && tehsilHit.placeDetails.district) ||
      (merged && merged.district) ||
      pickPlaceField(tehsilHit.attributes, ['n_d_name', 'district', 'DISTRICT'])

    return geometryPromise.then(function (byTehsilGeometry) {
      merged = mergeAssemblyDetails(merged, byTehsilGeometry)
      if (assemblyLookupSatisfied(merged)) return merged

      return queryVidhanSabhaCoreAreaInDistrictNearPoint(districtName, normalized, 4326).then(
        function (byAssemblyInDistrict) {
          merged = mergeAssemblyDetails(merged, byAssemblyInDistrict)
          if (assemblyLookupSatisfied(merged)) return merged

          return queryDistrictWiseAreaInDistrictNearPoint(districtName, normalized, 4326).then(
            function (byDistrictWise) {
              merged = mergeAssemblyDetails(merged, byDistrictWise)
              if (assemblyLookupSatisfied(merged)) return merged

              if (!tehsilHit.centroid) return merged
              return continueCentroidAssemblyLookup(merged, tehsilHit)
            },
          )
        },
      )
    })
  })
}

function continueCentroidAssemblyLookup(merged, tehsilHit) {

  return queryAllAssemblySourcesAtPoint(tehsilHit.centroid, 4326).then(function (atCentroid4326) {
    merged = mergeAssemblyDetails(merged, atCentroid4326)
    if (assemblyLookupSatisfied(merged)) return merged

    return import('@arcgis/core/geometry/projection')
      .then(function (projectionMod) {
        return projectionMod.load().then(function () {
          return import('@arcgis/core/geometry/Point.js').then(function (PointMod) {
            var PointCtor = PointMod.default || PointMod
            var wgs = new PointCtor({
              x: tehsilHit.centroid.lon,
              y: tehsilHit.centroid.lat,
              spatialReference: { wkid: 4326 },
            })
            var projected = projectionMod.project(wgs, { wkid: 32643 })
            if (!projected || projected.x == null || projected.y == null) return merged
            var normalized32643 = { lat: projected.y, lon: projected.x }
            return queryAllAssemblySourcesAtPoint(normalized32643, 32643).then(function (
              atCentroid32643,
            ) {
              return mergeAssemblyDetails(merged, atCentroid32643)
            })
          })
        })
      })
      .catch(function () {
        return merged
      })
  })
}

export function extractAssemblyGeometryCandidates(summary, report) {
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
    ].forEach(function (value) {
      if (value != null) out.push(value)
    })
  })
  return out
}

function findMatchingOption(selectEl, valueText) {
  if (!selectEl || !valueText) return null
  var needle = String(valueText).trim().toLowerCase()
  if (!needle) return null
  var options = Array.from(selectEl.options || [])

  for (var i = 0; i < options.length; i += 1) {
    var opt = options[i]
    var value = String(opt.value || '').trim().toLowerCase()
    var text = String(opt.textContent || '').trim().toLowerCase()
    if (value === needle || text === needle) return opt
  }
  for (var j = 0; j < options.length; j += 1) {
    var opt2 = options[j]
    var text2 = String(opt2.textContent || '').trim().toLowerCase()
    if (text2.includes(needle)) return opt2
  }
  return null
}

export function autoSelectVidhanSabhaInUi(details) {
  if (typeof document === 'undefined' || !details) return
  var districtSelect = document.getElementById('parliamentaryDistrictSelect')
  var assemblySelect = document.getElementById('parliamentaryAssemblySelect')
  if (!assemblySelect) return

  var districtName = normalizePlaceValue(details.district)
  if (districtSelect && districtName) {
    var districtOpt = findMatchingOption(districtSelect, districtName)
    if (districtOpt && districtSelect.value !== districtOpt.value) {
      districtSelect.value = districtOpt.value
      districtSelect.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  var targetByCode = normalizePlaceValue(details.vidhanSabhaCode)
  var targetByName = normalizePlaceValue(details.vidhanSabha)
  var maxAttempts = 6
  var tryCount = 0

  function tryApplyAssemblySelection() {
    tryCount += 1

    var targetOption = null
    if (targetByCode) targetOption = findMatchingOption(assemblySelect, targetByCode)
    if (!targetOption && targetByName) targetOption = findMatchingOption(assemblySelect, targetByName)

    if (targetOption) {
      if (assemblySelect.value !== targetOption.value) {
        assemblySelect.value = targetOption.value
        assemblySelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      return
    }

    if (tryCount < maxAttempts) {
      setTimeout(tryApplyAssemblySelection, 220)
    }
  }

  tryApplyAssemblySelection()
}
