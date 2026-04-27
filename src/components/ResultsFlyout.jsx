import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import JSZip from 'jszip'
import { useI18n } from '../i18n/useI18n.js'

const FLYOUT_W = 400
const FLYOUT_TOP = 96

function getRightDockPos() {
  if (typeof window === 'undefined') return { x: 14, y: FLYOUT_TOP }
  const gutter = 14
  const maxX = Math.max(8, window.innerWidth - 380)
  const rightX = window.innerWidth - FLYOUT_W - gutter
  return {
    x: Math.min(Math.max(8, rightX), maxX),
    y: FLYOUT_TOP,
  }
}

function groupRows(rows, groupKey) {
  const map = new Map()
  ;(rows || []).forEach((r, idx) => {
    const k = String(groupKey(r) || '—')
    if (!map.has(k)) map.set(k, [])
    map.get(k).push({ ...r, _i: idx })
  })
  return map
}

function srWkid(sr) {
  if (!sr || typeof sr !== 'object') return null
  if (Number.isFinite(Number(sr.latestWkid))) return Number(sr.latestWkid)
  if (Number.isFinite(Number(sr.wkid))) return Number(sr.wkid)
  return null
}

function arcGisGeometryToGeoJson(geomJson) {
  if (!geomJson || typeof geomJson !== 'object') return null

  if (Number.isFinite(Number(geomJson.x)) && Number.isFinite(Number(geomJson.y))) {
    return {
      type: 'Point',
      coordinates: [Number(geomJson.x), Number(geomJson.y)],
    }
  }

  if (Array.isArray(geomJson.paths) && geomJson.paths.length) {
    if (geomJson.paths.length === 1) {
      return {
        type: 'LineString',
        coordinates: geomJson.paths[0],
      }
    }
    return {
      type: 'MultiLineString',
      coordinates: geomJson.paths,
    }
  }

  if (Array.isArray(geomJson.rings) && geomJson.rings.length) {
    return {
      type: 'Polygon',
      coordinates: geomJson.rings,
    }
  }

  if (
    Number.isFinite(Number(geomJson.xmin)) &&
    Number.isFinite(Number(geomJson.ymin)) &&
    Number.isFinite(Number(geomJson.xmax)) &&
    Number.isFinite(Number(geomJson.ymax))
  ) {
    const xmin = Number(geomJson.xmin)
    const ymin = Number(geomJson.ymin)
    const xmax = Number(geomJson.xmax)
    const ymax = Number(geomJson.ymax)
    return {
      type: 'Polygon',
      coordinates: [[[xmin, ymin], [xmin, ymax], [xmax, ymax], [xmax, ymin], [xmin, ymin]]],
    }
  }

  return null
}

function rowsToFeatureCollection(rows, groupField) {
  const features = []
  ;(rows || []).forEach((row, idx) => {
    const geom = arcGisGeometryToGeoJson(row?.geomJson)
    if (!geom) return
    const rowSr = srWkid(row?.geomJson?.spatialReference)
    features.push({
      type: 'Feature',
      geometry: geom,
      properties: {
        row_index: idx + 1,
        group: String(row?.[groupField] || row?.layer || row?.label || '—'),
        distance_m: row?.dM != null ? Number(row.dM) : null,
        theme: row?.theme || null,
        sr_wkid: rowSr,
      },
    })
  })
  return {
    type: 'FeatureCollection',
    features,
  }
}

function zipTs() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

