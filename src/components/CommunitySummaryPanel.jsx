import { useEffect, useMemo, useState } from 'react'
import '../css/CommunitySummaryPanel.css'

function parseIsoMs(iso) {
  if (!iso) return 0
  var n = Date.parse(iso)
  return Number.isFinite(n) ? n : 0
}

function formatUpdatedAt(iso) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString()
  } catch (e0) {
    return String(iso)
  }
}

function pickLatestCommunitySummary(analysisSnap, mapSnap) {
  var a = analysisSnap && analysisSnap.communitySummary ? analysisSnap.communitySummary : null
  var m = mapSnap && mapSnap.communitySummary ? mapSnap.communitySummary : null
  if (!a && !m) return null
  if (a && !m) return a
  if (m && !a) return m
  return parseIsoMs(a.generatedAt) >= parseIsoMs(m.generatedAt) ? a : m
}

function pickLatestReportSnapshot(analysisSnap, mapSnap) {
  if (!analysisSnap && !mapSnap) return null
  if (analysisSnap && !mapSnap) return analysisSnap
  if (mapSnap && !analysisSnap) return mapSnap
  return parseIsoMs(analysisSnap && analysisSnap.generatedAt) >= parseIsoMs(mapSnap && mapSnap.generatedAt)
    ? analysisSnap
    : mapSnap
}

function isCommunitySummaryCandidate(reportSnap) {
  if (!reportSnap) return false
  if (reportSnap.communitySummary) return true
  if (reportSnap.reportKind === 'map-selection') return true
  if (reportSnap.reportKind === 'analysis' && String(reportSnap.tool || '').toLowerCase() === 'buffer') return true
  return false
}

const LOADING_ROWS = [
  { key: 'schools', label: 'Schools' },
  { key: 'iti', label: 'ITI' },
  { key: 'electricPoles', label: 'Electric poles' },
  { key: 'roads', label: 'Roads' },
  { key: 'airports', label: 'Airports' },
  { key: 'mobileTowers', label: 'Mobile towers' },
  { key: 'canals', label: 'Canals' },
  { key: 'entertainment', label: 'Entertainment' },
]

const CATEGORY_COLORS = [
  'linear-gradient(135deg, #2563eb, #1d4ed8)',
  'linear-gradient(135deg, #0d9488, #0f766e)',
  'linear-gradient(135deg, #7c3aed, #6d28d9)',
  'linear-gradient(135deg, #ea580c, #c2410c)',
  'linear-gradient(135deg, #0284c7, #0369a1)',
  'linear-gradient(135deg, #16a34a, #15803d)',
  'linear-gradient(135deg, #be123c, #9f1239)',
  'linear-gradient(135deg, #475569, #334155)',
]

function getCategoryColor(index) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}

