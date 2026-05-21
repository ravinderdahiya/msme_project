import { queryLayer } from './queryClient.js'
import { CON_MS, LAYER_CON_ASSEMBLY } from './serviceUrlsAndLayers.js'
import { getAssemblyInvesthryQuerySources } from './assemblyInvesthrySources.js'
import { normalizePlaceValue, pickPlaceField } from './placeDetailsHelpers.js'

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
  var intermediateAreaPct = normalizePercent(
    pickPlaceField(source, [
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
      'core_per',
    ]),
  )
  var subPrimeAreaPct = normalizePercent(
    pickPlaceField(source, [
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
      'mc_pct',
      'mc_percentage',
      'municipal_pct',
      'municipal_corporation_pct',
      'MC_PCT',
      'MC_PERCENTAGE',
      'MC_PER',
      'mc_per',
    ]),
  )
  var existingIndustry = normalizeCount(
    pickPlaceField(source, [
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

  if (
    !vidhanSabha &&
    !district &&
    !proposedPolicy &&
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
    intermediateAreaPct: intermediateAreaPct == null ? null : intermediateAreaPct,
    coreAreaPct: coreAreaPct == null ? null : coreAreaPct,
    subPrimeAreaPct: subPrimeAreaPct == null ? null : subPrimeAreaPct,
    mcPct: mcPct == null ? null : mcPct,
    existingIndustry: existingIndustry == null ? null : existingIndustry,
  }
}

export function mergeAssemblyDetails(base, extra) {
  var left = coerceAssemblyDetails(base) || {}
  var right = coerceAssemblyDetails(extra) || {}
  var merged = Object.assign({}, left)

  ;[
    'vidhanSabha',
    'vidhanSabhaCode',
    'district',
    'proposedPolicy',
    'intermediateAreaPct',
    'coreAreaPct',
    'subPrimeAreaPct',
    'mcPct',
    'existingIndustry',
  ].forEach(function (key) {
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

function queryFeatureServerAtPoint(serviceUrl, layerId, geometryType, geometry, inSR) {
  if (!serviceUrl) return Promise.resolve(null)
  return queryLayer(serviceUrl, layerId, {
    where: '1=1',
    geometryType: geometryType,
    geometry: geometry,
    inSR: inSR,
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: false,
    resultRecordCount: 1,
  })
    .then(function (data) {
      return coerceAssemblyDetails(attrsFromQueryResult(data))
    })
    .catch(function () {
      return null
    })
}

function queryInvesthryAssemblySourcesAtPoint(normalized, inSR) {
  var sources = getAssemblyInvesthryQuerySources()
  if (!sources.length) return Promise.resolve(null)

  var geometry = `${normalized.lon},${normalized.lat}`

  return Promise.all(
    sources.map(function (src) {
      return queryFeatureServerAtPoint(src.url, src.layerId, 'esriGeometryPoint', geometry, inSR)
    }),
  ).then(function (rows) {
    return mergeAssemblyDetailsList(rows)
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

export function queryAssemblyDetailsByPointWgs84(point) {
  var normalized = toNormalizedPoint(point)
  if (!normalized) return Promise.resolve(null)

  return queryAllAssemblySourcesAtPoint(normalized, 4326).then(function (details4326) {
    if (details4326 && details4326.vidhanSabha && hasAssemblyMetricValues(details4326)) {
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
            if (!projected || projected.x == null || projected.y == null) return details4326
            var normalized32643 = { lat: projected.y, lon: projected.x }
            return queryAllAssemblySourcesAtPoint(normalized32643, 32643).then(function (
              details32643,
            ) {
              return mergeAssemblyDetails(details4326, details32643)
            })
          })
        })
      })
      .catch(function () {
        return details4326
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
    details.intermediateAreaPct != null ||
    details.coreAreaPct != null ||
    details.subPrimeAreaPct != null ||
    details.mcPct != null ||
    details.existingIndustry != null
  )
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
