import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '../i18n/useI18n.js'

function aggregateTheme(rows, keyField) {
  const out = {}
  ;(rows || []).forEach((row) => {
    const theme = row?.theme || 'other'
    if (!out[theme]) out[theme] = { total: 0, byName: {} }
    const name = String(row?.[keyField] || '—')
    out[theme].total += 1
    out[theme].byName[name] = (out[theme].byName[name] || 0) + 1
  })
  return out
}

function buildThemeSections(snap, t, keyPrefix = 'k') {
  const themes = [
    { key: 'base', label: t('reportSecBase') },
    { key: 'env', label: t('reportSecEnv') },
    { key: 'inv', label: t('reportSecInv') },
    { key: 'social', label: t('reportSecSocial') },
    { key: 'trans', label: t('reportSecTrans') },
    { key: 'util', label: t('reportSecUtil') },
    { key: 'cad', label: t('reportSecCadHits') },
    { key: 'con', label: t('reportSecConst') },
    { key: 'admin', label: t('reportSecAdminHits') },
  ]

  const clickAgg = aggregateTheme(snap?.atClickRows || [], 'layer')
  const nearAgg = aggregateTheme(snap?.nearbyRows || [], 'label')
  const sections = []

  themes.forEach(({ key, label }) => {
    const ca = clickAgg[key]
    const na = nearAgg[key]
    if (!ca && !na) return

    const rows = []
    function renderTable(title, agg) {
      if (!agg || !agg.total) return
      rows.push(
        <p key={`p-${title}`} className="lr-count">
          <strong>{title}</strong> — {t('reportCount')}: {agg.total}
        </p>,
      )
      const names = Object.keys(agg.byName).sort()
      if (!names.length) return
      rows.push(
        <table key={`t-${title}`} className="lr-table">
          <thead>
            <tr>
              <th>{t('reportFeatureClass')}</th>
              <th>{t('reportQty')}</th>
            </tr>
          </thead>
          <tbody>
            {names.map((n) => (
              <tr key={n}>
                <td>{n}</td>
                <td>{agg.byName[n]}</td>
              </tr>
            ))}
          </tbody>
        </table>,
      )
    }

    renderTable(t('reportAtClick'), ca)
    renderTable(t('reportNearby'), na)
    if (!rows.length) return

    sections.push(
      <section key={`${keyPrefix}-theme-${key}`} className="lr-sec">
        <h3>{label}</h3>
        {rows}
      </section>,
    )
  })

  const forestHits = Number(clickAgg?.env?.total || 0) + Number(nearAgg?.env?.total || 0)
  sections.push(
    <section key={`${keyPrefix}-forest`} className="lr-sec">
      <h3>{t('reportForestNote')}</h3>
      <p>{forestHits > 0 ? `${t('reportForestHits')} ${forestHits}` : t('reportForestNo')}</p>
    </section>,
  )

  return sections
}

