/** Map services: public hsacggm (/arcgis proxy in local dev). Same for all users. */
import { resolveMapServiceUrl } from "./resolveMapServiceUrl.js"

export const BASE_MS = resolveMapServiceUrl("MSME_BASE_REFERENCE")
export const ADMIN_MS = resolveMapServiceUrl("MSME_ADMIN_BOUNDARIES")
export const ENV_MS = resolveMapServiceUrl("MSME_ENVIRONMENT")
export const INV_MS = resolveMapServiceUrl("MSME_INVESTMENT")
export const SOC_MS = resolveMapServiceUrl("MSME_SOCIAL")
export const TRANS_MS = resolveMapServiceUrl("MSME_TRANSPORT")
export const UTIL_MS = resolveMapServiceUrl("MSME_UTILITIES")
export const CAD_MS = resolveMapServiceUrl("MSME_CADASTRAL")
export const CON_MS = resolveMapServiceUrl("MSME_CONSTITUENCY")

export const IDENTIFY_URLS = [BASE_MS, ADMIN_MS, ENV_MS, INV_MS, SOC_MS, TRANS_MS, UTIL_MS, CAD_MS, CON_MS]

export const LAYER_DISTRICT = 1
export const LAYER_TEHSIL = 3
export const LAYER_VILLAGE = 4
export const LAYER_ROADS_LINE = 4
export const LAYER_FOREST = 0
export const LAYER_INVESTMENT = 0
export const LAYER_WATER = 3
export const LAYER_CON_ASSEMBLY = 0
export const LAYER_CON_PARLIAMENT = 1

/**
 * Fallback map centres [lon, lat] WGS84 by n_d_code — used when /query omits geometry.
 */
export const HR_DISTRICT_LONLAT = {
  '01': [76.78, 30.38],
  '02': [76.14, 28.79],
  '22': [76.27, 28.5],
  '03': [77.32, 28.41],
  '04': [75.45, 29.32],
  '05': [77.03, 28.46],
  '23': [75.96, 29.1],
  '06': [75.73, 29.15],
  '07': [76.65, 28.62],
  '08': [76.31, 29.32],
  '09': [76.38, 29.8],
  '10': [77.09, 29.69],
  '11': [76.84, 29.99],
  '12': [76.15, 28.28],
  '20': [77.12, 27.98],
  '21': [77.33, 28.14],
  '13': [76.86, 30.8],
  '14': [76.98, 29.39],
  '15': [76.62, 28.19],
  '16': [76.61, 28.9],
  '17': [75.03, 29.54],
  '18': [77.02, 29.0],
  '19': [77.29, 30.18],
}

export function normalizeDistrictCodeKey(d) {
  var k = String(d == null ? '' : d).trim()
  if (!k) return ''
  if (k.length === 1) return '0' + k
  return k
}

/** Map service URL → report theme (land & location sections). */
export function themeKeyFromUrl(u) {
  if (!u || typeof u !== 'string') return 'other'
  if (u.indexOf('Administrative_Boundaries') >= 0) return 'admin'
  if (u.indexOf('Base_Reference_Layers') >= 0) return 'base'
  if (u.indexOf('Environmental_Constraints') >= 0) return 'env'
  if (u.indexOf('Investment_Zones') >= 0) return 'inv'
  if (u.indexOf('Social_Infrastructure') >= 0) return 'social'
  if (u.indexOf('Transportation_Infrastructure') >= 0) return 'trans'
  if (u.indexOf('Utilities') >= 0) return 'util'
  if (u.indexOf('Haryana_Cadastral') >= 0) return 'cad'
  if (u.indexOf('Constituency_Boundaries') >= 0) return 'con'
  return 'other'
}

export function approxModeFromAdminLayerId(layerId) {
  if (layerId === LAYER_TEHSIL) return 'tehsil'
  if (layerId === LAYER_VILLAGE) return 'village'
  return 'district'
}

/** POI layers for proximity (MapServer layer ids). */
export const POI_LAYERS = [
  { id: 'p_t0', url: TRANS_MS, layerId: 0, label: 'Airports' },
  { id: 'p_t1', url: TRANS_MS, layerId: 1, label: 'Bus stops' },
  { id: 'p_t4', url: TRANS_MS, layerId: 4, label: 'Roads (line)' },
  { id: 'p_inv', url: INV_MS, layerId: 0, label: 'Industrial sites' },
  { id: 'p_soc', url: SOC_MS, layerId: 0, label: 'Social infrastructure' },
  { id: 'p_u0', url: UTIL_MS, layerId: 0, label: 'Mobile towers' },
  { id: 'p_u3', url: UTIL_MS, layerId: 3, label: 'Water network' },
]

/** Intersect constraint polygon layers. */
export const INT_LAYERS = [
  { id: 'i_for', url: ENV_MS, layerId: 0, label: 'Forest area' },
  { id: 'i_wl', url: ENV_MS, layerId: 2, label: 'Potential waterbodies' },
]

/** Utilities for multi-layer query (lines). */
export const UTIL_LINES = [
  { id: 'u_w', url: UTIL_MS, layerId: 3, label: 'Water network' },
  { id: 'u_g1', url: UTIL_MS, layerId: 1, label: 'BPCL line' },
  { id: 'u_g2', url: UTIL_MS, layerId: 2, label: 'IOC gas line' },
  { id: 'u_s6', url: UTIL_MS, layerId: 6, label: 'Sewerage line' },
]
