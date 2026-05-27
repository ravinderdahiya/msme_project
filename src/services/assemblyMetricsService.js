import http from '../api/axios.js'

const ASSEMBLY_METRIC_SERVICES = [
  'VIDHANSABHA_CORE_AREA',
  'VIDHANSABHA_CORE_AREA_VIEW',
  'DISTRICT_WISE_AREA',
]

function sqlUpper(value) {
  return String(value || '')
    .trim()
    .replace(/'/g, "''")
    .toUpperCase()
}

async function queryAssemblyMetricService(serviceKey, whereClause) {
  const res = await http.get(`/mapserver/service/${serviceKey}/0/query`, {
    params: {
      f: 'json',
      where: whereClause,
      outFields: '*',
      returnGeometry: false,
      resultRecordCount: 10,
    },
    timeout: 60000,
  })
  const features = res?.data?.features
  return Array.isArray(features) ? features : []
}

function toPercentNumber(value) {
  const normalized =
    typeof value === 'string' ? value.replace(/,/g, '').replace('%', '').trim() : value
  const num = Number(normalized)
  return Number.isFinite(num) ? num : null
}

function toTextOrNull(value) {
  if (value == null) return null
  const text = String(value).trim()
  if (!text) return null
  const normalized = text.toLowerCase()
  if (normalized === '-' || normalized === 'na' || normalized === 'n/a' || normalized === 'null') {
    return null
  }
  return text
}

function readAttr(attrs, key) {
  if (!attrs || typeof attrs !== 'object' || !key) return null
  if (Object.prototype.hasOwnProperty.call(attrs, key)) return attrs[key]
  const normalize = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const target = normalize(key)
  const foundKey = Object.keys(attrs).find((k) => normalize(k) === target)
  return foundKey ? attrs[foundKey] : null
}

function pickNumberFromAttrs(attrs, keys) {
  for (const key of keys) {
    const parsed = toPercentNumber(readAttr(attrs, key))
    if (parsed != null) return parsed
  }
  return null
}

function pickTextFromAttrs(attrs, keys) {
  for (const key of keys) {
    const text = toTextOrNull(readAttr(attrs, key))
    if (text) return text
  }
  return null
}

function pickDevelopmentPlan(attrs) {
  if (!attrs || typeof attrs !== 'object') return null
  return pickTextFromAttrs(attrs, [
    'developmentPlan',
    'development_plan',
    'developmentplan',
    'development plan',
    'devlopment_plan',
    'devlopment plan',
    'proposed_new_policy',
    'proposed new policy',
    'new_policy',
    'new policy',
    'policy_year',
    'policy year',
    'policy',
    'proposed_policy',
    'proposed policy',
    'area_type',
    'area_tyep',
  ])
}

/** Map investhry VIDHANSABHA_CORE_AREA attributes → community panel card keys. */
export function mapAttributesToAssemblyMetrics(attrs, districtName, tehsilName) {
  if (!attrs || typeof attrs !== 'object') return null

  const proposedAreaPct = pickNumberFromAttrs(attrs, [
    'controlled',
    'proposed_area_pct',
    'proposed_area_perc',
    'proposed_area',
  ])
  const coreAreaPct = pickNumberFromAttrs(attrs, [
    'core_per',
    'per_core',
    'core_area_pct',
    'core_area_perc',
    'core area',
    'core area pct',
    'core area percentage',
    'core_pct',
    'core_area',
    'ca_pct',
    'corearea',
    'core',
  ])
  const intermediateAreaPct = pickNumberFromAttrs(attrs, [
    'im_per',
    'per_im',
    'intermediate_area_pct',
    'intermediate_area_perc',
    'intermediate area',
    'intermediate area pct',
    'intermediate area percentage',
    'intermidate area',
    'intermidate area pct',
    'intermidate_area_pct',
    'intermediate_pct',
    'intermediate',
    'int_area_pct',
    'ia_pct',
    'intermediatearea',
    'intermediate_area',
    'intermidate_area',
  ])
  const subPrimeAreaPct = pickNumberFromAttrs(attrs, [
    'sp_per',
    'per_sp',
    'sub_prime_area_pct',
    'subprime_area_pct',
    'sub prime area',
    'sub prime area pct',
    'sub prime area percentage',
    'sub_prime_pct',
    'subprime_pct',
    'sub_prime',
    'subprime',
    'spa_pct',
    'subprime_area',
    'sub_prime_area',
    'subprime area',
  ])
  const mcPct = pickNumberFromAttrs(attrs, [
    'mcper',
    'mc_per',
    'mc_pct',
    'mc %',
    'mc percentage',
    'mc_percentage',
    'municipal_pct',
    'municipal_corporation_pct',
  ])
  const existingIndustry = pickNumberFromAttrs(attrs, [
    'areacont',
    'area_cont',
    'existing_industry',
    'existing_industries',
    'existing_industry_count',
    'industry_count',
    'no_of_industry',
    'total_industry',
    'existing industry',
    'existing industry %',
    'existing industry pct',
  ])
  const developmentPlan = pickDevelopmentPlan(attrs)
  const districtLabel = districtName || pickTextFromAttrs(attrs, ['n_d_name', 'district']) || null
  const vidhanSabhaLabel = attrs.ac_name || readAttr(attrs, 'ac_name') || tehsilName || null

  if (
    !developmentPlan &&
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
    controlledArea: proposedAreaPct,
    coreAreaPct,
    intermediateAreaPct,
    subPrimeAreaPct,
    mcPct,
    existingIndustry,
    proposedPolicy: developmentPlan,
    developmentPlan: developmentPlan,
    district: districtLabel,
    nearestTehsil: tehsilName || null,
    vidhanSabha: vidhanSabhaLabel,
  }
}

function mergeMissingAssemblyFields(base, extra) {
  if (!base) return extra || null
  if (!extra) return base
  const merged = { ...base }
  const mergeKeys = [
    'proposedAreaPct',
    'controlledArea',
    'coreAreaPct',
    'intermediateAreaPct',
    'subPrimeAreaPct',
    'mcPct',
    'existingIndustry',
    'developmentPlan',
    'proposedPolicy',
    'district',
    'nearestTehsil',
    'vidhanSabha',
  ]
  for (const key of mergeKeys) {
    if (merged[key] == null && extra[key] != null) merged[key] = extra[key]
  }
  return {
    ...merged,
    developmentPlan: merged.developmentPlan || merged.proposedPolicy || null,
    proposedPolicy: merged.proposedPolicy || merged.developmentPlan || null,
  }
}

function normalizeLabel(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
}

function assemblyMetricScore(row, tehsilName) {
  if (!row) return -1
  let score = 0
  if (row.proposedAreaPct != null || row.controlledArea != null) score += 1
  if (row.coreAreaPct != null) score += 1
  if (row.intermediateAreaPct != null) score += 1
  if (row.subPrimeAreaPct != null) score += 1
  if (row.mcPct != null) score += 1
  if (row.existingIndustry != null) score += 1
  if (row.developmentPlan || row.proposedPolicy) score += 1

  // Strongly prefer the row that matches current tehsil / assembly label.
  if (normalizeLabel(row.vidhanSabha) === normalizeLabel(tehsilName)) score += 100
  return score
}

async function queryByWhereAcrossServices(whereClause) {
  if (!whereClause) return []
  const results = await Promise.all(
    ASSEMBLY_METRIC_SERVICES.map((serviceKey) =>
      queryAssemblyMetricService(serviceKey, whereClause).catch(() => []),
    ),
  )
  return results.flat()
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
    const exactWhere = `UPPER(n_d_name)='${district}' AND UPPER(ac_name)='${tehsil}'`
    const fuzzyWhere = `UPPER(n_d_name)='${district}' AND UPPER(ac_name) LIKE '%${tehsil}%'`
    const districtWhere = `UPPER(n_d_name)='${district}'`

    let features = await queryByWhereAcrossServices(exactWhere)

    if (!features.length) features = await queryByWhereAcrossServices(fuzzyWhere)
    if (!features.length) features = await queryByWhereAcrossServices(districtWhere)

    const rows = []
    for (const feature of features) {
      const attrs = feature?.attributes
      const row = mapAttributesToAssemblyMetrics(attrs, districtName, tehsilName)
      if (row) rows.push(row)
    }
    if (!rows.length) return null

    rows.sort((a, b) => assemblyMetricScore(b, tehsilName) - assemblyMetricScore(a, tehsilName))

    let merged = rows[0]
    for (let i = 1; i < rows.length; i += 1) {
      merged = mergeMissingAssemblyFields(merged, rows[i])
    }
    return merged
  } catch (error) {
    console.error('[fetchTehsilAssemblyMetrics]', districtName, tehsilName, error)
    return null
  }
}
