import { HSACGGM_MAP_SERVICE_URLS } from "./arcgisMapServiceUrls.js"

const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "")

/** Local Vite proxy → hsacggm (no JWT, avoids browser CORS on localhost). */
export function toDevArcGisProxyUrl(hsacggmUrl) {
  return String(hsacggmUrl || "").replace(/^https?:\/\/hsacggm\.in/i, "/arcgis")
}

/**
 * Map layers & queries: always public hsacggm (same for guest and logged-in).
 * Local dev uses `/arcgis` Vite proxy so layers work without login or JWT.
 */
export function resolveMapServiceUrl(serviceKey) {
  const key = String(serviceKey || "").trim()
  const direct = HSACGGM_MAP_SERVICE_URLS[key]
  if (!direct) return ""

  const isDev = Boolean(import.meta.env.DEV)
  const envBase = normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SERVER_URL,
  )
  const isLocal =
    !envBase || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(envBase)

  if (isDev && isLocal) {
    return toDevArcGisProxyUrl(direct)
  }

  return direct
}
