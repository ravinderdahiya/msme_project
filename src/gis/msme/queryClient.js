import esriRequest from '@arcgis/core/request.js'

let arcgisRequestsInFlight = 0

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
  return /ERR_CONNECTION_RESET|Failed to fetch|NetworkError|fetch failed|timeout|503|502|504|429|temporar|socket|connection/i.test(
    text,
  )
}

export function requestArcGisJson(url, options) {
  const maxAttempts = options && options.maxAttempts ? options.maxAttempts : 3
  const delays = [350, 1000]

  function run(attempt) {
    return esriRequest(url, options).catch((error) => {
      if (attempt >= maxAttempts - 1 || !shouldRetry(error)) {
        throw error
      }
      const waitMs = delays[Math.min(attempt, delays.length - 1)]
      console.warn(`[request retry] ${url} (${attempt + 2}/${maxAttempts})`, error)
      return delay(waitMs).then(() => run(attempt + 1))
    })
  }

  beginGisLoading(url)
  return run(0).finally(() => {
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
