import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  coercePlaceDetails,
  extractPointForPlaceLookup,
  mergePlaceDetails,
  queryPlaceDetailsByPointWgs84,
  resolvePlaceLookupPointFromGeometry,
} from '../gis/msme/placeDetailsHelpers.js'
import {
  autoSelectVidhanSabhaInUi,
  coerceAssemblyDetails,
  extractAssemblyGeometryCandidates,
  mergeAssemblyDetails,
  queryAssemblyDetailsByGeometry,
  queryAssemblyDetailsByPointWgs84,
} from '../gis/msme/assemblyDetailsHelpers.js'
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

function formatMeters(value) {
  var n = Number(value)
  if (!Number.isFinite(n) || n < 0) return ''
  return `${Math.round(n)} m`
}

function formatMetricValue(value, suffix) {
  if (value == null || value === '') return '-'
  var num = Number(value)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return `${num}${suffix || ''}`
    return `${num.toFixed(1)}${suffix || ''}`
  }
  return `${String(value)}${suffix || ''}`
}

function hasMetricValue(value) {
  return !(value == null || value === '')
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
  var countNum = Number(reportSnap.count)
  var hasCount = Number.isFinite(countNum) && countNum >= 0
  var nearestDistanceNum = Number(reportSnap.nearestDistanceM)
  var hasNearestDistance = Number.isFinite(nearestDistanceNum) && nearestDistanceNum >= 0
  var maxDistanceNum = Number(reportSnap.maxDistanceM)
  var hasMaxDistance = Number.isFinite(maxDistanceNum) && maxDistanceNum >= 0
  if (
    reportSnap.reportKind === 'analysis' &&
    String(reportSnap.tool || '').toLowerCase() === 'buffer'
  ) {
    return true
  }
  if (
    reportSnap.reportKind === 'analysis' &&
    String(reportSnap.tool || '').toLowerCase() === 'closest'
  ) {
    return !!(reportSnap.communitySummary || reportSnap.radiusM || hasCount || hasNearestDistance)
  }
  if (
    reportSnap.reportKind === 'analysis' &&
    String(reportSnap.tool || '').toLowerCase() === 'proximity'
  ) {
    return !!(reportSnap.communitySummary || reportSnap.radiusM || hasCount || hasMaxDistance)
  }

  return false
}

function shouldAutoOpenCommunityPanel(reportSnap) {
  if (!reportSnap) return false
  if (resolvePlaceDetails(null, reportSnap)) return true
  var isAnalysis = reportSnap.reportKind === 'analysis'
  var tool = String(reportSnap.tool || '').toLowerCase()
  if (isAnalysis && (tool === 'closest' || tool === 'proximity')) {
    var countNum = Number(reportSnap.count)
    var hasCount = Number.isFinite(countNum) && countNum >= 0
    var nearestDistanceNum = Number(reportSnap.nearestDistanceM)
    var hasNearestDistance = Number.isFinite(nearestDistanceNum) && nearestDistanceNum >= 0
    var maxDistanceNum = Number(reportSnap.maxDistanceM)
    var hasMaxDistance = Number.isFinite(maxDistanceNum) && maxDistanceNum >= 0
    return !!(reportSnap.communitySummary || hasCount || hasNearestDistance || hasMaxDistance)
  }
  return isCommunitySummaryCandidate(reportSnap)
}

