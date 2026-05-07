import { useEffect } from 'react'
import LocationButton from './LocationButton.jsx'
import BufferButton from './BufferButton.jsx'
import PrintScreenButton from './PrintScreenButton.jsx'

export default function HaryanaMap({ t }) {
  useEffect(() => {
    const HOME_SELECTORS = [
      '#viewDiv .esri-home.esri-widget--button',
      '#viewDiv .esri-home .esri-widget--button',
      '#viewDiv .esri-home calcite-button.esri-widget--button',
    ]

    function goToCurrentLocation() {
      if (typeof window === 'undefined') return
      if (typeof window.msmeGisShowCurrentLocation === 'function') {
        window.msmeGisShowCurrentLocation()
      }
    }

    function onHomeClickCapture(ev) {
      if (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation()
      }
      goToCurrentLocation()
    }

    function onHomeKeydownCapture(ev) {
      if (!ev) return
      const key = ev.key
      if (key !== 'Enter' && key !== ' ') return
      ev.preventDefault()
      ev.stopPropagation()
      if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation()
      goToCurrentLocation()
    }

    function bindHomeHandlers() {
      const seen = new Set()
      HOME_SELECTORS.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => seen.add(el))
      })
      seen.forEach((el) => {
        if (!el || el.dataset.msmeHomeCurrentLocBound === '1') return
        el.dataset.msmeHomeCurrentLocBound = '1'
        el.addEventListener('click', onHomeClickCapture, true)
        el.addEventListener('keydown', onHomeKeydownCapture, true)
      })
    }

    bindHomeHandlers()

    const mo = new MutationObserver(() => {
      bindHomeHandlers()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      document.querySelectorAll('[data-msme-home-current-loc-bound="1"]').forEach((el) => {
        el.removeEventListener('click', onHomeClickCapture, true)
        el.removeEventListener('keydown', onHomeKeydownCapture, true)
        delete el.dataset.msmeHomeCurrentLocBound
      })
    }
  }, [])

  useEffect(() => {
    const ICON_SELECTORS = [
      '#viewDiv .esri-icon-applications',
      '#viewDiv .esri-icon-basemap',
    ]
    const hostSelector = '#viewDiv .esri-ui-top-right.esri-ui-corner'

    function styleNode(el, styles) {
      if (!el) return
      Object.keys(styles).forEach((k) => {
        el.style.setProperty(k, styles[k], 'important')
      })
    }

    function normalizeBasemapButton() {
      const host = document.querySelector(hostSelector)
      if (!host) return false

      let found = false
      ICON_SELECTORS.forEach((sel) => {
        host.querySelectorAll(sel).forEach((icon) => {
          const root =
            icon.closest('.esri-expand') ||
            icon.closest('.esri-basemap-toggle') ||
            icon.closest('.esri-component.esri-widget') ||
            icon.closest('.esri-component')
          if (!root) return

          const isExpanded = root.classList.contains('esri-expand--expanded')
          const container = root.querySelector('.esri-expand__container')
          const toggle =
            root.querySelector('.esri-expand__toggle') ||
            root.querySelector('.esri-widget--button') ||
            root.querySelector('.esri-button') ||
            root.querySelector('calcite-button.esri-widget--button')

          styleNode(root, {
            background: 'transparent',
            border: '0',
            'box-shadow': 'none',
            padding: '0',
            margin: '0',
            overflow: 'visible',
          })

          if (!isExpanded) {
            styleNode(root, {
              width: '50px',
              height: '50px',
              'min-width': '50px',
              'min-height': '50px',
              'border-radius': '50%',
            })
            styleNode(container, {
              width: '50px',
              height: '50px',
              'min-width': '50px',
              'min-height': '50px',
              'border-radius': '50%',
              background: 'transparent',
              border: '0',
              'box-shadow': 'none',
              overflow: 'visible',
              padding: '0',
              margin: '0',
            })
          }

          styleNode(toggle, {
            width: '50px',
            height: '50px',
            'min-width': '50px',
            'min-height': '50px',
            'border-radius': '50%',
            border: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.94)',
            'box-shadow': 'var(--shadow)',
            overflow: 'hidden',
            padding: '0',
          })

          found = true
        })
      })

      return found
    }

    normalizeBasemapButton()
    const timer = window.setTimeout(normalizeBasemapButton, 1200)
    const mo = new MutationObserver(() => {
      normalizeBasemapButton()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    function onAnyClick() {
      window.setTimeout(normalizeBasemapButton, 0)
    }
    document.addEventListener('click', onAnyClick, true)

    return () => {
      window.clearTimeout(timer)
      mo.disconnect()
      document.removeEventListener('click', onAnyClick, true)
    }
  }, [])

  return (
    <>
      <button
        type="button"
        id="legendFab"
        title={t('legendToggle')}
        aria-expanded="false"
        aria-controls="legendPanel"
      >
        ◧
      </button>

      <div id="legendPanel" aria-label={t('legendPanelLabel')}>
        <div id="legendInner"></div>
      </div>

      <div id="coordBar">{t('coordPlaceholder')}</div>

      {/* <LocationButton t={t} /> */}
      <BufferButton t={t} />
      <PrintScreenButton t={t} />
      <div id="gisLoadingOverlay" className="is-hidden" aria-hidden="true">
        <div className="gis-loading-chip" role="status" aria-live="polite">
          <span className="gis-loading-spinner" aria-hidden="true"></span>
          <span id="gisLoadingText">{(t && t('loading')) || 'Loading data...'}</span>
        </div>
      </div>
      <div id="viewDiv"></div>
      <div id="basemapSlot" style={{ display: 'none' }}></div>
    </>
  )
}
