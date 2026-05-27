import { resolveInvesthryFeatureUrl } from './resolveMapServiceUrl.js'

/**
 * Investhry FeatureServer keys from MSME_Backend/.env (lines 28–37).
 * URLs are loaded at runtime from backend /api-url/frontend-config → mapserver proxy.
 */
export const INVESTHRY_ASSEMBLY_ENV_KEYS = [
  'VIDHANSABHA_CORE_AREA_VIEW',
  'VIDHANSABHA_CORE_AREA',
  'DISTRICT_WISE_AREA',
  'ASSEMBLY_DEMOGRAPHY',
  'NO_MSME_AREA',
  'ASSEMBLY_BND_WITH_BLOCK_HEAP',
  'BLOCK_BOUNDARY',
  'ASSEMBLY_BOUNDARY',
  'HARYANA_ASSEMBLY_BND',
  'VIDHANSABHA_MAP',
]

function source(serviceKey, layerId) {
  return {
    key: serviceKey,
    url: resolveInvesthryFeatureUrl(serviceKey),
    layerId: layerId == null ? 0 : layerId,
  }
}

/** Layers that carry area % metrics (core_per, im_per, sp_per, mcper, controlled, areacont). */
export function getAssemblyMetricInvesthrySources() {
  return [
    source('VIDHANSABHA_CORE_AREA'),
    source('VIDHANSABHA_CORE_AREA_VIEW'),
    source('DISTRICT_WISE_AREA'),
  ].filter(function (row) {
    return !!row.url
  })
}

/** Boundary / name layers (Vidhan Sabha name, AC code). */
export function getAssemblyBoundaryInvesthrySources() {
  return [
    source('ASSEMBLY_DEMOGRAPHY'),
    source('HARYANA_ASSEMBLY_BND'),
    source('ASSEMBLY_BOUNDARY'),
    source('ASSEMBLY_BND_WITH_BLOCK_HEAP'),
    source('VIDHANSABHA_MAP'),
    source('BLOCK_BOUNDARY'),
    source('NO_MSME_AREA'),
  ].filter(function (row) {
    return !!row.url
  })
}

/** Full list for point-in-polygon (metrics first, then boundaries). */
export function getAssemblyInvesthryQuerySources() {
  return getAssemblyMetricInvesthrySources().concat(getAssemblyBoundaryInvesthrySources())
}