const LOADING_ROWS = [
  { key: 'schools', label: 'Schools' },
  { key: 'iti', label: 'ITI' },
  { key: 'hospitals', label: 'Hospitals' },
  { key: 'governmentHospitals', label: 'Government Hospital' },
  { key: 'phcChc', label: 'PHC & CHC' },
  { key: 'aayushBharatFacilities', label: 'Aayush Bharat Facilites' },
  { key: 'privateHospitals', label: 'Private Hospital' },
  { key: 'electricPoles', label: 'Electric poles' },
  { key: 'electricStations', label: 'Electric Station' },
  { key: 'secUgElectricLineSegments', label: 'SecUG Electric Line Segment' },
  { key: 'roads', label: 'Roads' },
  { key: 'airports', label: 'Airports' },
  { key: 'mobileTowers', label: 'Mobile towers' },
  { key: 'policeStations', label: 'Police Station' },
  { key: 'industrialSites', label: 'Industrial Sites' },
  { key: 'proposedMetroStations', label: 'Proposed Metro Station' },
  { key: 'canals', label: 'Canals' },
  { key: 'hsvpPlots', label: 'HSVP Plots' },
  { key: 'hsvpSectorBoundary', label: 'HSVP Sector Boundary' },
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
  governmenthospitals: 'Government hospital facilities near your selected area',
  phcchc: 'PHC and CHC healthcare facilities near your selected area',
  aayushbharatfacilities: 'Aayush Bharat facilities available around your selected area',
  privatehospitals: 'Private hospital facilities near your selected area',
  electricpoles: 'Electric power distribution points available around the location',
  electricstations: 'Electric station infrastructure around the selected area',
  secugelectriclinesegments: 'Secondary underground electric line segments near the selected area',
  roads: 'Road accessibility and transport links around your selected area',
  airports: 'Closest aviation connectivity points for passenger and cargo movement',
  mobiletowers: 'Telecom tower availability supporting network coverage nearby',
  policestations: 'Police station points available around the selected area',
  industrialsites: 'Industrial site locations available near your selected area',
  proposedmetrostations: 'Planned metro station points near your selected area',
  canals: 'Canal and waterway infrastructure in and around the selected area',
  hsvpplots: 'HSVP plot features available around your selected area',
  hsvpsectorboundary: 'HSVP sector boundary features near your selected area',
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

/** Normalise API / config spelling variants for icon lookup. */
function normalizeCommunityCategoryKey(raw) {
  var k = String(raw || '').toLowerCase()
  if (k === 'aayushbharatfacilites') return 'aayushbharatfacilities'
  return k
}

/**
 * Category icons are chosen locally by `row.key` — community summary payloads
 * do not currently include per-row icons. Optional `row.iconUrl` is supported.
 */
function CommunityCategoryCardIcon(props) {
  var row = props.row
  var categoryKey = props.categoryKey
  var url = row && typeof row.iconUrl === 'string' ? String(row.iconUrl).trim() : ''
  if (url) {
    return (
      <img
        className="community-ba-card__icon-img"
        src={url}
        alt=""
        loading="lazy"
        decoding="async"
      />
    )
  }

  var k = normalizeCommunityCategoryKey(
    categoryKey != null ? categoryKey : row && row.key ? row.key : '',
  )

  var s = {
    stroke: 'white',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  }

  switch (k) {
    case 'schools':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M2 9l10-5 10 5v2l-10 5-10-5V9z" {...s} />
          <path d="M12 13v8" {...s} />
          <path d="M7 11.5L12 14l5-2.5" {...s} />
        </svg>
      )
    case 'iti':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M2 4h8a4 4 0 014 0h8v16H10a4 4 0 01-4-4V4z" {...s} />
          <path d="M12 4v16" {...s} />
        </svg>
      )
    case 'hospitals':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...s} />
          <path d="M12 8v8M8 12h8" {...s} />
        </svg>
      )
    case 'governmenthospitals':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M3 21h18" {...s} />
          <path d="M5 21V11h14v10" {...s} />
          <path d="M5 11l7-5 7 5" {...s} />
          <path d="M9 21v-4h6v4" {...s} />
        </svg>
      )
    case 'phcchc':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="1" {...s} />
          <path d="M12 9v6M9 12h6" {...s} />
        </svg>
      )
    case 'aayushbharatfacilities':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M12 21s-7-4.35-7-10a4 4 0 017-2 4 4 0 017 2c0 5.65-7 10-7 10z"
            fill="white"
            stroke="none"
          />
        </svg>
      )
    case 'privatehospitals':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M3 21h18" {...s} />
          <path d="M5 21V10l7-4 7 4v11" {...s} />
          <path d="M9 14h2v5H9zM13 14h2v5h-2z" {...s} />
        </svg>
      )
    case 'electricpoles':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M13 2L3 14h8l-2 8 10-12h-7l1-8z" {...s} />
        </svg>
      )
    case 'electricstations':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M6 21V9l2-1 2 1v12" {...s} />
          <path d="M14 21V6l2-1 2 1v15" {...s} />
          <path d="M4 21h16" {...s} />
        </svg>
      )
    case 'secugelectriclinesegments':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M3 12h18" {...s} />
          <path d="M6 8v8M12 8v8M18 8v8" strokeDasharray="2 2" {...s} />
        </svg>
      )
    case 'roads':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M6 3L4 21M18 3l2 18" {...s} />
          <path d="M8 10h8M7 14h10" {...s} />
        </svg>
      )
    case 'airports':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M21 15v-2l-7-3V7a1 1 0 00-2 0v3l-7 3v2l7-1v3l-2 1v1l3-1 3 1v-1l-2-1v-3l7 1z" {...s} />
        </svg>
      )
    case 'mobiletowers':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M12 2v20" {...s} />
          <path d="M8 6c0 2 8 2 8 0" {...s} />
          <path d="M7 12h10M6 18h12" {...s} />
        </svg>
      )
    case 'policestations':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...s} />
        </svg>
      )
    case 'industrialsites':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M4 22h16" {...s} />
          <path d="M6 22V10l4 2V8h8v14" {...s} />
          <path d="M10 14h1M14 14h1M10 18h1M14 18h1" {...s} />
        </svg>
      )
    case 'proposedmetrostations':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <rect x="5" y="5" width="14" height="13" rx="2" {...s} />
          <path d="M8 18h8" {...s} />
          <circle cx="9" cy="10" r="1" fill="white" stroke="none" />
          <circle cx="15" cy="10" r="1" fill="white" stroke="none" />
        </svg>
      )
    case 'canals':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" {...s} />
          <path d="M2 16c2.5 0 2.5-2 5-2s2.5 2 5 2" {...s} />
        </svg>
      )
    case 'hsvpplots':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" {...s} />
        </svg>
      )
    case 'hsvpsectorboundary':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="2" strokeDasharray="3 2" {...s} />
        </svg>
      )
    case 'entertainment':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 10h16M8 6v8M16 6v8" {...s} />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" {...s} />
          <path d="M9 22V12h6v10" {...s} />
        </svg>
      )
  }
}