export default function LandLocationReport() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('aoi')

  const [aoiSnap, setAoiSnap] = useState(() =>
    typeof window !== 'undefined' && window.msmeGisGetAoiLandReportSnapshot
      ? window.msmeGisGetAoiLandReportSnapshot()
      : null,
  )
  const [mapSnap, setMapSnap] = useState(() =>
    typeof window !== 'undefined' && window.msmeGisGetMapSelectionReportSnapshot
      ? window.msmeGisGetMapSelectionReportSnapshot()
      : null,
  )
  const [analysisSnap, setAnalysisSnap] = useState(() =>
    typeof window !== 'undefined' && window.msmeGisGetAnalysisReportSnapshot
      ? window.msmeGisGetAnalysisReportSnapshot()
      : null,
  )

  const refreshSnapshots = useCallback(() => {
    if (typeof window === 'undefined') return
    if (window.msmeGisGetAoiLandReportSnapshot) setAoiSnap(window.msmeGisGetAoiLandReportSnapshot())
    if (window.msmeGisGetMapSelectionReportSnapshot) setMapSnap(window.msmeGisGetMapSelectionReportSnapshot())
    if (window.msmeGisGetAnalysisReportSnapshot) setAnalysisSnap(window.msmeGisGetAnalysisReportSnapshot())
  }, [])

  useEffect(() => {
    function onAnySnapshot() {
      refreshSnapshots()
    }
    window.addEventListener('msme-aoi-land-report-snapshot', onAnySnapshot)
    window.addEventListener('msme-map-selection-report-snapshot', onAnySnapshot)
    window.addEventListener('msme-analysis-report-snapshot', onAnySnapshot)
    return () => {
      window.removeEventListener('msme-aoi-land-report-snapshot', onAnySnapshot)
      window.removeEventListener('msme-map-selection-report-snapshot', onAnySnapshot)
      window.removeEventListener('msme-analysis-report-snapshot', onAnySnapshot)
    }
  }, [refreshSnapshots])

  const blocks = []

  if (tab === 'analysis') {
    if (analysisSnap) {
      blocks.push(
        <section key="analysis-summary" className="lr-sec">
          <p className="lr-meta lr-hint">{t('reportAnalysisHint')}</p>
          <p className="lr-meta">
            <strong>{t('reportGenerated')}</strong> {analysisSnap.generatedAt || '—'}
          </p>
          {analysisSnap.tool != null ? (
            <p className="lr-meta">
              <strong>Tool</strong> {String(analysisSnap.tool)}
            </p>
          ) : null}
          {analysisSnap.summary != null ? (
            <p className="lr-body-text">{String(analysisSnap.summary)}</p>
          ) : null}
          {analysisSnap.count != null ? (
            <p className="lr-meta">
              <strong>{t('reportCount')}</strong> {analysisSnap.count}
            </p>
          ) : null}
        </section>,
      )
    } else {
      blocks.push(
        <p key="analysis-empty" className="lr-empty">
          {t('reportAnalysisEmpty')}
        </p>,
      )
    }
  } else if (tab === 'aoi') {
    if (aoiSnap) {
      const lat = aoiSnap?.lat
      const lon = aoiSnap?.lon
      const rKm = aoiSnap?.radiusM != null ? (Number(aoiSnap.radiusM) / 1000).toFixed(2) : '—'
      const context = aoiSnap?.domContext || {}
      const adm = context?.administrative || {}
      const cad = context?.cadastral || {}

      blocks.push(
        <section key="aoi-hint" className="lr-sec">
          <p className="lr-meta lr-hint">{t('reportAoiHint')}</p>
        </section>,
      )
      blocks.push(
        <section key="aoi-header" className="lr-sec">
          <h3>{t('reportTabAoi')}</h3>
          {aoiSnap.selectionSource ? (
            <p className="lr-meta">
              <strong>{t('reportSelectionSource')}</strong> {String(aoiSnap.selectionSource)}
            </p>
          ) : null}
          <p className="lr-meta">
            <strong>{t('reportGenerated')}</strong> {aoiSnap.generatedAt || '—'}
          </p>
          <p className="lr-meta">
            <strong>{t('reportCoordinates')}</strong> {typeof lat === 'number' ? lat.toFixed(6) : '—'}°,{' '}
            {typeof lon === 'number' ? lon.toFixed(6) : '—'}° · {t('reportSearchRadius')} {rKm} km
          </p>
        </section>,
      )
      blocks.push(
        <section key="aoi-admin" className="lr-sec">
          <h3>{t('reportSecAdmin')}</h3>
          <ul className="lr-list">
            <li>
              <strong>{t('state')}:</strong> {adm.state || '—'}
            </li>
            <li>
              <strong>{t('district')}:</strong> {adm.district || '—'}
            </li>
            <li>
              <strong>{t('tehsil')}:</strong> {adm.tehsil || '—'}
            </li>
            <li>
              <strong>{t('village')}:</strong> {adm.village || '—'}
            </li>
          </ul>
        </section>,
      )
      blocks.push(
        <section key="aoi-cad" className="lr-sec">
          <h3>{t('reportSecCad')}</h3>
          <ul className="lr-list">
            <li>
              <strong>{t('cadDistrict')}:</strong> {cad.district || '—'}
            </li>
            <li>
              <strong>{t('cadTehsil')}:</strong> {cad.tehsil || '—'}
            </li>
            <li>
              <strong>{t('cadVillage')}:</strong> {cad.village || '—'}
            </li>
            <li>
              <strong>{t('cadMuraba')}:</strong> {cad.muraba || '—'}
            </li>
            <li>
              <strong>{t('cadKhasra')}:</strong> {cad.khasra || '—'}
            </li>
          </ul>
        </section>,
      )
    } else {
      blocks.push(
        <p key="aoi-empty" className="lr-empty">
          {t('dashboardHint')}
        </p>,
      )
    }
  } else if (tab === 'map') {
    if (mapSnap) {
      const clicks =
        Array.isArray(mapSnap.clicks) && mapSnap.clicks.length
          ? mapSnap.clicks
          : [
              {
                clickIndex: 1,
                lat: mapSnap.lat,
                lon: mapSnap.lon,
                radiusM: mapSnap.radiusM,
                atClickRows: mapSnap.atClickRows,
                nearbyRows: mapSnap.nearbyRows,
              },
            ]
      blocks.push(
        <section key="map-hint" className="lr-sec">
          <p className="lr-meta lr-hint">{t('reportMapHint')}</p>
          {mapSnap.accumulate ? (
            <p className="lr-meta">
              <strong>Multi-select</strong> on ({clicks.length} click{clicks.length === 1 ? '' : 's'})
            </p>
          ) : null}
        </section>,
      )

      clicks.forEach((clickData, idx) => {
        const lat = clickData?.lat
        const lon = clickData?.lon
        const rKm = clickData?.radiusM != null ? (Number(clickData.radiusM) / 1000).toFixed(2) : '—'
        const clickNo = clickData?.clickIndex || idx + 1
        const headerSuffix =
          clicks.length > 1 ? ` · ${t('reportAtClick')} ${Number.isFinite(clickNo) ? clickNo : idx + 1}` : ''

        blocks.push(
          <section key={`map-head-${idx}`} className="lr-sec">
            <h3>
              {t('reportTabMap')}
              {headerSuffix}
            </h3>
            {mapSnap.selectionSource && idx === 0 ? (
              <p className="lr-meta">
                <strong>{t('reportSelectionSource')}</strong> {String(mapSnap.selectionSource)}
              </p>
            ) : null}
            <p className="lr-meta">
              <strong>{t('reportGenerated')}</strong> {mapSnap.generatedAt || '—'}
            </p>
            <p className="lr-meta">
              <strong>{t('reportCoordinates')}</strong> {typeof lat === 'number' ? lat.toFixed(6) : '—'}°,{' '}
              {typeof lon === 'number' ? lon.toFixed(6) : '—'}° · {t('reportSearchRadius')} {rKm} km
            </p>
          </section>,
        )
        blocks.push(
          ...buildThemeSections(
            { atClickRows: clickData?.atClickRows || [], nearbyRows: clickData?.nearbyRows || [] },
            t,
            `map-${idx}`,
          ),
        )
      })
    } else {
      blocks.push(
        <p key="map-empty" className="lr-empty">
          {t('reportClickFirst')}
        </p>,
      )
    }
  }

  function copyReportText() {
    const root = document.getElementById('landReportPrintRoot')
    if (!root) return
    const text = root.innerText || ''
    if (!text.trim()) return
    if (navigator?.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  return (
    <>
      <button
        type="button"
        className="land-report-fab"
        title={t('reportOpen')}
        aria-label={t('reportOpen')}
        onClick={() => {
          refreshSnapshots()
          setOpen(true)
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden focusable="false">
          <rect x="5" y="3.5" width="14" height="17" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8" y1="11.5" x2="16" y2="11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8" y1="15" x2="13.5" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="9" y="2" width="6" height="3.2" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      {open ? (
        <div
          className="land-report-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="landReportTitle"
          onClick={() => setOpen(false)}
        >
          <div className="land-report-panel" onClick={(e) => e.stopPropagation()}>
            <div className="land-report-head">
              <h2 id="landReportTitle">{t('reportSecTitle')}</h2>
              <div className="land-report-actions">
                <button type="button" className="btn-ghost" onClick={copyReportText}>
                  {t('reportCopy')}
                </button>
                <button type="button" className="btn-ghost" onClick={() => window.print()}>
                  {t('reportPrint')}
                </button>
                <button type="button" className="ap-close" onClick={() => setOpen(false)} aria-label={t('closePanel')}>
                  ×
                </button>
              </div>
            </div>

            <div className="land-report-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'aoi'}
                className={tab === 'aoi' ? 'lr-tab active' : 'lr-tab'}
                onClick={() => {
                  refreshSnapshots()
                  setTab('aoi')
                }}
              >
                {t('reportTabAoi')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'map'}
                className={tab === 'map' ? 'lr-tab active' : 'lr-tab'}
                onClick={() => {
                  refreshSnapshots()
                  setTab('map')
                }}
              >
                {t('reportTabMap')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'analysis'}
                className={tab === 'analysis' ? 'lr-tab active' : 'lr-tab'}
                onClick={() => {
                  refreshSnapshots()
                  setTab('analysis')
                }}
              >
                {t('reportTabAnalysis')}
              </button>
            </div>

            <div id="landReportPrintRoot" className="land-report-body">
              {blocks}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
