import { useCallback, useEffect, useMemo, useState } from 'react'
import { haversineMeters } from '../gis/msme/geometryUtils.js'
import '../css/MeasurementDistancePanel.css'

function parseCoord(raw) {
  var text = String(raw ?? '').trim()
  if (!text) return null
  var n = Number(text)
  return Number.isFinite(n) ? n : null
}

function isValidLat(lat) {
  return Number.isFinite(lat) && Math.abs(lat) <= 90
}

function isValidLon(lon) {
  return Number.isFinite(lon) && Math.abs(lon) <= 180
}

function formatMeters(value) {
  var n = Number(value)
  if (!Number.isFinite(n) || n < 0) return '—'
  if (n >= 1000) {
    return `${(n / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km (${Math.round(n)} m)`
  }
  return `${Math.round(n)} m`
}

function formatKm(value) {
  var n = Number(value)
  if (!Number.isFinite(n) || n < 0) return '—'
  if (n >= 1) {
    return `${n.toLocaleString(undefined, { maximumFractionDigits: 3 })} km`
  }
  return `${(n * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} m`
}

export default function MeasurementDistancePanel({ open, onClose, t }) {
  const [lat1, setLat1] = useState('')
  const [lon1, setLon1] = useState('')
  const [lat2, setLat2] = useState('')
  const [lon2, setLon2] = useState('')
  const [lineDistanceM, setLineDistanceM] = useState(null)
  const [lineDrawing, setLineDrawing] = useState(false)

  const distanceM = useMemo(function () {
    var aLat = parseCoord(lat1)
    var aLon = parseCoord(lon1)
    var bLat = parseCoord(lat2)
    var bLon = parseCoord(lon2)
    if (!isValidLat(aLat) || !isValidLon(aLon) || !isValidLat(bLat) || !isValidLon(bLon)) {
      return null
    }
    return haversineMeters(aLon, aLat, bLon, bLat)
  }, [lat1, lon1, lat2, lon2])

  const label = useCallback(
    (key, fallback) => (t && typeof t === 'function' ? t(key) : null) || fallback,
    [t],
  )

  useEffect(function () {
    function onLineDistance(ev) {
      var meters = ev && ev.detail ? ev.detail.meters : null
      if (meters == null) {
        setLineDistanceM(null)
        return
      }
      setLineDistanceM(Number(meters))
      setLineDrawing(false)
    }
    window.addEventListener('msme-measurement-line-distance', onLineDistance)
    return function () {
      window.removeEventListener('msme-measurement-line-distance', onLineDistance)
    }
  }, [])

  useEffect(function () {
    if (open) return
    setLineDrawing(false)
    if (typeof window.msmeGisStopMeasurementLineDraw === 'function') {
      window.msmeGisStopMeasurementLineDraw()
    }
  }, [open])

  function startLineDraw() {
    if (typeof window.msmeGisStartMeasurementLineDraw !== 'function') {
      window.alert(label('measurementMapNotReady', 'Map is still loading. Please try again.'))
      return
    }
    var ok = window.msmeGisStartMeasurementLineDraw()
    if (!ok) {
      window.alert(label('measurementMapNotReady', 'Map is still loading. Please try again.'))
      return
    }
    setLineDrawing(true)
    setLineDistanceM(null)
  }

  function clearLineDraw() {
    if (typeof window.msmeGisClearMeasurementLine === 'function') {
      window.msmeGisClearMeasurementLine()
    }
    setLineDrawing(false)
    setLineDistanceM(null)
  }

  if (!open) return null

  return (
    <aside
      className="measurement-distance-panel"
      id="measurementDistancePanel"
      aria-label={label('measurementPanelTitle', 'Distance measurement')}
    >
      <header className="measurement-distance-panel__header">
        <h2>{label('measurementPanelTitle', 'Distance measurement')}</h2>
        <button
          type="button"
          className="measurement-distance-panel__close"
          onClick={onClose}
          aria-label={label('closePanel', 'Close')}
        >
          ×
        </button>
      </header>

      <div className="measurement-distance-panel__body">
        <section className="measurement-distance-panel__point">
          <h3>{label('measurementPointA', 'Point A')}</h3>
          <label className="measurement-distance-panel__field">
            <span>{label('measurementLatitude', 'Latitude')}</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="29.15"
              value={lat1}
              onChange={(e) => setLat1(e.target.value)}
            />
          </label>
          <label className="measurement-distance-panel__field">
            <span>{label('measurementLongitude', 'Longitude')}</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="76.82"
              value={lon1}
              onChange={(e) => setLon1(e.target.value)}
            />
          </label>
        </section>

        <section className="measurement-distance-panel__point">
          <h3>{label('measurementPointB', 'Point B')}</h3>
          <label className="measurement-distance-panel__field">
            <span>{label('measurementLatitude', 'Latitude')}</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="28.46"
              value={lat2}
              onChange={(e) => setLat2(e.target.value)}
            />
          </label>
          <label className="measurement-distance-panel__field">
            <span>{label('measurementLongitude', 'Longitude')}</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="77.03"
              value={lon2}
              onChange={(e) => setLon2(e.target.value)}
            />
          </label>
        </section>

        <div className="measurement-distance-panel__result" aria-live="polite">
          <span className="measurement-distance-panel__result-label">
            {label('measurementDistance', 'Distance (coordinates)')}
          </span>
          <strong className="measurement-distance-panel__result-value">
            {distanceM == null
              ? label('measurementEnterBothPoints', 'Enter valid coordinates for both points')
              : formatMeters(distanceM)}
          </strong>
        </div>

        <div className="measurement-distance-panel__divider" role="separator">
          {label('measurementOr', 'or')}
        </div>

        <section className="measurement-distance-panel__line-section">
          <h3>{label('measurementDrawLine', 'Draw line on map')}</h3>
          <p className="measurement-distance-panel__hint">
            {label(
              'measurementDrawLineHint',
              'Click on the map from point 1 to point 2 (and more if needed). Double-click to finish.',
            )}
          </p>
          <div className="measurement-distance-panel__actions">
            <button
              type="button"
              className="measurement-distance-panel__btn is-primary"
              onClick={startLineDraw}
            >
              {label('measurementDrawLineBtn', 'Draw line')}
            </button>
            <button
              type="button"
              className="measurement-distance-panel__btn"
              onClick={clearLineDraw}
            >
              {label('measurementClearLine', 'Clear line')}
            </button>
          </div>
          {lineDrawing ? (
            <p className="measurement-distance-panel__status">
              {label('measurementDrawingLine', 'Drawing… double-click on map to finish line')}
            </p>
          ) : null}
          <div className="measurement-distance-panel__result measurement-distance-panel__result--line" aria-live="polite">
            <span className="measurement-distance-panel__result-label">
              {label('measurementLineDistance', 'Line distance')}
            </span>
            <strong className="measurement-distance-panel__result-value">
              {lineDistanceM == null
                ? label('measurementLineEmpty', 'Draw a line on the map to see distance')
                : formatKm(lineDistanceM / 1000)}
            </strong>
          </div>
        </section>
      </div>
    </aside>
  )
}