export default function CommunitySummaryPanel() {
  const [analysisSnap, setAnalysisSnap] = useState(() =>
    typeof window !== 'undefined' && typeof window.msmeGisGetAnalysisReportSnapshot === 'function'
      ? window.msmeGisGetAnalysisReportSnapshot()
      : null,
  )

  const [mapSnap, setMapSnap] = useState(() =>
    typeof window !== 'undefined' && typeof window.msmeGisGetMapSelectionReportSnapshot === 'function'
      ? window.msmeGisGetMapSelectionReportSnapshot()
      : null,
  )

  const [open, setOpen] = useState(false)
  const [lastSummary, setLastSummary] = useState(null)

  useEffect(() => {
    function refreshSnapshots() {
      if (typeof window === 'undefined') return
      if (typeof window.msmeGisGetAnalysisReportSnapshot === 'function') {
        setAnalysisSnap(window.msmeGisGetAnalysisReportSnapshot())
      }
      if (typeof window.msmeGisGetMapSelectionReportSnapshot === 'function') {
        setMapSnap(window.msmeGisGetMapSelectionReportSnapshot())
      }
    }

    window.addEventListener('msme-analysis-report-snapshot', refreshSnapshots)
    window.addEventListener('msme-map-selection-report-snapshot', refreshSnapshots)

    return () => {
      window.removeEventListener('msme-analysis-report-snapshot', refreshSnapshots)
      window.removeEventListener('msme-map-selection-report-snapshot', refreshSnapshots)
    }
  }, [])

  const summary = useMemo(
    () => pickLatestCommunitySummary(analysisSnap, mapSnap),
    [analysisSnap, mapSnap],
  )
  const latestReport = useMemo(
    () => pickLatestReportSnapshot(analysisSnap, mapSnap),
    [analysisSnap, mapSnap],
  )
  const waitingForCounts = !summary && isCommunitySummaryCandidate(latestReport)
  const displaySummary = summary || lastSummary
  const isStaleUpdating =
    waitingForCounts &&
    !!displaySummary &&
    parseIsoMs(latestReport && latestReport.generatedAt) > parseIsoMs(displaySummary && displaySummary.generatedAt)

  useEffect(() => {
    if (summary) {
      setLastSummary(summary)
      setOpen(true)
    }
  }, [summary])

  useEffect(() => {
    if (isCommunitySummaryCandidate(latestReport)) setOpen(true)
  }, [latestReport])

  if (!open) return null
  if (!displaySummary && !waitingForCounts) return null

  const rows = Array.isArray(displaySummary && displaySummary.categories)
    ? displaySummary.categories
    : LOADING_ROWS
  const sourceLabel = (displaySummary && displaySummary.source) === 'point' ? 'Point selection' : 'Buffer selection'
  const hasUnavailable = rows.some((r) => r && r.available === false)

  const totalCountNum = rows.reduce((sum, row) => {
    var value = row && Number.isFinite(Number(row.count)) ? Number(row.count) : 0
    return sum + value
  }, 0)
  const totalCount = displaySummary ? totalCountNum : '...'
  const updatedAt = displaySummary && displaySummary.generatedAt
    ? displaySummary.generatedAt
    : (latestReport && latestReport.generatedAt)
  const radiusM = displaySummary && displaySummary.radiusM
    ? displaySummary.radiusM
    : (latestReport && latestReport.radiusM)

  return (
    <aside className="community-summary-panel" role="complementary" aria-label="Community counts">
      <div className="community-summary-orb orb-1" />
      <div className="community-summary-orb orb-2" />

      <div className="community-summary-head">
        <div className="community-summary-title-wrap">
          <div className="community-summary-icon">C</div>
          <div>
            <h3>Community Counts</h3>
            <p className="community-summary-subtitle">Counts inside selected buffer or point</p>
          </div>
        </div>

        <button
          type="button"
          className="community-summary-close"
          aria-label="Close summary"
          onClick={() => setOpen(false)}
        >
          x
        </button>
      </div>

      <div className="community-summary-body">
        <div className="community-summary-stats">
          <div className="community-summary-stat-card">
            <span className="stat-label">Source</span>
            <strong>{sourceLabel}</strong>
          </div>

          <div className="community-summary-stat-card">
            <span className="stat-label">Updated</span>
            <strong>{formatUpdatedAt(updatedAt)}</strong>
          </div>

          {radiusM ? (
            <div className="community-summary-stat-card">
              <span className="stat-label">Radius</span>
              <strong>{radiusM} m</strong>
            </div>
          ) : null}

          <div className="community-summary-stat-card accent">
            <span className="stat-label">Total Count</span>
            <strong>{totalCount}</strong>
          </div>
        </div>

        {waitingForCounts ? (
          <p className="community-summary-loading">
            {isStaleUpdating ? 'Updating latest counts...' : 'Loading community counts...'}
          </p>
        ) : null}

        <div className="community-summary-table-wrap">
          <table className="community-summary-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                var count = row && Number.isFinite(Number(row.count)) ? Number(row.count) : 0
                var label = row && row.label ? row.label : 'Category'
                var showLoadingBadge = !displaySummary

                return (
                  <tr key={String(row && row.key ? row.key : idx)}>
                    <td>
                      <div className="community-category-cell">
                        <span
                          className="community-category-dot"
                          style={{ background: getCategoryColor(idx) }}
                        />
                        <span className="community-category-label">{label}</span>
                      </div>
                    </td>
                    <td>
                      {showLoadingBadge ? (
                        <span className="community-count-badge is-loading">...</span>
                      ) : (
                        <span className="community-count-badge">{count}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {hasUnavailable ? (
          <p className="community-summary-note">
            Some requested categories are not available as dedicated layers, so they appear as 0.
          </p>
        ) : null}
      </div>
    </aside>
  )
}
