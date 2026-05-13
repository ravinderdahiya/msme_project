import { useEffect, useRef, useState } from 'react'

export default function ShapeSketchButton() {
  var [open, setOpen] = useState(false)
  var [shapeMode, setShapeMode] = useState('polygon')
  var rootRef = useRef(null)

  useEffect(() => {
    function onDocClick(ev) {
      var root = rootRef.current
      if (!root) return
      if (!root.contains(ev.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return function cleanup() {
      document.removeEventListener('mousedown', onDocClick)
    }
  }, [])

  useEffect(() => {
    var root = rootRef.current
    if (!root) return

    var originalParent = root.parentElement
    var originalNextSibling = root.nextSibling
    var mo = null
    var moveTimer = null

    function moveIntoTopRight() {
      var host = document.querySelector('#viewDiv .esri-ui-top-right.esri-ui-corner')
      if (!host || !root) return false
      var closestFab = document.getElementById('closestMapFab')
      var bufferWrap = closestFab ? closestFab.closest('.buffer-fab-wrap') : null

      if (bufferWrap) {
        if (root.parentElement !== bufferWrap) {
          var afterClosest = closestFab.nextSibling
          if (afterClosest && afterClosest.parentNode === bufferWrap) {
            bufferWrap.insertBefore(root, afterClosest)
          } else {
            bufferWrap.appendChild(root)
          }
        }
        return true
      }

      if (root.parentElement !== host) {
        host.insertBefore(root, host.firstChild || null)
      }
      return true
    }

    if (!moveIntoTopRight()) {
      mo = new MutationObserver(function () {
        if (moveIntoTopRight() && mo) {
          mo.disconnect()
          mo = null
        }
      })
      mo.observe(document.body, { childList: true, subtree: true })
      moveTimer = window.setTimeout(function () {
        if (mo) {
          mo.disconnect()
          mo = null
        }
      }, 10000)
    }

    return function cleanupMountMove() {
      if (mo) mo.disconnect()
      if (moveTimer) window.clearTimeout(moveTimer)
      if (!root || !originalParent) return
      if (root.parentElement !== originalParent) {
        if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
          originalParent.insertBefore(root, originalNextSibling)
        } else {
          originalParent.appendChild(root)
        }
      }
    }
  }, [])

  function runShapeSketch() {
    if (window.msmeGisStartSketch && typeof window.msmeGisStartSketch === 'function') {
      window.msmeGisStartSketch(shapeMode)
      setOpen(false)
      return
    }
    var statusEl = document.getElementById('status')
    if (statusEl) {
      statusEl.textContent = 'Shape draw tool unavailable: map not ready.'
    }
  }

  function selectedShapeLabel() {
    if (shapeMode === 'rectangle') return 'Rectangle'
    if (shapeMode === 'circle') return 'Circle'
    return 'Polygon'
  }

  return (
    <div className="shape-fab-wrap esri-component" ref={rootRef}>
      <button
        type="button"
        id="shapeMapFab"
        className="buffer-map-fab shape-map-fab esri-widget--button"
        data-map-label="Shape"
        title="Shape draw"
        aria-label="Shape draw"
        aria-expanded={open ? 'true' : 'false'}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24" className="buffer-map-fab-ico" aria-hidden="true" focusable="false">
          <path
            d="M5 4h7v7H5zM14.5 5.2l4.3 2.5v5l-4.3 2.5-4.3-2.5v-5l4.3-2.5zM6.8 14.5h4.4l2.2 3.8-2.2 3.8H6.8l-2.2-3.8 2.2-3.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="shape-mini-panel" role="dialog" aria-label="Select sketch shape">
          <div className="buffer-mini-panel__head">
            <strong>Shape Draw</strong>
            <button
              type="button"
              className="buffer-mini-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              x
            </button>
          </div>
          <div className="buffer-mini-panel__body">
            <label className="buffer-mini-panel__label">Select shape</label>
            <div className="shape-mini-panel__row">
              <select
                className="buffer-mini-panel__unit shape-mini-panel__select"
                value={shapeMode}
                onChange={(e) => setShapeMode(String(e.target.value || 'polygon'))}
              >
                <option value="polygon">Polygon</option>
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
              </select>
            </div>
            <p className="shape-mini-panel__hint">
              Draw {selectedShapeLabel()} on map, then community panel me data auto update hoga.
            </p>
            <div className="buffer-mini-panel__actions">
              <button type="button" className="buffer-mini-panel__btn is-primary" onClick={runShapeSketch}>
                Draw on map
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
