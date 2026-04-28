import React, { useEffect, useMemo, useState } from 'react'
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

  return parseIsoMs(analysisSnap && analysisSnap.generatedAt) >=
    parseIsoMs(mapSnap && mapSnap.generatedAt)
    ? analysisSnap
    : mapSnap
}

function isCommunitySummaryCandidate(reportSnap) {
  if (!reportSnap) return false
  if (reportSnap.communitySummary) return true
  if (reportSnap.reportKind === 'map-selection') return true
  if (
    reportSnap.reportKind === 'analysis' &&
    String(reportSnap.tool || '').toLowerCase() === 'buffer'
  ) {
    return true
  }

  return false
}

const LOADING_ROWS = [
  { key: 'schools', label: 'Schools' },
  { key: 'iti', label: 'ITI' },
  { key: 'hospitals', label: 'Hospitals' },
  { key: 'electricPoles', label: 'Electric poles' },
  { key: 'roads', label: 'Roads' },
  { key: 'airports', label: 'Airports' },
  { key: 'mobileTowers', label: 'Mobile towers' },
  { key: 'canals', label: 'Canals' },
  { key: 'entertainment', label: 'Entertainment' },
]

const CATEGORY_COLORS = [
  '#9b7ad6',
  '#e56292',
  '#ef4444',
  '#f97316',
  '#d8923a',
  '#4f89db',
  '#2f8f83',
  '#6c68cf',
  '#d36d48',
  '#556270',
]

const CATEGORY_DESCRIPTIONS = {
  schools: 'Nearby schools and education infrastructure in the selected area',
  iti: 'Industrial training institutes close to your selected point or buffer',
  hospitals: 'Hospitals and healthcare facilities available near the selected area',
  electricpoles: 'Electric power distribution points available around the location',
  roads: 'Road accessibility and transport links around your selected area',
  airports: 'Closest aviation connectivity points for passenger and cargo movement',
  mobiletowers: 'Telecom tower availability supporting network coverage nearby',
  canals: 'Canal and waterway infrastructure in and around the selected area',
  entertainment: 'Entertainment and leisure destinations around your selected area',
}

function getCategoryColor(index) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}

function getCategoryDescription(row) {
  var key = String(row && row.key ? row.key : '').toLowerCase()
  if (CATEGORY_DESCRIPTIONS[key]) return CATEGORY_DESCRIPTIONS[key]
  return 'Nearby places and infrastructure relevant to your selected location'
}

function getLocationLabel(summary, report) {
  if (summary && summary.locationName) return String(summary.locationName)
  if (summary && summary.locationLabel) return String(summary.locationLabel)
  if (report && report.locationName) return String(report.locationName)
  if (report && report.locationLabel) return String(report.locationLabel)
  if (report && report.title) return String(report.title)
  return 'Selected area'
}

function getCategoryItems(row) {
  if (!row) return []

  if (Array.isArray(row.items)) return row.items
  if (Array.isArray(row.features)) return row.features
  if (Array.isArray(row.list)) return row.list

  return []
}

function getItemName(item, fallbackIndex) {
  if (!item) return `Location ${fallbackIndex + 1}`

  return (
    item.name ||
    item.Name ||
    item.label ||
    item.title ||
    item.hospitalName ||
    item.hospital_name ||
    item.schoolName ||
    item.school_name ||
    item.instituteName ||
    item.institute_name ||
    item.itiName ||
    item.iti_name ||
    item.properties?.name ||
    item.properties?.Name ||
    item.properties?.label ||
    item.properties?.title ||
    item.properties?.hospitalName ||
    item.properties?.hospital_name ||
    item.properties?.HOSPITAL_NAME ||
    item.properties?.schoolName ||
    item.properties?.school_name ||
    item.properties?.SCHOOL_NAME ||
    item.properties?.instituteName ||
    item.properties?.institute_name ||
    item.properties?.itiName ||
    item.properties?.iti_name ||
    `Location ${fallbackIndex + 1}`
  )
}

