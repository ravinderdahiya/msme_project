/** Runtime Invest Haryana FeatureServer roots (loaded from backend database config). */
export const INVESTHRY_FEATURE_SERVICE_KEYS = [
  "VIDHANSABHA_CORE_AREA_VIEW",
  "VIDHANSABHA_CORE_AREA",
  "DISTRICT_WISE_AREA",
  "ASSEMBLY_DEMOGRAPHY",
  "NO_MSME_AREA",
  "ASSEMBLY_BND_WITH_BLOCK_HEAP",
  "BLOCK_BOUNDARY",
  "ASSEMBLY_BOUNDARY",
  "HARYANA_ASSEMBLY_BND",
  "VIDHANSABHA_MAP",
]

export const INVESTHRY_FEATURE_SERVICE_URLS = {}

const normalizeUrl = (value) => String(value || "").trim().replace(/\/+$/, "")

export function setInvesthryFeatureServiceUrls(mapServices) {
  const source = mapServices && typeof mapServices === "object" ? mapServices : {}
  Object.keys(INVESTHRY_FEATURE_SERVICE_URLS).forEach((key) => {
    delete INVESTHRY_FEATURE_SERVICE_URLS[key]
  })

  INVESTHRY_FEATURE_SERVICE_KEYS.forEach((key) => {
    const url = normalizeUrl(source[key])
    if (url) {
      INVESTHRY_FEATURE_SERVICE_URLS[key] = url
    }
  })

  return { ...INVESTHRY_FEATURE_SERVICE_URLS }
}