function getLocationLabel(summary, report) {
  if (summary && summary.locationName) return String(summary.locationName)
  if (summary && summary.locationLabel) return String(summary.locationLabel)
  if (report && report.locationName) return String(report.locationName)
  if (report && report.locationLabel) return String(report.locationLabel)
  if (report && report.title) return String(report.title)
  return 'Selected area'
}

function resolvePlaceDetails(summary, report) {
  var candidates = []
  if (summary && summary.placeDetails) candidates.push(summary.placeDetails)
  if (summary && summary.domContext && summary.domContext.placeDetails) {
    candidates.push(summary.domContext.placeDetails)
  }
  if (report && report.placeDetails) candidates.push(report.placeDetails)
  if (report && report.domContext && report.domContext.placeDetails) {
    candidates.push(report.domContext.placeDetails)
  }
  if (report && Array.isArray(report.clicks) && report.clicks.length > 0) {
    var lastClick = report.clicks[report.clicks.length - 1]
    if (lastClick && lastClick.placeDetails) candidates.push(lastClick.placeDetails)
  }

  for (var i = 0; i < candidates.length; i += 1) {
    var details = coercePlaceDetails(candidates[i])
    if (details) return details
  }
  return null
}

function resolveAssemblyDetails(summary, report) {
  var candidates = []
  if (summary && summary.assemblyDetails) candidates.push(summary.assemblyDetails)
  if (summary && summary.domContext && summary.domContext.assemblyDetails) {
    candidates.push(summary.domContext.assemblyDetails)
  }
  if (report && report.assemblyDetails) candidates.push(report.assemblyDetails)
  if (report && report.domContext && report.domContext.assemblyDetails) {
    candidates.push(report.domContext.assemblyDetails)
  }
  if (report && Array.isArray(report.clicks) && report.clicks.length > 0) {
    var lastClick = report.clicks[report.clicks.length - 1]
    if (lastClick && lastClick.assemblyDetails) candidates.push(lastClick.assemblyDetails)
  }

  for (var i = 0; i < candidates.length; i += 1) {
    var details = coerceAssemblyDetails(candidates[i])
    if (details) return details
  }
  return null
}

function getCategoryItems(row) {
  if (!row) return []

  if (Array.isArray(row.items)) return row.items
  if (Array.isArray(row.features)) return row.features
  if (Array.isArray(row.list)) return row.list

  return []
}