function getItemCoordinates(item) {
  if (!item) return null

  var attrs = item.attributes || {}
  var props = item.properties || {}

  var lat =
    item.lat ??
    item.latitude ??
    item.Lat ??
    item.LAT ??
    item.y ??
    item.Latitude ??
    item.LATITUDE ??
    item.latitute ??
    item.LATITUTE ??
    item.lattitude ??
    item.LATTITUDE ??
    item.geometry?.y ??
    item.geometry?.latitude ??
    attrs.lat ??
    attrs.latitude ??
    attrs.Lat ??
    attrs.LAT ??
    attrs.y ??
    attrs.Latitude ??
    attrs.LATITUDE ??
    attrs.latitute ??
    attrs.LATITUTE ??
    attrs.lattitude ??
    attrs.LATTITUDE ??
    props.lat ??
    props.latitude ??
    props.Lat ??
    props.LAT ??
    props.y ??
    props.Latitude ??
    props.LATITUDE ??
    props.latitute ??
    props.LATITUTE ??
    props.lattitude ??
    props.LATTITUDE

  var lng =
    item.lng ??
    item.lon ??
    item.long ??
    item.LONG ??
    item.longitude ??
    item.Long ??
    item.Lon ??
    item.LON ??
    item.x ??
    item.Longitude ??
    item.LONGITUDE ??
    item.geometry?.x ??
    item.geometry?.longitude ??
    attrs.lng ??
    attrs.lon ??
    attrs.long ??
    attrs.LONG ??
    attrs.longitude ??
    attrs.Long ??
    attrs.Lon ??
    attrs.LON ??
    attrs.x ??
    attrs.Longitude ??
    attrs.LONGITUDE ??
    props.lng ??
    props.lon ??
    props.long ??
    props.LONG ??
    props.longitude ??
    props.Long ??
    props.Lon ??
    props.LON ??
    props.x ??
    props.Longitude ??
    props.LONGITUDE

  if (
    (lat === undefined || lng === undefined) &&
    item.geometry &&
    Array.isArray(item.geometry.coordinates)
  ) {
    lng = item.geometry.coordinates[0]
    lat = item.geometry.coordinates[1]
  }

  lat = Number(lat)
  lng = Number(lng)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    if (Math.abs(lng) <= 90 && Math.abs(lat) <= 180) {
      var swappedLat = lng
      var swappedLng = lat
      lat = swappedLat
      lng = swappedLng
    }
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null

  return { lat, lng }
}

