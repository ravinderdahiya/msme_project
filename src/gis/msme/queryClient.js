import esriRequest from '@arcgis/core/request.js'
import { getToken } from "../../utils/authStorage.js"
import { handleGisUnauthorized } from "../../utils/gisAuthFailure.js"
import { HSACGGM_MAP_SERVICE_URLS } from "./arcgisMapServiceUrls.js"
import { toDevArcGisProxyUrl, toDevInvesthryProxyUrl } from "./resolveMapServiceUrl.js"

let arcgisRequestsInFlight = 0
let arcgisActiveNetworkRequests = 0
const arcgisPendingNetworkRequests = []
const MAX_PARALLEL_ARCGIS_REQUESTS = (() => {
  const raw = Number(import.meta.env.VITE_GIS_MAX_PARALLEL_REQUESTS)
  if (!Number.isFinite(raw)) return 14
  return Math.max(4, Math.min(20, Math.round(raw)))
})()
const DEFAULT_ARCGIS_MAX_ATTEMPTS = (() => {
  const raw = Number(import.meta.env.VITE_GIS_MAX_ATTEMPTS)
  if (!Number.isFinite(raw)) return 2
  return Math.max(1, Math.min(6, Math.round(raw)))
})()
const DEFAULT_ARCGIS_TIMEOUT_MS = (() => {
  const raw = Number(import.meta.env.VITE_GIS_REQUEST_TIMEOUT_MS)
  if (!Number.isFinite(raw)) return 45000
  return Math.max(15000, Math.min(180000, Math.round(raw)))
})()
const REQUEST_RESPONSE_CACHE_TTL_MS = (() => {
  const raw = Number(import.meta.env.VITE_GIS_QUERY_CACHE_TTL_MS)
  if (!Number.isFinite(raw)) return 8000
  return Math.max(0, Math.min(15000, Math.round(raw)))
})()
const recentRequestCache = new Map()
const inFlightRequestMap = new Map()
const MAX_RECENT_CACHE_ENTRIES = 250

function runWithArcgisRequestSlot(task) {
  return new Promise((resolve, reject) => {
    const execute = () => {
      arcgisActiveNetworkRequests += 1
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => {
          arcgisActiveNetworkRequests = Math.max(0, arcgisActiveNetworkRequests - 1)
          const next = arcgisPendingNetworkRequests.shift()
          if (typeof next === 'function') next()
        })
    }

    if (arcgisActiveNetworkRequests < MAX_PARALLEL_ARCGIS_REQUESTS) {
      execute()
      return
    }
    arcgisPendingNetworkRequests.push(execute)
  })
}

function emitGisLoading(url) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return
  try {
    window.dispatchEvent(
      new CustomEvent('msme-gis-loading', {
        detail: {
          busy: arcgisRequestsInFlight > 0,
          inFlight: arcgisRequestsInFlight,
          url: String(url || ''),
        },
      }),
    )
  } catch {
    // no-op
  }
}

function beginGisLoading(url) {
  arcgisRequestsInFlight += 1
  emitGisLoading(url)
}

function endGisLoading(url) {
  arcgisRequestsInFlight = Math.max(0, arcgisRequestsInFlight - 1)
  emitGisLoading(url)
}

