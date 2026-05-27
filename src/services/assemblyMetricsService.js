import http from '../api/axios.js'

function sqlUpper(value) {
  return String(value || '')
    .trim()
    .replace(/'/g, "''")
    .toUpperCase()
}

async function queryVidhanSabhaCoreArea(whereClause) {
  const res = await http.get('/mapserver/service/VIDHANSABHA_CORE_AREA/0/query', {
    params: {
      f: 'json',
      where: whereClause,
      outFields:
        'controlled,core_per,im_per,sp_per,mcper,areacont,ac_name,n_d_name,area_tyep',
      returnGeometry: false,
      resultRecordCount: 10,
    },
    timeout: 60000,
  })
  const features = res?.data?.features
  return Array.isArray(features) ? features : []
}

function toPercentNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

/** Map investhry VIDHANSABHA_CORE_AREA attributes → community panel card keys. */
export function mapAttributesToAssemblyMetrics(attrs, districtName, tehsilName) {
  if (!attrs || typeof attrs !== 'object') return null

  const proposedAreaPct = toPercentNumber(attrs.controlled)
  const coreAreaPct = toPercentNumber(attrs.core_per)
  const intermediateAreaPct = toPercentNumber(attrs.im_per)
  const subPrimeAreaPct = toPercentNumber(attrs.sp_per)
  const mcPct = toPercentNumber(attrs.mcper)
  const existingIndustry = toPercentNumber(attrs.areacont)

  if (
    proposedAreaPct == null &&
    coreAreaPct == null &&
    intermediateAreaPct == null &&
    subPrimeAreaPct == null &&
    mcPct == null &&
    existingIndustry == null
  ) {
    return null
  }

  return {
    proposedAreaPct,
    coreAreaPct,
    intermediateAreaPct,
    subPrimeAreaPct,
    mcPct,
    existingIndustry,
    proposedPolicy: attrs.area_tyep || attrs.area_type || null,
    district: districtName || attrs.n_d_name || null,
    nearestTehsil: tehsilName || null,
    vidhanSabha: attrs.ac_name || tehsilName || null,
  }
}

/**
 * Load Vidhan Sabha % metrics for pinned tehsil + district (Community panel).
 * Uses the same axios + Vite proxy path as other app APIs.
 */
export async function fetchTehsilAssemblyMetrics(districtName, tehsilName) {
  const district = sqlUpper(districtName)
  const tehsil = sqlUpper(tehsilName)
  if (!district || !tehsil) return null

  try {
    let features = await queryVidhanSabhaCoreArea(
      `UPPER(n_d_name)='${district}' AND UPPER(ac_name)='${tehsil}'`,
    )

    if (!features.length) {
      features = await queryVidhanSabhaCoreArea(
        `UPPER(n_d_name)='${district}' AND UPPER(ac_name) LIKE '%${tehsil}%'`,
      )
    }

    if (!features.length) {
      features = await queryVidhanSabhaCoreArea(`UPPER(n_d_name)='${district}'`)
    }

    const attrs = features[0]?.attributes
    return mapAttributesToAssemblyMetrics(attrs, districtName, tehsilName)
  } catch (error) {
    console.error('[fetchTehsilAssemblyMetrics]', districtName, tehsilName, error)
    return null
  }
}
