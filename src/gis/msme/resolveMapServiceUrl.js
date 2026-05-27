import { HSACGGM_MAP_SERVICE_URLS, MSME_MAP_SERVICE_KEYS } from "./arcgisMapServiceUrls.js"
import {
  INVESTHRY_FEATURE_SERVICE_KEYS,
  INVESTHRY_FEATURE_SERVICE_URLS,
} from "./investhryFeatureServiceUrls.js"

const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "")
const DEFAULT_API_BASE_PATH = "/msme_backend/api"

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
  if (!isDev) return false
  const envBase = normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SERVER_URL,
  )
  if (!envBase || envBase.startsWith('/')) return true
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(envBase)
}

function resolveApiBasePath() {
  const envBase = normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SERVER_URL || DEFAULT_API_BASE_PATH,
  )

  if (!envBase) return DEFAULT_API_BASE_PATH

  if (/^https?:\/\//i.test(envBase)) {
    try {
      const parsed = new URL(envBase)
      const pathname = normalizeBaseUrl(parsed.pathname || DEFAULT_API_BASE_PATH) || DEFAULT_API_BASE_PATH
      return `${parsed.origin}${pathname}`
    } catch {
      return DEFAULT_API_BASE_PATH
    }
  }

  return envBase.startsWith("/") ? envBase : `/${envBase}`
}

function buildMapServiceProxyUrl(serviceKey) {
  const key = encodeURIComponent(String(serviceKey || "").trim())
  if (!key) return ""
  const apiBase = resolveApiBasePath()
  return `${apiBase}/mapserver/service/${key}`
}

function shouldUseBackendMapProxy(directUrl) {
  const forceProxy = String(import.meta.env.VITE_USE_MAPSERVER_PROXY || "").trim().toLowerCase() === "true"
  if (forceProxy) return true
  return /^https?:\/\/investhry\.harsac\.in/i.test(String(directUrl || "").trim())
}

/**
 * Map layers & queries: always public hsacggm (same for guest and logged-in).
 * Local dev uses `/arcgis` Vite proxy so layers work without login or JWT.
 */
export function resolveMapServiceUrl(serviceKey) {
  const key = String(serviceKey || "").trim()
  const direct = HSACGGM_MAP_SERVICE_URLS[key]

  // Local dev: MSME layers on investhry need the backend token proxy (by key, even before URLs are cached).
  if (useLocalGisProxy() && MSME_MAP_SERVICE_KEYS.includes(key)) {
    const proxyUrl = buildMapServiceProxyUrl(key)
    if (proxyUrl && (!direct || shouldUseBackendMapProxy(direct))) {
      return proxyUrl
    }
  }

  if (!direct) return ""

  if (shouldUseBackendMapProxy(direct)) {
    return buildMapServiceProxyUrl(key)
  }

  if (useLocalGisProxy()) {
    return toDevArcGisProxyUrl(direct)
  }

  return direct
}

/**
 * Invest Haryana Vidhan Sabha / policy FeatureServer URLs.
 * Routed through backend mapserver proxy so ArcGIS tokens are applied.
 */
export function resolveInvesthryFeatureUrl(serviceKey) {
  const key = String(serviceKey || "").trim()
  if (!key) return ""

  const direct = INVESTHRY_FEATURE_SERVICE_URLS[key]
  const isKnownInvesthryKey = INVESTHRY_FEATURE_SERVICE_KEYS.includes(key)

  // Backend mapserver proxy only needs the service key (from .env via DB), not the cached URL.
  if (
    isKnownInvesthryKey &&
    (useLocalGisProxy() || shouldUseBackendMapProxy(direct || "https://investhry.harsac.in/"))
  ) {
    const proxyUrl = buildMapServiceProxyUrl(key)
    if (proxyUrl) return proxyUrl
  }

  if (!direct) return ""

  if (shouldUseBackendMapProxy(direct)) {
    return buildMapServiceProxyUrl(key)
  }

  if (useLocalGisProxy()) {
    return toDevInvesthryProxyUrl(direct)
  }

  return direct
}