function hasCategoryData(row) {
  if (!row) return false
  var count = Number(row.count)
  if (Number.isFinite(count) && count > 0) return true
  var rawCount = Number(row.rawCount)
  if (Number.isFinite(rawCount) && rawCount > 0) return true
  if (getCategoryItems(row).length > 0) return true
  if (row.nearestItem) return true
  return false
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

function csvEscape(value) {
  if (value == null) return ''
  var text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
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
  const [selectedCategoryKeys, setSelectedCategoryKeys] = useState([])
  const [runtimePlaceDetails, setRuntimePlaceDetails] = useState(null)
  const [runtimeAssemblyDetails, setRuntimeAssemblyDetails] = useState(null)
  const [resolvedLookupPoint, setResolvedLookupPoint] = useState(null)
  const placeLookupCacheRef = useRef({})
  const assemblyLookupCacheRef = useRef({})
  const autoAssemblySelectionRef = useRef('')

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

  useEffect(() => {
    function openFromExternalTrigger() {
      setOpen(true)
    }

    window.addEventListener('msme-community-panel-open', openFromExternalTrigger)
    return () => {
      window.removeEventListener('msme-community-panel-open', openFromExternalTrigger)
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

  const placeDetailsFromSnapshot = useMemo(
    () => resolvePlaceDetails(displaySummary, latestReport),
    [displaySummary, latestReport],
  )
  const directPlaceLookupPoint = useMemo(
    () => extractPointForPlaceLookup(displaySummary, latestReport),
    [displaySummary, latestReport],
  )
  const placeDetails = useMemo(
    () => mergePlaceDetails(placeDetailsFromSnapshot, runtimePlaceDetails),
    [placeDetailsFromSnapshot, runtimePlaceDetails],
  )
  const assemblyDetailsFromSnapshot = useMemo(
    () => resolveAssemblyDetails(displaySummary, latestReport),
    [displaySummary, latestReport],
  )
  const assemblyDetails = useMemo(
    () => mergeAssemblyDetails(assemblyDetailsFromSnapshot, runtimeAssemblyDetails),
    [assemblyDetailsFromSnapshot, runtimeAssemblyDetails],
  )
  const assemblyDistrictLabel = useMemo(
    () =>
      (assemblyDetails && assemblyDetails.district) || (placeDetails && placeDetails.district) || '-',
    [assemblyDetails, placeDetails],
  )
  const hasAssemblyMetricDetails = useMemo(() => {
    if (!assemblyDetails) return false
    return (
      hasMetricValue(assemblyDetails.proposedPolicy) ||
      hasMetricValue(assemblyDetails.intermediateAreaPct) ||
      hasMetricValue(assemblyDetails.coreAreaPct) ||
      hasMetricValue(assemblyDetails.subPrimeAreaPct) ||
      hasMetricValue(assemblyDetails.mcPct) ||
      hasMetricValue(assemblyDetails.existingIndustry)
    )
  }, [assemblyDetails])
  const hasAssemblyName = !!(assemblyDetails && assemblyDetails.vidhanSabha)

  const isStaleUpdating =
    waitingForCounts &&
    !!displaySummary &&
    parseIsoMs(latestReport && latestReport.generatedAt) >
      parseIsoMs(displaySummary && displaySummary.generatedAt)

  useEffect(() => {
    if (summary) {
      setLastSummary(summary)
      if (shouldAutoOpenCommunityPanel(latestReport)) {
        setOpen(true)
      }
      setSelectedCategoryKeys([])
    }
  }, [summary, latestReport])

  useEffect(() => {
    if (shouldAutoOpenCommunityPanel(latestReport)) {
      setOpen(true)
    }
  }, [latestReport])

  useEffect(() => {
    var cancelled = false
    if (directPlaceLookupPoint) {
      setResolvedLookupPoint(directPlaceLookupPoint)
      return () => {
        cancelled = true
      }
    }

    resolvePlaceLookupPointFromGeometry(displaySummary, latestReport).then((p) => {
      if (cancelled) return
      setResolvedLookupPoint(p || null)
    })

    return () => {
      cancelled = true
    }
  }, [displaySummary, latestReport, directPlaceLookupPoint])

  useEffect(() => {
    var cancelled = false

    if (placeDetailsFromSnapshot) {
      setRuntimePlaceDetails(null)
      return () => {
        cancelled = true
      }
    }

    if (!resolvedLookupPoint) {
      setRuntimePlaceDetails(null)
      return () => {
        cancelled = true
      }
    }

    var cacheKey = `${resolvedLookupPoint.lat.toFixed(6)},${resolvedLookupPoint.lon.toFixed(6)}`
    if (placeLookupCacheRef.current[cacheKey]) {
      setRuntimePlaceDetails(placeLookupCacheRef.current[cacheKey])
      return () => {
        cancelled = true
      }
    }

    queryPlaceDetailsByPointWgs84(resolvedLookupPoint).then((details) => {
      if (cancelled) return
      if (!details) {
        setRuntimePlaceDetails(null)
        return
      }
      placeLookupCacheRef.current[cacheKey] = details
      setRuntimePlaceDetails(details)
    })

    return () => {
      cancelled = true
    }
  }, [placeDetailsFromSnapshot, resolvedLookupPoint])

  useEffect(() => {
    var cancelled = false

    if (assemblyDetailsFromSnapshot) {
      setRuntimeAssemblyDetails(null)
      return () => {
        cancelled = true
      }
    }

    var geometryCandidates = extractAssemblyGeometryCandidates(displaySummary, latestReport)

    function tryGeometryFallback(onResolved) {
      if (!Array.isArray(geometryCandidates) || geometryCandidates.length === 0) {
        onResolved(null)
        return
      }
      var idx = 0
      function runNext() {
        if (cancelled) return
        if (idx >= geometryCandidates.length) {
          onResolved(null)
          return
        }
        var rawGeometry = geometryCandidates[idx]
        idx += 1
        queryAssemblyDetailsByGeometry(rawGeometry).then((details) => {
          if (cancelled) return
          if (details) {
            onResolved(details)
            return
          }
          runNext()
        })
      }
      runNext()
    }

    if (!resolvedLookupPoint) {
      tryGeometryFallback((details) => {
        if (cancelled) return
        setRuntimeAssemblyDetails(details || null)
      })
      return () => {
        cancelled = true
      }
    }

    var cacheKey = `${resolvedLookupPoint.lat.toFixed(6)},${resolvedLookupPoint.lon.toFixed(6)}`
    if (assemblyLookupCacheRef.current[cacheKey]) {
      setRuntimeAssemblyDetails(assemblyLookupCacheRef.current[cacheKey])
      return () => {
        cancelled = true
      }
    }

    queryAssemblyDetailsByPointWgs84(resolvedLookupPoint).then((details) => {
      if (cancelled) return
      if (details) {
        assemblyLookupCacheRef.current[cacheKey] = details
        setRuntimeAssemblyDetails(details)
        return
      }
      tryGeometryFallback((fallbackDetails) => {
        if (cancelled) return
        if (fallbackDetails) {
          assemblyLookupCacheRef.current[cacheKey] = fallbackDetails
          setRuntimeAssemblyDetails(fallbackDetails)
          return
        }
        setRuntimeAssemblyDetails(null)
      })
    })

    return () => {
      cancelled = true
    }
  }, [assemblyDetailsFromSnapshot, resolvedLookupPoint, displaySummary, latestReport])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.msmeGisSelectedCommunityCategoryKeys = selectedCategoryKeys.slice()
  }, [selectedCategoryKeys])

  const hasPlaceDetails = !!placeDetails
  const hasAssemblyDetails = !!assemblyDetails
  const placeCardShouldRender = useMemo(() => {
    if (hasPlaceDetails) return true
    if (!latestReport) return false
    if (latestReport.reportKind === 'map-selection') return true
    if (latestReport.reportKind !== 'analysis') return false
    var tool = String(latestReport.tool || '').toLowerCase()
    return tool === 'closest' || tool === 'proximity' || tool === 'buffer'
  }, [hasPlaceDetails, latestReport])
  const assemblyCardShouldRender = useMemo(() => {
    if (hasAssemblyDetails) return true
    if (!latestReport) return false
    if (latestReport.reportKind === 'map-selection') return true
    if (latestReport.reportKind !== 'analysis') return false
    var tool = String(latestReport.tool || '').toLowerCase()
    return tool === 'closest' || tool === 'proximity' || tool === 'buffer'
  }, [hasAssemblyDetails, latestReport])

  useEffect(() => {
    if (!assemblyDetails) return
    var key = `${assemblyDetails.vidhanSabhaCode || ''}|${assemblyDetails.vidhanSabha || ''}|${assemblyDetails.district || ''}`
    if (!key || key === '||') return
    if (autoAssemblySelectionRef.current === key) return
    autoAssemblySelectionRef.current = key
    autoSelectVidhanSabhaInUi(assemblyDetails)
  }, [assemblyDetails])

  if (!displaySummary && !waitingForCounts && !hasPlaceDetails && !hasAssemblyDetails) return null
  if (!open) {
    return (
      <button
        type="button"
        className="community-ba-reopen-btn"
        aria-label="Open community panel"
        title="Open community panel"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path
            d="M4 19V5M4 19h16M8 15V9l3 4 3-6 3 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )
  }

  const allRows = Array.isArray(displaySummary && displaySummary.categories)
    ? displaySummary.categories
    : LOADING_ROWS

  const rows = displaySummary ? allRows.filter((row) => hasCategoryData(row)) : allRows

  const hasUnavailable = allRows.some((r) => r && r.available === false)

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

  const selectableCategoryKeys = rows
    .map((row) => String(row && row.key ? row.key : '').toLowerCase())
    .filter((key) => key)
  const allSelected =
    selectableCategoryKeys.length > 0 &&
    selectableCategoryKeys.every((key) => selectedCategoryKeys.includes(key))
  const selectionHint = waitingForCounts
    ? 'Preparing actions...'
    : `${selectedCategoryKeys.length} selected of ${selectableCategoryKeys.length}`

  function handleDownloadCsv() {
    if (!displaySummary) return
    if (!selectedCategoryKeys.length) return
    var generatedAt = displaySummary.generatedAt || latestReport?.generatedAt || new Date().toISOString()
    var source = displaySummary.source || latestReport?.reportKind || 'community'
    var radius = radiusM != null ? Number(radiusM) : ''
    var csvRows = [
      [
        'category_key',
        'category_label',
        'count',
        'raw_count',
        'available',
        'item_index',
        'item_name',
        'location',
        'radius_m',
        'generated_at',
        'source',
      ],
    ]

    var selectedMap = {}
    selectedCategoryKeys.forEach((key) => {
      var k = String(key || '').toLowerCase()
      if (k) selectedMap[k] = true
    })
    var exportRows = rows.filter((row) => {
      var key = String(row?.key || '').toLowerCase()
      return !!selectedMap[key]
    })

    exportRows.forEach((row) => {
      var key = String(row?.key || '')
      var label = String(row?.label || '')
      var count = Number.isFinite(Number(row?.count)) ? Number(row.count) : ''
      var rawCount = Number.isFinite(Number(row?.rawCount)) ? Number(row.rawCount) : count
      var available = row?.available === false ? 'false' : 'true'
      var items = getCategoryItems(row)

      if (items.length > 0) {
        items.forEach((item, idx) => {
          var name = getItemName(item, idx)
          csvRows.push([
            key,
            label,
            count,
            rawCount,
            available,
            idx + 1,
            name,
            locationLabel,
            radius,
            generatedAt,
            source,
          ])
        })
        return
      }

      csvRows.push([
        key,
        label,
        count,
        rawCount,
        available,
        '',
        '',
        locationLabel,
        radius,
        generatedAt,
        source,
      ])
    })

    var csvText = csvRows.map((row) => row.map(csvEscape).join(',')).join('\n')
    var blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
    var url = URL.createObjectURL(blob)
    var stamp = new Date().toISOString().replace(/[:.]/g, '-')
    var a = document.createElement('a')
    a.href = url
    a.download = `community-summary-${stamp}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handlePrintPdf() {
    if (typeof window === 'undefined') return
    if (typeof window.msmeGisDownloadClosestPdf === 'function') {
      window.msmeGisDownloadClosestPdf()
      return
    }
    var legacyBtn = document.getElementById('btnClosestPdf')
    if (legacyBtn && typeof legacyBtn.click === 'function') legacyBtn.click()
  }

  function handleShowAllLinesOnMap() {
    if (!displaySummary || waitingForCounts) return
    if (!selectedCategoryKeys.length) return

    var combined = []
    var seen = {}
    var allowedKeys = {}
    selectedCategoryKeys.forEach((k) => {
      var key = String(k || '').toLowerCase()
      if (key) allowedKeys[key] = true
    })
    var allowedLabels = []
    rows.forEach((row) => {
      var keyLower = String(row && row.key ? row.key : '').toLowerCase()
      if (!allowedKeys[keyLower]) return
      if (row && row.label) allowedLabels.push(String(row.label))
      var focusItems = buildFocusItemsForRow(row, keyLower)
      focusItems.forEach((focusItem) => {
        var coords = getItemCoordinates(focusItem.item)
        if (!coords) return
        var name = focusItem.name
        var dedupeKey = `${keyLower}|${name}|${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`
        if (seen[dedupeKey]) return
        seen[dedupeKey] = true
        combined.push({
          name,
          lat: coords.lat,
          lng: coords.lng,
          category: keyLower,
          item: focusItem.item,
        })
      })
    })

    window.dispatchEvent(
      new CustomEvent('msme-gis-focus-community-category', {
        detail: {
          category: selectedCategoryKeys.length === 1 ? selectedCategoryKeys[0] : 'multi',
          label: allowedLabels.length > 0 ? allowedLabels.join(' + ') : 'selected categories',
          items: combined,
          total: combined.length,
        },
      }),
    )
  }

  function toggleCategorySelection(categoryKey) {
    var key = String(categoryKey || '').toLowerCase()
    if (!key) return
    setSelectedCategoryKeys((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key)
      }
      return current.concat(key)
    })
  }

  function buildFocusItemsForRow(row, categoryKey) {
    var keyLower = String(categoryKey || row?.key || '').toLowerCase()
    var focusItems = []
    var items = getCategoryItems(row)
    items.forEach((item, itemIdx) => {
      var coords = getItemCoordinates(item)
      if (!coords) return
      focusItems.push({
        name: getItemName(item, itemIdx),
        lat: coords.lat,
        lng: coords.lng,
        item,
        category: keyLower,
      })
    })

    if (focusItems.length > 0) return focusItems

    var nearestItem = row && row.nearestItem ? row.nearestItem : null
    var nearestCoords = getItemCoordinates(nearestItem)
    if (nearestItem && nearestCoords) {
      focusItems.push({
        name: getItemName(nearestItem, 0),
        lat: nearestCoords.lat,
        lng: nearestCoords.lng,
        item: nearestItem,
        category: keyLower,
      })
    }

    return focusItems
  }

  function handleCategoryClick(row) {
    var key = String(row && row.key ? row.key : '').toLowerCase()
    var items = getCategoryItems(row)
    var canExpandList = items.length > 0
    var focusItems = buildFocusItemsForRow(row, key)

    if (focusItems.length > 0) {
      window.dispatchEvent(
        new CustomEvent('msme-gis-focus-community-category', {
          detail: {
            category: key,
            label: row && row.label ? row.label : key,
            items: focusItems,
            total: focusItems.length,
          },
        }),
      )
    }

    if (canExpandList) {
      setOpenCategoryKey((current) => (current === key ? null : key))
    }
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

  function handleClearMapGraphics() {
    window.dispatchEvent(
      new CustomEvent('msme-gis-clear-community-graphics', {
        detail: { source: 'community-panel' },
      }),
    )
  }

  function handleSelectAllCategories() {
    if (waitingForCounts) return
    var seen = {}
    var keys = []
    rows.forEach((row) => {
      var key = String(row && row.key ? row.key : '').toLowerCase()
      if (!key || seen[key]) return
      seen[key] = true
      keys.push(key)
    })
    setSelectedCategoryKeys(keys)
  }

  function handleClearCategories() {
    setSelectedCategoryKeys([])
    setOpenCategoryKey(null)
    handleClearMapGraphics()
  }

  function handleClosePanel() {
    setOpen(false)
  }

  return (
    <aside
      className="community-summary-panel community-ba-panel"
      role="complementary"
      aria-label="Community counts"
    >
      <div className="community-ba-head">
        <div className="community-ba-head-brand">
          <span className="community-ba-head-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 15V9l3 4 3-6 3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h3>MSME REPORT</h3>
        </div>

        <div className="community-ba-head-actions">
          <button
            type="button"
            className="community-ba-icon-btn"
            aria-label="Collapse panel"
            onClick={handleClosePanel}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 15l6-6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="community-ba-icon-btn"
            aria-label="Close summary"
            onClick={handleClosePanel}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {placeCardShouldRender ? (
        <div className="community-ba-place-card" aria-label="Pinned place details">
          <h4 className="community-ba-place-card__title">Pinned Place Details</h4>
          <div className="community-ba-place-grid">
            <p>
              <strong>District</strong>
              <span>{(placeDetails && placeDetails.district) || '-'}</span>
            </p>
            <p>
              <strong>Tehsil</strong>
              <span>{(placeDetails && placeDetails.tehsil) || '-'}</span>
            </p>
            <p>
              <strong>Village</strong>
              <span>{(placeDetails && placeDetails.village) || '-'}</span>
            </p>
            <p>
              <strong>Block</strong>
              <span>{(placeDetails && placeDetails.block) || '-'}</span>
            </p>
            <p>
              <strong>Ward</strong>
              <span>{(placeDetails && placeDetails.ward) || '-'}</span>
            </p>
            <p>
              <strong>Pincode</strong>
              <span>{(placeDetails && placeDetails.pincode) || '-'}</span>
            </p>
          </div>
        </div>
      ) : null}

      {assemblyCardShouldRender ? (
        <div className="community-ba-assembly-card" aria-label="Vidhan Sabha profile">
          <h4 className="community-ba-place-card__title">Vidhan Sabha Profile</h4>
          <div className="community-ba-assembly-header">
            <p className="community-ba-assembly-name">
              {(assemblyDetails && assemblyDetails.vidhanSabha) || '-'}
            </p>
            <p className="community-ba-assembly-sub">
              District: {assemblyDistrictLabel}
            </p>
          </div>
          <div className="community-ba-assembly-grid">
            <article className="community-ba-assembly-metric">
              <strong>Proposed Policy</strong>
              <span>{(assemblyDetails && assemblyDetails.proposedPolicy) || '-'}</span>
            </article>
            <article className="community-ba-assembly-metric">
              <strong>Intermediate Area %</strong>
              <span>{formatMetricValue(assemblyDetails && assemblyDetails.intermediateAreaPct, '%')}</span>
            </article>
            <article className="community-ba-assembly-metric">
              <strong>Core Area %</strong>
              <span>{formatMetricValue(assemblyDetails && assemblyDetails.coreAreaPct, '%')}</span>
            </article>
            <article className="community-ba-assembly-metric">
              <strong>Sub Prime Area %</strong>
              <span>{formatMetricValue(assemblyDetails && assemblyDetails.subPrimeAreaPct, '%')}</span>
            </article>
            <article className="community-ba-assembly-metric">
              <strong>MC %</strong>
              <span>{formatMetricValue(assemblyDetails && assemblyDetails.mcPct, '%')}</span>
            </article>
            <article className="community-ba-assembly-metric">
              <strong>Existing Industry</strong>
              <span>{formatMetricValue(assemblyDetails && assemblyDetails.existingIndustry, '')}</span>
            </article>
          </div>
          {!hasAssemblyName ? (
            <p className="community-ba-assembly-note">
              Is clicked point par Vidhan Sabha match nahi mila (outside Haryana ho sakta hai).
            </p>
          ) : null}
          {hasAssemblyName && !hasAssemblyMetricDetails ? (
            <p className="community-ba-assembly-note">
              Detailed policy/area metrics is waqt map service me available nahi hain.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="community-ba-toolbar">
        <div className="community-ba-toolbar-meta">
          <span className="community-ba-toolbar-list-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div className="community-ba-toolbar-meta-text">
            <p className="community-ba-toolbar-title">POI Actions</p>
            <p className="community-ba-toolbar-subtitle">{selectionHint}</p>
          </div>
        </div>
        <div className="community-ba-toolbar-actions">
          <button
            type="button"
            className="community-ba-fit-btn community-ba-tool-btn community-ba-tool-btn--show"
            onClick={handleShowAllLinesOnMap}
            disabled={
              !displaySummary || waitingForCounts || selectedCategoryKeys.length === 0
            }
          >
            <span className="community-ba-tool-btn__ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="community-ba-tool-btn__lbl">Show all POI</span>
          </button>
          <button
            type="button"
            className="community-ba-fit-btn community-ba-clear-btn community-ba-tool-btn community-ba-tool-btn--clear"
            onClick={handleClearMapGraphics}
          >
            <span className="community-ba-tool-btn__ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="community-ba-tool-btn__lbl">Clear map</span>
          </button>
          <button
            type="button"
            className="community-ba-fit-btn community-ba-print-btn community-ba-tool-btn community-ba-tool-btn--print"
            onClick={handlePrintPdf}
            disabled={!displaySummary || waitingForCounts}
          >
            <span className="community-ba-tool-btn__ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path
                  d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="community-ba-tool-btn__lbl">Print</span>
          </button>
          <button
            type="button"
            className="community-ba-download-btn community-ba-download-btn-main community-ba-tool-btn community-ba-tool-btn--download"
            onClick={handleDownloadCsv}
            disabled={!displaySummary || waitingForCounts || selectedCategoryKeys.length === 0}
          >
            <span className="community-ba-tool-btn__ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path
                  d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="community-ba-tool-btn__lbl">Download CSV</span>
          </button>
        </div>
      </div>

      <div className="community-summary-body">
        <div className="community-ba-intro-card">
          <div className="community-ba-intro-icon" aria-hidden="true" />
          <div className="community-ba-intro-body">
            <h4>Nearby Community</h4>
            <div className="community-ba-intro-actions">
              <button
                type="button"
                className="community-ba-intro-chip-btn"
                onClick={handleSelectAllCategories}
                disabled={!rows.length || waitingForCounts || allSelected}
              >
                {allSelected ? 'All selected' : 'Select all'}
              </button>
              <button
                type="button"
                className="community-ba-intro-chip-btn community-ba-intro-chip-btn-clear"
                onClick={handleClearCategories}
              >
                Clear
              </button>
            </div>
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
            var items = getCategoryItems(row)
            var canExpandList = items.length > 0
            var canFocusCategory = buildFocusItemsForRow(row, keyLower).length > 0
            var isExpanded = openCategoryKey === keyLower
            var nearestItem = row && row.nearestItem ? row.nearestItem : null
            var nearestName =
              nearestItem && nearestItem.name ? String(nearestItem.name) : ''
            var nearestDistance = formatMeters(
              row && row.nearestDistanceM != null ? row.nearestDistanceM : null,
            )

            return (
              <section key={key} className="community-ba-card">
                <div className="community-ba-card__top">
                  <span
                    className="community-ba-card__icon"
                    style={{ background: color }}
                    aria-hidden="true"
                  >
                    <CommunityCategoryCardIcon row={row} categoryKey={keyLower} />
                  </span>
                  <label className="community-ba-select-check">
                    <input
                      type="checkbox"
                      checked={selectedCategoryKeys.includes(keyLower)}
                      onChange={(event) => {
                        event.stopPropagation()
                        toggleCategorySelection(keyLower)
                      }}
                    />
                  </label>
                </div>
                <h4 className="community-ba-card__title">{label}</h4>
                <p className="community-ba-desc">{getCategoryDescription(row)}</p>

                <button
                  type="button"
                  className={`community-ba-card__stat${canFocusCategory || canExpandList ? ' is-clickable' : ''}`}
                  onClick={() => handleCategoryClick(row)}
                  disabled={!canFocusCategory && !canExpandList}
                >
                  <strong style={{ color }}>{showLoadingBadge ? '...' : count}</strong>
                  <span style={{ color }}>{label}</span>
                  {canExpandList ? (
                    <span className="community-ba-card__view-pill">
                      {isExpanded ? 'Hide list' : 'View list'}
                      <span className="community-ba-card__view-chev" aria-hidden>
                        ›
                      </span>
                    </span>
                  ) : canFocusCategory ? (
                    <span className="community-ba-card__view-pill">Show line</span>
                  ) : null}
                </button>

                {nearestName ? (
                  <p className="community-ba-nearest">
                    Closest: {nearestName}
                    {nearestDistance ? ` (${nearestDistance})` : ''}
                  </p>
                ) : null}

                {canExpandList && isExpanded ? (
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
          <span className="community-ba-footer-meta__icon" aria-hidden="true">
            i
          </span>
          <span className="community-ba-footer-meta__text">
            Updated: {formatUpdatedAt(updatedAt)}
            {radiusM ? ` | Radius: ${radiusM} m` : ''}
            {` | Total: ${totalCount}`}
          </span>
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
