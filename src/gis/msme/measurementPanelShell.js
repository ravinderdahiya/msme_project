/** Rail panel open/close for Measurement Tool — matches legacy spatial/AOI/layers pattern. */

import { closeAoiRoutePanel } from './aoiRoutePanel.js'

const PANEL_BTN_PAIRS = [
  ['spatialPanel', 'btnOpenSpatial'],
  ['aoiPanel', 'btnOpenNav'],
  ['toolsPanel', 'btnTogglePanel'],
  ['selectToolsPanel', 'btnSelectTool'],
  ['measurementPanel', 'btnMeasurementTool'],
]

function notifyLayout() {
  if (typeof window.refreshMapViewPadding === 'function') {
    window.refreshMapViewPadding()
  }
  if (typeof window.notifyViewLayoutChanged === 'function') {
    window.setTimeout(function () {
      window.notifyViewLayoutChanged()
    }, 280)
  }
}

export function closeGisRailPanel(panelId, btnId) {
  const panel = document.getElementById(panelId)
  const btn = btnId ? document.getElementById(btnId) : null
  if (!panel || panel.classList.contains('collapsed')) return
  panel.classList.add('collapsed')
  panel.setAttribute('aria-hidden', 'true')
  if (btn) btn.classList.remove('active')
}

export function closeAllGisRailPanelsExcept(keepPanelId) {
  PANEL_BTN_PAIRS.forEach(function (pair) {
    if (pair[0] !== keepPanelId) closeGisRailPanel(pair[0], pair[1])
  })
  notifyLayout()
}

export function closeMeasurementPanel() {
  closeGisRailPanel('measurementPanel', 'btnMeasurementTool')
  if (typeof window.msmeGisStopMeasurementLineDraw === 'function') {
    window.msmeGisStopMeasurementLineDraw()
  }
  notifyLayout()
}

export function closeAoiPanel() {
  closeAoiRoutePanel()
  closeGisRailPanel('aoiPanel', 'btnOpenNav')
  notifyLayout()
}

export function closeSpatialPanel() {
  closeGisRailPanel('spatialPanel', 'btnOpenSpatial')
  notifyLayout()
}

export function closeToolsPanel() {
  closeGisRailPanel('toolsPanel', 'btnTogglePanel')
  notifyLayout()
}

export function closeSelectToolsPanel() {
  closeGisRailPanel('selectToolsPanel', 'btnSelectTool')
  notifyLayout()
}

/** Collapse AOI rail panel only after the user clicks Plan Route. */
export function bindAoiPanelCloseOnPlanRoute() {
  if (typeof window === 'undefined' || window.__msmeAoiCloseOnPlanRouteBound) return
  const btn = document.getElementById('btnRouteFromCurrentToAoi')
  if (!btn) return
  window.__msmeAoiCloseOnPlanRouteBound = true

  btn.addEventListener('click', function () {
    window.setTimeout(function () {
      closeGisRailPanel('aoiPanel', 'btnOpenNav')
      notifyLayout()
    }, 0)
  })
}

export function openMeasurementPanel() {
  const panel = document.getElementById('measurementPanel')
  const btn = document.getElementById('btnMeasurementTool')
  if (!panel) return
  closeAllGisRailPanelsExcept('measurementPanel')
  panel.classList.remove('collapsed')
  panel.setAttribute('aria-hidden', 'false')
  if (btn) btn.classList.add('active')
  notifyLayout()
}

export function toggleMeasurementPanel() {
  const panel = document.getElementById('measurementPanel')
  if (!panel) return
  if (panel.classList.contains('collapsed')) {
    openMeasurementPanel()
  } else {
    closeMeasurementPanel()
  }
}

/** When legacy panels open, close measurement so only one rail panel shows. */
export function bindMeasurementPanelExclusivity() {
  if (typeof window === 'undefined' || window.__msmeMeasurementPanelExclusivityBound) return
  window.__msmeMeasurementPanelExclusivityBound = true

  ;['spatialPanel', 'aoiPanel', 'toolsPanel', 'selectToolsPanel'].forEach(function (panelId) {
    const el = document.getElementById(panelId)
    if (!el) return
    const obs = new MutationObserver(function () {
      if (!el.classList.contains('collapsed')) {
        closeMeasurementPanel()
      }
    })
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
  })
}
