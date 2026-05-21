import esriRequest from '@arcgis/core/request.js'
import { getToken } from "../../utils/authStorage.js"
import { handleGisUnauthorized } from "../../utils/gisAuthFailure.js"
import { HSACGGM_MAP_SERVICE_URLS } from "./arcgisMapServiceUrls.js"
import { toDevArcGisProxyUrl, toDevInvesthryProxyUrl } from "./resolveMapServiceUrl.js"

let arcgisRequestsInFlight = 0
let arcgisActiveNetworkRequests = 0
const arcgisPendingNetworkRequests = []
const MAX_PARALLEL_ARCGIS_REQUESTS = 6

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
  const maxAttempts = options && options.maxAttempts ? options.maxAttempts : 4
  const delays = [500, 1500, 3000]

  function run(requestUrl, attempt, usedFallback) {
    const token = getToken()
    const requestOptions = {
      ...(options || {}),
      authMode: 'anonymous',
      timeout: (options && options.timeout) || 90000,
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
  return run(url, 0, false).finally(() => {
    endGisLoading(url)
  })
}

/**
 * MapServer layer query. Densifies true curves so rings are always present when possible.
 */
export function queryLayer(url, layerId, query) {
  var q = query || {}
  var wantsGeometry = q.returnGeometry !== false || q.returnExtentOnly === true
  var base = { f: 'json', returnTrueCurves: false }
  if (wantsGeometry) base.outSR = 32643
  return requestArcGisJson(url + '/' + layerId + '/query', {
    query: Object.assign(base, q),
    responseType: 'json',
  }).then(function (res) {
    return res.data
  })
}
