import { HSACGGM_MAP_SERVICE_URLS } from "./arcgisMapServiceUrls.js"
import { INVESTHRY_FEATURE_SERVICE_URLS } from "./investhryFeatureServiceUrls.js"

const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "")

/** Local Vite proxy → hsacggm (no JWT, avoids browser CORS on localhost). */
export function toDevArcGisProxyUrl(hsacggmUrl) {
  return String(hsacggmUrl || "").replace(/^https?:\/\/hsacggm\.in/i, "/arcgis")
}

/** Local Vite proxy → investhry.harsac.in FeatureServer queries. */
export function toDevInvesthryProxyUrl(investhryUrl) {
  return String(investhryUrl || "").replace(/^https?:\/\/investhry\.harsac\.in/i, "/investhry")
}

function useLocalGisProxy() {
  const isDev = Boolean(import.meta.env.DEV)
  const envBase = normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SERVER_URL,
  )
  const isLocal =
    !envBase || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(envBase)
  return isDev && isLocal
}

/**
 * Map layers & queries: always public hsacggm (same for guest and logged-in).
 * Local dev uses `/arcgis` Vite proxy so layers work without login or JWT.
 */
export function resolveMapServiceUrl(serviceKey) {
  const key = String(serviceKey || "").trim()
  const direct = HSACGGM_MAP_SERVICE_URLS[key]
  if (!direct) return ""

  if (useLocalGisProxy()) {
    return toDevArcGisProxyUrl(direct)
  }

  return direct
}

/**
 * Invest Haryana Vidhan Sabha / policy FeatureServer URLs.
 * Local dev uses `/investhry` Vite proxy.
 */
export function resolveInvesthryFeatureUrl(serviceKey) {
  const key = String(serviceKey || "").trim()
  const direct = INVESTHRY_FEATURE_SERVICE_URLS[key]
  if (!direct) return ""

  if (useLocalGisProxy()) {
    return toDevInvesthryProxyUrl(direct)
  }

  return direct
}
