/**
 * Shows the GIS "Analyzing Data" overlay immediately on map click / API start,
 * instead of waiting for the legacy runtime debounce.
 */

let loaderDepth = 0
let hideTimer = null
let mapClickHooked = false

function getOverlayEl() {
  return typeof document !== 'undefined' ? document.getElementById('gisLoadingOverlay') : null
}

export function showGisDataLoader() {
  loaderDepth += 1
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  const el = getOverlayEl()
  if (!el) return
  el.classList.remove('is-hidden')
  el.setAttribute('aria-hidden', 'false')
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent('msme-gis-loader-show'))
    } catch {
      /* no-op */
    }
  }
}

export function hideGisDataLoader() {
  loaderDepth = Math.max(0, loaderDepth - 1)
  if (loaderDepth > 0) return
  const el = getOverlayEl()
  if (!el) return
  hideTimer = window.setTimeout(() => {
    hideTimer = null
    if (loaderDepth > 0) return
    el.classList.add('is-hidden')
    el.setAttribute('aria-hidden', 'true')
  }, 60)
}

function isUiChromeClickTarget(target) {
  if (!target || typeof target.closest !== 'function') return false
  return !!target.closest(
    '.esri-ui, .buffer-fab-wrap, .buffer-map-fab, .msme-basemap-fab-host, .closest-print-fab, #gisLoadingOverlay, .gis-top-search',
  )
}

function hookMapViewClickLoader(view) {
  if (!view || view.destroyed || view.__msmeClickLoaderHooked) return
  view.__msmeClickLoaderHooked = true
  view.on('click', (event) => {
    const target = event?.native?.target
    if (isUiChromeClickTarget(target)) return
    showGisDataLoader()
  })
}

function syncOverlayHiddenFromLegacy() {
  const el = getOverlayEl()
  if (!el) return
  const mo = new MutationObserver(() => {
    if (!el.classList.contains('is-hidden')) return
    loaderDepth = 0
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  })
  mo.observe(el, { attributes: true, attributeFilter: ['class'] })
}

function tryHookMapView() {
  if (typeof window === 'undefined') return
  hookMapViewClickLoader(window.__msmeGisMapView)
}

export function installGisLoadingBridge() {
  if (typeof window === 'undefined' || window.__msmeGisLoadingBridgeInstalled) return
  window.__msmeGisLoadingBridgeInstalled = true
  window.__msmeShowGisDataLoader = showGisDataLoader
  window.__msmeHideGisDataLoader = hideGisDataLoader

  window.addEventListener('msme-gis-loading', (event) => {
    const busy = Boolean(event?.detail?.busy)
    if (busy) showGisDataLoader()
    else hideGisDataLoader()
  })

  syncOverlayHiddenFromLegacy()
  tryHookMapView()
  window.setInterval(tryHookMapView, 400)
}