function delay(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

function stableValueForCache(value) {
  if (Array.isArray(value)) return value.map(stableValueForCache)
  if (value && typeof value === "object") {
    const out = {}
    Object.keys(value)
      .sort()
      .forEach((key) => {
        out[key] = stableValueForCache(value[key])
      })
    return out
  }
  return value
}

function buildRequestCacheKey(url, options) {
  const o = options || {}
  return JSON.stringify({
    url: String(url || ""),
    responseType: String(o.responseType || ""),
    query: stableValueForCache(o.query || {}),
  })
}

function readCachedRecentResponse(cacheKey) {
  if (!REQUEST_RESPONSE_CACHE_TTL_MS) return null
  const cached = recentRequestCache.get(cacheKey)
  if (!cached) return null
  if (Date.now() > cached.expiresAt) {
    recentRequestCache.delete(cacheKey)
    return null
  }
  return cached.response
}

function cacheRecentResponse(cacheKey, response) {
  if (!REQUEST_RESPONSE_CACHE_TTL_MS) return
  if (recentRequestCache.size >= MAX_RECENT_CACHE_ENTRIES) {
    const oldestKey = recentRequestCache.keys().next().value
    if (oldestKey) recentRequestCache.delete(oldestKey)
  }
  recentRequestCache.set(cacheKey, {
    response,
    expiresAt: Date.now() + REQUEST_RESPONSE_CACHE_TTL_MS,
  })
}

function errorText(error) {
  if (!error) return ''
  const parts = []
  if (error.message) parts.push(String(error.message))
  if (error.name) parts.push(String(error.name))
  if (error.details) {
    if (Array.isArray(error.details)) parts.push(error.details.join(' '))
    else parts.push(String(error.details))
  }
  return parts.join(' ')
}

function shouldRetry(error) {
  const text = errorText(error)
  return /ERR_CONNECTION_RESET|ECONNRESET|socket hang up|TLS connection|Failed to fetch|NetworkError|fetch failed|timeout|503|502|504|429|temporar|socket|connection/i.test(
    text,
  )
}

function errorStatusCode(error) {
  return (
    Number(error?.details?.httpStatus) ||
    Number(error?.response?.status) ||
    Number(error?.httpStatus) ||
    0
  )
}

function isUnauthorizedError(error) {
  if (!error) return false
  const status = errorStatusCode(error)
  if (status === 401 || status === 403) return true
  const text = errorText(error).toLowerCase()
  return text.includes('401') || text.includes('403') || text.includes('unauthorized')
}

function handleAuthFailure() {
  if (!getToken()) return
  handleGisUnauthorized()
}

function mapQueryPublicFallbackUrl(requestUrl) {
  const raw = String(requestUrl || "")
  const path = raw.replace(/\?.*$/, "")
  const suffix = raw.slice(path.length)

  const proxyMatch = path.match(/\/mapserver\/service\/([^/]+)(\/.*)?$/i)
  if (proxyMatch) {
    const direct = HSACGGM_MAP_SERVICE_URLS[proxyMatch[1]]
    if (direct) {
      const base = import.meta.env.DEV ? toDevArcGisProxyUrl(direct) : direct
      return base + (proxyMatch[2] || "") + suffix
    }
  }

  if (import.meta.env.DEV && /^https?:\/\/hsacggm\.in/i.test(path)) {
    return toDevArcGisProxyUrl(path) + suffix
  }

  if (import.meta.env.DEV && /^https?:\/\/investhry\.harsac\.in/i.test(path)) {
    return toDevInvesthryProxyUrl(path) + suffix
  }

  return ""
}

export function requestArcGisJson(url, options) {
  const maxAttempts = options && options.maxAttempts ? options.maxAttempts : DEFAULT_ARCGIS_MAX_ATTEMPTS
  const delays = [250, 700, 1400, 2400, 3200]
  const cacheKey = buildRequestCacheKey(url, options)
  const cached = readCachedRecentResponse(cacheKey)
  if (cached) return Promise.resolve(cached)
  const inFlight = inFlightRequestMap.get(cacheKey)
  if (inFlight) return inFlight

  function run(requestUrl, attempt, usedFallback) {
    const token = getToken()
    const requestOptions = {
      ...(options || {}),
      authMode: 'anonymous',
      timeout: (options && options.timeout) || DEFAULT_ARCGIS_TIMEOUT_MS,
      headers: {
        ...((options && options.headers) || {}),
        ...(token && String(requestUrl).includes("/mapserver/service/")
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
    }

    return runWithArcgisRequestSlot(() => esriRequest(requestUrl, requestOptions)).catch((error) => {
      const fallback = usedFallback ? "" : mapQueryPublicFallbackUrl(requestUrl)
      const status = errorStatusCode(error)
      const text = errorText(error)
      const isNotFound = /404|not found/i.test(text)
      const isServerFailure = status >= 500
      const isTokenFailure = /token required|invalid token|status:?\s*(498|499)/i.test(text)
      const shouldTryPublicFallback =
        !!fallback &&
        fallback !== requestUrl &&
        (
          isUnauthorizedError(error) ||
          isNotFound ||
          isServerFailure ||
          isTokenFailure ||
          shouldRetry(error)
        )

      if (shouldTryPublicFallback) {
        if (isUnauthorizedError(error)) handleAuthFailure()
        console.warn("[map query] retrying via public ArcGIS URL", fallback)
        return run(fallback, attempt, true)
      }

      if (isUnauthorizedError(error) || isNotFound) {
        if (isUnauthorizedError(error)) handleAuthFailure()
        throw error
      }
      if (attempt >= maxAttempts - 1 || !shouldRetry(error)) {
        throw error
      }
      const waitMs = delays[Math.min(attempt, delays.length - 1)]
      console.warn(`[request retry] ${requestUrl} (${attempt + 2}/${maxAttempts})`, error)
      return delay(waitMs).then(() => run(requestUrl, attempt + 1, usedFallback))
    })
  }

  beginGisLoading(url)
  const requestPromise = run(url, 0, false)
    .then((response) => {
      cacheRecentResponse(cacheKey, response)
      return response
    })
    .finally(() => {
      inFlightRequestMap.delete(cacheKey)
      endGisLoading(url)
    })
  inFlightRequestMap.set(cacheKey, requestPromise)
  return requestPromise
}

/**
 * MapServer layer query. Densifies true curves so rings are always present when possible.
 */
export function queryLayer(url, layerId, query) {
  var q = query || {}
  var wantsGeometry = q.returnGeometry !== false || q.returnExtentOnly === true
  var base = { f: 'json', returnTrueCurves: false, cacheHint: true }
  if (wantsGeometry) base.outSR = 32643
  return requestArcGisJson(url + '/' + layerId + '/query', {
    query: Object.assign(base, q),
    responseType: 'json',
  }).then(function (res) {
    return res.data
  })
}