export default function ResultsFlyout() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [pos, setPos] = useState(() => getRightDockPos())
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
      setPos(getRightDockPos())
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
    const inset = Math.round(FLYOUT_W + 12)
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

  useEffect(() => {
    function onResize() {
      setPos((prev) => {
        const maxX = Math.max(8, window.innerWidth - 380)
        const maxY = Math.max(8, window.innerHeight - 80)
        return {
          x: Math.min(Math.max(8, prev.x), maxX),
          y: Math.min(Math.max(56, prev.y), maxY),
        }
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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

  const classSetsForPayload = useCallback((p) => {
    const at = p?.atClickRows || []
    const nb = p?.nearbyRows || []
    return {
      click: new Set(groupRows(at, (r) => r.layer).keys()),
      near: new Set(groupRows(nb, (r) => r.label).keys()),
    }
  }, [])

  const latestSnapshotPayload = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (typeof window.msmeGisGetMapSelectionReportSnapshot !== 'function') return null
    const snap = window.msmeGisGetMapSelectionReportSnapshot()
    if (!snap) return null

    const clicks =
      Array.isArray(snap.clicks) && snap.clicks.length
        ? snap.clicks
        : [
            {
              clickIndex: 1,
              lat: snap.lat,
              lon: snap.lon,
              radiusM: snap.radiusM,
              atClickRows: snap.atClickRows || [],
              nearbyRows: snap.nearbyRows || [],
            },
          ]
    const last = clicks[clicks.length - 1] || {}
    return {
      lat: last.lat ?? snap.lat ?? null,
      lon: last.lon ?? snap.lon ?? null,
      radiusM: last.radiusM ?? snap.radiusM ?? 0,
      atClickRows: last.atClickRows || snap.atClickRows || [],
      nearbyRows: last.nearbyRows || snap.nearbyRows || [],
      clicks,
      accumulate: !!snap.accumulate,
    }
  }, [])

  useEffect(() => {
    const snapPayload = latestSnapshotPayload()
    if (!snapPayload) return
    const sets = classSetsForPayload(snapPayload)
    setPayload((prev) => prev || snapPayload)
    setVisibleClick((prev) => (prev && prev.size ? prev : new Set(sets.click)))
    setVisibleNear((prev) => (prev && prev.size ? prev : new Set(sets.near)))
  }, [classSetsForPayload, latestSnapshotPayload])

  const downloadSelectionZip = useCallback(async (payloadOverride = null, classSetsOverride = null) => {
    const sourcePayload = payloadOverride || payload
    if (!sourcePayload) return

    let selectedAtClickRows = (sourcePayload.atClickRows || []).filter((r) =>
      visibleClick.has(String(r?.layer || '—')),
    )
    let selectedNearbyRows = (sourcePayload.nearbyRows || []).filter((r) =>
      visibleNear.has(String(r?.label || '—')),
    )

    const activeClickSet = classSetsOverride?.click || visibleClick
    const activeNearSet = classSetsOverride?.near || visibleNear

    selectedAtClickRows = activeClickSet && activeClickSet.size
      ? (sourcePayload.atClickRows || []).filter((r) => activeClickSet.has(String(r?.layer ?? '')))
      : (sourcePayload.atClickRows || [])

    selectedNearbyRows = activeNearSet && activeNearSet.size
      ? (sourcePayload.nearbyRows || []).filter((r) => activeNearSet.has(String(r?.label ?? '')))
      : (sourcePayload.nearbyRows || [])

    if (!selectedAtClickRows.length && !selectedNearbyRows.length) {
      window.alert('No selected rows to export. Please keep at least one class checked.')
      return
    }

    const clicks =
      Array.isArray(sourcePayload.clicks) && sourcePayload.clicks.length
        ? sourcePayload.clicks
        : [
            {
              clickIndex: 1,
              lat: sourcePayload.lat,
              lon: sourcePayload.lon,
              radiusM: sourcePayload.radiusM,
              atClickRows: sourcePayload.atClickRows || [],
              nearbyRows: sourcePayload.nearbyRows || [],
            },
          ]

    const zip = new JSZip()
    const generatedAt = new Date().toISOString()
    const summary = {
      generatedAt,
      source: 'MSME GIS map selection',
      currentView: {
        lat: sourcePayload.lat ?? null,
        lon: sourcePayload.lon ?? null,
        radiusM: sourcePayload.radiusM ?? null,
        selectedAtClickCount: selectedAtClickRows.length,
        selectedNearbyCount: selectedNearbyRows.length,
        visibleAtClickClasses: Array.from((activeClickSet || new Set()).values()),
        visibleNearbyClasses: Array.from((activeNearSet || new Set()).values()),
      },
      allClicks: {
        count: clicks.length,
        atClickCount: clicks.reduce((sum, c) => sum + ((c.atClickRows || []).length || 0), 0),
        nearbyCount: clicks.reduce((sum, c) => sum + ((c.nearbyRows || []).length || 0), 0),
      },
    }

    zip.file('README.txt', [
      'MSME GIS selection export',
      '',
      'Folders:',
      '- current-view: currently selected rows from the results panel (class checkboxes).',
      '- all-clicks: all identify clicks included in this map selection session.',
      '',
      'Files include JSON rows and GeoJSON (where geometry is available).',
    ].join('\n'))

    zip.file('summary.json', JSON.stringify(summary, null, 2))

    zip.file('current-view/at-click.json', JSON.stringify(selectedAtClickRows, null, 2))
    zip.file('current-view/nearby.json', JSON.stringify(selectedNearbyRows, null, 2))
    zip.file(
      'current-view/at-click.geojson',
      JSON.stringify(rowsToFeatureCollection(selectedAtClickRows, 'layer'), null, 2),
    )
    zip.file(
      'current-view/nearby.geojson',
      JSON.stringify(rowsToFeatureCollection(selectedNearbyRows, 'label'), null, 2),
    )

    clicks.forEach((click, i) => {
      const prefix = `all-clicks/click-${String(i + 1).padStart(2, '0')}`
      const atRows = click.atClickRows || []
      const nearRows = click.nearbyRows || []
      zip.file(`${prefix}-meta.json`, JSON.stringify({
        clickIndex: click.clickIndex ?? i + 1,
        lat: click.lat ?? null,
        lon: click.lon ?? null,
        radiusM: click.radiusM ?? null,
        atClickCount: atRows.length,
        nearbyCount: nearRows.length,
      }, null, 2))
      zip.file(`${prefix}-at-click.json`, JSON.stringify(atRows, null, 2))
      zip.file(`${prefix}-nearby.json`, JSON.stringify(nearRows, null, 2))
      zip.file(`${prefix}-at-click.geojson`, JSON.stringify(rowsToFeatureCollection(atRows, 'layer'), null, 2))
      zip.file(`${prefix}-nearby.geojson`, JSON.stringify(rowsToFeatureCollection(nearRows, 'label'), null, 2))
    })

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `map-selection-${zipTs()}.zip`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [payload, visibleClick, visibleNear])

  const canShowFlyout = open && !!payload

  const handleMapExportFab = useCallback(() => {
    if (payload) {
      void downloadSelectionZip(payload)
      return
    }

    const snapPayload = latestSnapshotPayload()
    if (!snapPayload) {
      window.alert('Map par feature select karo, phir notebook button se download karo.')
      return
    }

    const sets = classSetsForPayload(snapPayload)
    setPayload(snapPayload)
    setVisibleClick(new Set(sets.click))
    setVisibleNear(new Set(sets.near))
    void downloadSelectionZip(snapPayload, sets)
  }, [classSetsForPayload, downloadSelectionZip, latestSnapshotPayload, payload])

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
        width: FLYOUT_W,
        maxHeight: minimized ? 44 : 'min(78vh, 620px)',
      }

  const { lat, lon, atClickRows = [], nearbyRows = [], radiusM = 0 } = payload || {}

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

  const canExportNow = !!payload || !!latestSnapshotPayload()

  return (
    <>
      {/* <button
        type="button"
        className={`map-export-fab ${canExportNow ? '' : 'is-disabled'}`}
        title={canExportNow ? 'Download selected as ZIP' : 'Select map features first'}
        onClick={handleMapExportFab}
      >
        <svg viewBox="0 0 24 24" className="map-export-fab-ico" aria-hidden="true" focusable="false">
          <path
            d="M6 3h9l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M15 3v4h4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 10h8M8 13h8M8 16h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <span className="visually-hidden">Download selected as ZIP</span>
      </button> */}

      {canShowFlyout && (
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
            className="winbtn winbtn-zip"
            title="Download selected as ZIP"
            onClick={() => {
              void downloadSelectionZip()
            }}
          >
            <span className="winbtn-glyph" aria-hidden="true">📓</span>
            <span className="visually-hidden">Download selected as ZIP</span>
          </button>
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
      )}
    </>
  )
}
