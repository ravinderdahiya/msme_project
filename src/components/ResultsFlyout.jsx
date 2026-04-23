import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n.js'

const initialPos = { x: 14, y: 96 }

function groupRows(rows, groupKey) {
  const map = new Map()
  ;(rows || []).forEach((r, idx) => {
    const k = String(groupKey(r) || '—')
    if (!map.has(k)) map.set(k, [])
    map.get(k).push({ ...r, _i: idx })
  })
  return map
}

export default function ResultsFlyout() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [pos, setPos] = useState(initialPos)
  const [payload, setPayload] = useState(null)
  const dragRef = useRef(null)
  const dragStart = useRef(null)

  const [expandedClick, setExpandedClick] = useState(() => new Set())
  const [expandedNear, setExpandedNear] = useState(() => new Set())
  const [visibleClick, setVisibleClick] = useState(() => new Set())
  const [visibleNear, setVisibleNear] = useState(() => new Set())

  useEffect(() => {
    function onTable(ev) {
      const d = ev.detail
      if (!d) return
      setPayload(d)
      setOpen(true)
      setMinimized(false)
      const at = d.atClickRows || []
      const nb = d.nearbyRows || []
      const ck = new Set(groupRows(at, (r) => r.layer).keys())
      const nk = new Set(groupRows(nb, (r) => r.label).keys())
      /* Collapsed by default — user expands a group when needed. */
      setExpandedClick(new Set())
      setExpandedNear(new Set())
      setVisibleClick(new Set(ck))
      setVisibleNear(new Set(nk))
    }
    window.addEventListener('gis-identify-table', onTable)
    return () => window.removeEventListener('gis-identify-table', onTable)
  }, [])

  useEffect(() => {
    const setInset = window.msmeGisSetResultsFlyoutInset
    if (typeof setInset !== 'function') return undefined
    if (!open || minimized) {
      setInset(0)
      return () => setInset(0)
    }
    if (maximized) {
      setInset(0)
      return () => setInset(0)
    }
    const w = 400
    const inset = Math.round(pos.x + w + 12)
    setInset(inset)
    return () => setInset(0)
  }, [open, minimized, maximized, pos.x])

  const clickGroups = useMemo(
    () => groupRows(payload?.atClickRows || [], (r) => r.layer),
    [payload],
  )
  const nearGroups = useMemo(
    () => groupRows(payload?.nearbyRows || [], (r) => r.label),
    [payload],
  )

  const onDragStart = useCallback(
    (e) => {
      if (maximized) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      dragStart.current = { x: clientX - pos.x, y: clientY - pos.y }
      dragRef.current = true
      e.preventDefault()
    },
    [maximized, pos],
  )

  useEffect(() => {
    function move(e) {
      if (!dragRef.current || !dragStart.current) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const nx = clientX - dragStart.current.x
      const ny = clientY - dragStart.current.y
      const maxX = Math.max(8, window.innerWidth - 380)
      const maxY = Math.max(8, window.innerHeight - 80)
      setPos({
        x: Math.min(Math.max(8, nx), maxX),
        y: Math.min(Math.max(56, ny), maxY),
      })
    }
    function up() {
      dragRef.current = false
      dragStart.current = null
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [])

  const toggleClick = useCallback((name) => {
    setExpandedClick((prev) => {
      const n = new Set(prev)
      if (n.has(name)) n.delete(name)
      else n.add(name)
      return n
    })
  }, [])

  const toggleNear = useCallback((name) => {
    setExpandedNear((prev) => {
      const n = new Set(prev)
      if (n.has(name)) n.delete(name)
      else n.add(name)
      return n
    })
  }, [])

  const zoomTo = useCallback((geomJson) => {
    if (!geomJson || !window.msmeGisZoomToGeometry) return
    window.msmeGisZoomToGeometry(geomJson)
  }, [])

  const measureTo = useCallback((geomJson) => {
    if (!window.msmeGisMeasureToGeometry) return
    window.msmeGisMeasureToGeometry(geomJson)
  }, [])

  if (!open || !payload) return null

  const style = maximized
    ? {
        position: 'fixed',
        left: 8,
        top: 72,
        right: 8,
        bottom: 8,
        width: 'auto',
        height: 'auto',
        maxHeight: 'none',
      }
    : {
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 400,
        maxHeight: minimized ? 44 : 'min(78vh, 620px)',
      }

  const { lat, lon, atClickRows = [], nearbyRows = [], radiusM = 0 } = payload

  const toggleVisibleClick = (name) => {
    setVisibleClick((prev) => {
      const n = new Set(prev)
      if (n.has(name)) n.delete(name)
      else n.add(name)
      return n
    })
  }
  const toggleVisibleNear = (name) => {
    setVisibleNear((prev) => {
      const n = new Set(prev)
      if (n.has(name)) n.delete(name)
      else n.add(name)
      return n
    })
  }

  return (
    <div
      className={`results-flyout ${maximized ? 'maximized' : ''} ${minimized ? 'minimized' : ''}`}
      style={style}
      role="dialog"
      aria-label={t('resultsTitle')}
    >
      <div className="results-flyout-head" onMouseDown={onDragStart} onTouchStart={onDragStart}>
        <span className="results-flyout-title">{t('resultsTitle')}</span>
        <div className="results-flyout-winbtns">
          <button
            type="button"
            className="winbtn"
            title={minimized ? t('resultsRestore') : t('resultsMin')}
            onClick={() => setMinimized((m) => !m)}
          >
            {minimized ? '▢' : '—'}
          </button>
          <button
            type="button"
            className="winbtn"
            title={maximized ? t('resultsRestore') : t('resultsMax')}
            onClick={() => setMaximized((m) => !m)}
          >
            {maximized ? '❐' : '□'}
          </button>
          <button
            type="button"
            className="winbtn"
            title={t('resultsClose')}
            onClick={() => {
              setOpen(false)
              setPayload(null)
            }}
          >
            ×
          </button>
        </div>
      </div>
      {!minimized && (
        <div className="results-flyout-body">
          <p className="results-loc">
            <strong>{t('resultsLocation')}</strong>
            <br />
            Lat {typeof lat === 'number' ? lat.toFixed(5) : '—'}°, Lon{' '}
            {typeof lon === 'number' ? lon.toFixed(5) : '—'}°
          </p>

          <p className="results-hint">{t('langRecommendHint')}</p>

          <div className="results-section">
            <h4 className="results-subh">{t('resultsFeatures')}</h4>
            <div className="results-class-filter">
              <span className="filter-label">{t('featureClassFilter')}</span>
              <div className="filter-chips">
                {Array.from(clickGroups.keys()).map((name) => (
                  <label key={`vc-${name}`} className="chip">
                    <input
                      type="checkbox"
                      checked={visibleClick.has(name)}
                      onChange={() => toggleVisibleClick(name)}
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>
            {Array.from(clickGroups.entries()).map(([name, rows]) => {
              if (!visibleClick.has(name)) return null
              const count = rows.length
              const openG = expandedClick.has(name)
              return (
                <div key={`cg-${name}`} className="results-group">
                  <button
                    type="button"
                    className="results-group-head"
                    onClick={() => toggleClick(name)}
                    aria-expanded={openG}
                  >
                    <span className="chev">{openG ? '▼' : '▶'}</span>
                    <span className="gname">
                      {name} <span className="gcount">({count})</span>
                    </span>
                  </button>
                  {openG && (
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t('resultsDistance')}</th>
                          <th>{t('resultsActions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, j) => (
                          <tr key={`cr-${name}-${j}`}>
                            <td>{j + 1}</td>
                            <td>
                              {r.dM != null && !Number.isNaN(r.dM) ? `${r.dM} m` : '—'}
                            </td>
                            <td className="results-actions">
                              <button
                                type="button"
                                className="linkish"
                                disabled={!r.geomJson}
                                onClick={() => zoomTo(r.geomJson)}
                              >
                                {t('zoomFeature')}
                              </button>
                              <button
                                type="button"
                                className="linkish"
                                disabled={!r.geomJson}
                                onClick={() => measureTo(r.geomJson)}
                              >
                                {t('measureDist')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )
            })}
            {atClickRows.length === 0 && (
              <p className="muted small">{t('resultsNone')}</p>
            )}
          </div>

          <div className="results-section">
            <h4 className="results-subh">
              {t('resultsNearby')} ({radiusM} m)
            </h4>
            <div className="results-class-filter">
              <span className="filter-label">{t('featureClassFilter')}</span>
              <div className="filter-chips">
                {Array.from(nearGroups.keys()).map((name) => (
                  <label key={`vn-${name}`} className="chip">
                    <input
                      type="checkbox"
                      checked={visibleNear.has(name)}
                      onChange={() => toggleVisibleNear(name)}
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>
            {Array.from(nearGroups.entries()).map(([name, rows]) => {
              if (!visibleNear.has(name)) return null
              const count = rows.length
              const openG = expandedNear.has(name)
              return (
                <div key={`ng-${name}`} className="results-group">
                  <button
                    type="button"
                    className="results-group-head"
                    onClick={() => toggleNear(name)}
                    aria-expanded={openG}
                  >
                    <span className="chev">{openG ? '▼' : '▶'}</span>
                    <span className="gname">
                      {name} <span className="gcount">({count})</span>
                    </span>
                  </button>
                  {openG && (
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t('resultsDistance')}</th>
                          <th>{t('resultsActions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, j) => (
                          <tr key={`nr-${name}-${j}`}>
                            <td>{j + 1}</td>
                            <td>
                              {r.dM != null && !Number.isNaN(r.dM) ? `${r.dM} m` : '—'}
                            </td>
                            <td className="results-actions">
                              <button
                                type="button"
                                className="linkish"
                                disabled={!r.geomJson}
                                onClick={() => zoomTo(r.geomJson)}
                              >
                                {t('zoomFeature')}
                              </button>
                              <button
                                type="button"
                                className="linkish"
                                disabled={!r.geomJson}
                                onClick={() => measureTo(r.geomJson)}
                              >
                                {t('measureDist')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )
            })}
            {nearbyRows.length === 0 && (
              <p className="muted small">{t('resultsNone')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