export default function CommunitySummaryPanel() {
  const [analysisSnap, setAnalysisSnap] = useState(() =>
    typeof window !== 'undefined' &&
    typeof window.msmeGisGetAnalysisReportSnapshot === 'function'
      ? window.msmeGisGetAnalysisReportSnapshot()
      : null,
  )

  const [mapSnap, setMapSnap] = useState(() =>
    typeof window !== 'undefined' &&
    typeof window.msmeGisGetMapSelectionReportSnapshot === 'function'
      ? window.msmeGisGetMapSelectionReportSnapshot()
      : null,
  )

  const [open, setOpen] = useState(false)
  const [lastSummary, setLastSummary] = useState(null)
  const [openCategoryKey, setOpenCategoryKey] = useState(null)

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
    parseIsoMs(latestReport && latestReport.generatedAt) >
      parseIsoMs(displaySummary && displaySummary.generatedAt)

  useEffect(() => {
    if (summary) {
      setLastSummary(summary)
      setOpen(true)
    }
  }, [summary])

  useEffect(() => {
    if (isCommunitySummaryCandidate(latestReport)) {
      setOpen(true)
    }
  }, [latestReport])

  if (!open) return null
  if (!displaySummary && !waitingForCounts) return null

  const rows = Array.isArray(displaySummary && displaySummary.categories)
    ? displaySummary.categories
    : LOADING_ROWS

  const hasUnavailable = rows.some((r) => r && r.available === false)

  const totalCountNum = rows.reduce((sum, row) => {
    var value = row && Number.isFinite(Number(row.count)) ? Number(row.count) : 0
    return sum + value
  }, 0)

  const totalCount = displaySummary ? totalCountNum : '...'

  const updatedAt =
    displaySummary && displaySummary.generatedAt
      ? displaySummary.generatedAt
      : latestReport && latestReport.generatedAt

  const radiusM =
    displaySummary && displaySummary.radiusM
      ? displaySummary.radiusM
      : latestReport && latestReport.radiusM

  const locationLabel = getLocationLabel(displaySummary, latestReport)

  function handleCategoryClick(row) {
    var key = String(row && row.key ? row.key : '').toLowerCase()
    var supportsList =
      key === 'iti' || key === 'schools' || key === 'hospitals'

    if (!supportsList) return

    setOpenCategoryKey((current) => (current === key ? null : key))
  }

  function handleCategoryItemClick(item, categoryKey) {
    var coords = getItemCoordinates(item)
    var payload = {
      zoom: 16,
      category: categoryKey || 'location',
      item,
    }
    if (coords) {
      payload.lat = coords.lat
      payload.lng = coords.lng
    }

    window.dispatchEvent(
      new CustomEvent('msme-gis-zoom-to-location', {
        detail: payload,
      }),
    )
  }

  return (
    <aside
      className="community-summary-panel community-ba-panel"
      role="complementary"
      aria-label="Community counts"
    >
      <div className="community-ba-head">
        <h3>Business Analyst</h3>

        <div className="community-ba-head-actions">
          <button
            type="button"
            className="community-ba-icon-btn"
            aria-label="Collapse panel"
            onClick={() => setOpen(false)}
          >
            ^
          </button>
          <button
            type="button"
            className="community-ba-icon-btn"
            aria-label="Close summary"
            onClick={() => setOpen(false)}
          >
            x
          </button>
        </div>
      </div>

      <div className="community-ba-toolbar">
        <p className="community-ba-toolbar-title">What's in My Community?</p>
        <button type="button" className="community-ba-fit-btn">
          Fit width <span>v</span>
        </button>
      </div>

      <div className="community-summary-body">
        <div className="community-ba-intro-card">
          <div className="community-ba-intro-icon" aria-hidden="true">
            o
          </div>
          <div>
            <h4>What's in My Community?</h4>
            <p>Places that make your life richer and community better</p>
            <small>{locationLabel}</small>
          </div>
        </div>

        {waitingForCounts ? (
          <p className="community-summary-loading">
            {isStaleUpdating
              ? 'Updating latest counts...'
              : 'Loading community counts...'}
          </p>
        ) : null}

        <div className="community-ba-cards">
          {rows.map((row, idx) => {
            var count =
              row && Number.isFinite(Number(row.count)) ? Number(row.count) : 0
            var label = row && row.label ? row.label : 'Category'
            var key = String(row && row.key ? row.key : idx)
            var keyLower = key.toLowerCase()
            var showLoadingBadge = !displaySummary
            var color = getCategoryColor(idx)
            var supportsList =
              keyLower === 'iti' ||
              keyLower === 'schools' ||
              keyLower === 'hospitals'
            var isExpanded = openCategoryKey === keyLower
            var items = getCategoryItems(row)

            return (
              <section key={key} className="community-ba-card">
                <div className="community-ba-band community-ba-theme">
                  <h4 style={{ color }}>{label}</h4>
                </div>
                <div className="community-ba-band community-ba-desc">
                  {getCategoryDescription(row)}
                </div>

                <button
                  type="button"
                  className={`community-ba-band community-ba-count-band${
                    supportsList ? ' is-clickable' : ''
                  }`}
                  onClick={() => handleCategoryClick(row)}
                  disabled={!supportsList}
                >
                  <strong style={{ color }}>
                    {showLoadingBadge ? '...' : count}
                  </strong>
                  <span style={{ color }}>{label}</span>
                  {supportsList ? (
                    <small>{isExpanded ? 'Hide list ^' : 'View list v'}</small>
                  ) : null}
                </button>

                {supportsList && isExpanded ? (
                  <div className="community-iti-list-wrap">
                    {items.length > 0 ? (
                      <div className="community-iti-list">
                        {items.map((item, itemIdx) => {
                          var itemName = getItemName(item, itemIdx)
                          var coords = getItemCoordinates(item)

                          return (
                            <button
                              type="button"
                              key={String(
                                item.id || item.objectid || item.OBJECTID || itemIdx,
                              )}
                              className="community-iti-item"
                              onClick={(event) => {
                                event.stopPropagation()
                                handleCategoryItemClick(item, keyLower)
                              }}
                            >
                              <span>{itemName}</span>
                              <small>{coords ? 'Zoom' : 'Try zoom'}</small>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="community-iti-empty">{label} list available nahi hai.</p>
                    )}
                  </div>
                ) : null}
              </section>
            )
          })}
        </div>

        <p className="community-ba-footer-meta">
          Updated: {formatUpdatedAt(updatedAt)}
          {radiusM ? ` | Radius: ${radiusM} m` : ''}
          {` | Total: ${totalCount}`}
        </p>

        {hasUnavailable ? (
          <p className="community-summary-note">
            Some requested categories are not available as dedicated layers, so
            they appear as 0.
          </p>
        ) : null}
      </div>
    </aside>
  )
}
