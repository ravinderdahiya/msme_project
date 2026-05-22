/** Runtime ArcGIS MapServer roots (loaded from backend database config). */
export const MSME_MAP_SERVICE_KEYS = [
  "MSME_BASE_REFERENCE",
  "MSME_ADMIN_BOUNDARIES",
  "MSME_ENVIRONMENT",
  "MSME_INVESTMENT",
  "MSME_SOCIAL",
  "MSME_TRANSPORT",
  "MSME_UTILITIES",
  "MSME_CADASTRAL",
  "MSME_CONSTITUENCY",
]

export const HSACGGM_MAP_SERVICE_URLS = {}

const normalizeUrl = (value) => String(value || "").trim().replace(/\/+$/, "")

export function setHsacggmMapServiceUrls(mapServices) {
  const source = mapServices && typeof mapServices === "object" ? mapServices : {}
  Object.keys(HSACGGM_MAP_SERVICE_URLS).forEach((key) => {
    delete HSACGGM_MAP_SERVICE_URLS[key]
  })

  MSME_MAP_SERVICE_KEYS.forEach((key) => {
    const url = normalizeUrl(source[key])
    if (url) {
      HSACGGM_MAP_SERVICE_URLS[key] = url
    }
  })

  return { ...HSACGGM_MAP_SERVICE_URLS }
}
