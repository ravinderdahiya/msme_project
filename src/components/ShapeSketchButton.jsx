import { useEffect, useRef, useState } from 'react'

export default function ShapeSketchButton() {
  var [open, setOpen] = useState(false)
  var [shapeMode, setShapeMode] = useState('polygon')
  var [distanceValue, setDistanceValue] = useState('5')
  var [unit, setUnit] = useState('km')
  var rootRef = useRef(null)

  useEffect(() => {
    function onDocClick(ev) {
      var root = rootRef.current
      if (!root) return
      if (!root.contains(ev.target)) setOpen(false)
    }
    if (!open) return undefined
    document.addEventListener('click', onDocClick)
    return function cleanup() {
      document.removeEventListener('click', onDocClick)
    }
  }, [open])

  function distanceInputStep() {
    if (unit === 'km') return '0.1'
    if (unit === 'm') return '10'
    if (unit === 'yd') return '10'
    if (unit === 'ft') return '10'
    return '1'
  }

  function toMeters(raw, u) {
    var n = Number(raw)
    if (!isFinite(n) || n <= 0) return NaN
    var unitKey = String(u || '').toLowerCase()
    if (unitKey === 'km') return Math.round(n * 1000)
    if (unitKey === 'yd' || unitKey === 'yard' || unitKey === 'yards') return Math.round(n * 0.9144)
    if (unitKey === 'ft' || unitKey === 'feet' || unitKey === 'foot') return Math.round(n * 0.3048)
    return Math.round(n)
  }

  function syncSketchDistanceToLegacyUi() {
    var m = toMeters(distanceValue, unit)
    if (!isFinite(m) || m <= 0) m = 5000

    var pickNum = document.getElementById('bufferPickDistNum')
    var pickUnit = document.getElementById('bufferPickDistUnit')
    if (pickNum) pickNum.value = String(distanceValue || '5')
    if (pickUnit) pickUnit.value = unit

    var slider = document.getElementById('bufDist')
    var sliderVal = document.getElementById('bufDistVal')
    if (slider) {
      var minV = parseInt(slider.min, 10)
      var maxV = parseInt(slider.max, 10)
      if (isFinite(minV)) m = Math.max(minV, m)
      if (isFinite(maxV)) m = Math.min(maxV, m)
      slider.value = String(m)
      try {
        slider.dispatchEvent(new Event('input', { bubbles: true }))
      } catch (_e0) {}
    }
    if (sliderVal) sliderVal.textContent = String(m)
  }

  function runShapeSketch() {
    syncSketchDistanceToLegacyUi()
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
    if (shapeMode === 'polyline') return 'Line Buffer'
    if (shapeMode === 'rectangle') return 'Rectangle'
    if (shapeMode === 'circle') return 'Circle'
    return 'Polygon'
  }

  return (
    <div className="msme-shape-fab-host" ref={rootRef}>
      {/* <button
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
      </button> */}
      <button
        type="button"
        id="trackMapFab"
        className="buffer-map-fab track-map-fab esri-widget--button"
        data-map-label="Analysis by Shape"
        aria-label="Analysis by Shape"
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
            <strong> Buffer Analysis by Shape </strong>
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
            <label className="buffer-mini-panel__label">Buffer distance</label>
            <div className="buffer-mini-panel__row">
              <input
                type="number"
                className="buffer-mini-panel__num"
                min="0.1"
                step={distanceInputStep()}
                value={distanceValue}
                onChange={(e) => setDistanceValue(e.target.value)}
              />
              <select
                className="buffer-mini-panel__unit"
                value={unit}
                onChange={(e) => setUnit(String(e.target.value || 'km'))}
              >
                <option value="km">Kilometer</option>
                <option value="m">Meter</option>
                <option value="yd">Yard</option>
                <option value="ft">Feet</option>
              </select>
            </div>
            <label className="buffer-mini-panel__label">Select shape</label>
            <div className="shape-mini-panel__row">
              <select
                className="buffer-mini-panel__unit shape-mini-panel__select"
                value={shapeMode}
                onChange={(e) => setShapeMode(String(e.target.value || 'polygon'))}
              >
                <option value="polygon">Polygon</option>
                <option value="polyline">Line </option>
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
