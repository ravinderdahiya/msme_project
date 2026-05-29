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
  mergeAssemblyDetails,
  fillAssemblyMetricsForDistrict,
  fillAssemblyMetricsForTehsil,
  loadVidhanSabhaPanelForCommunity,
} from '../gis/msme/assemblyDetailsHelpers.js'
import { fetchTehsilAssemblyMetrics } from '../services/assemblyMetricsService.js'
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

function resolveAssemblyMetricDisplayValue(row, key) {
  if (!row) return null
  if (hasMetricValue(row[key])) return row[key]
  if (key === 'proposedAreaPct' && hasMetricValue(row.controlledArea)) return row.controlledArea
  return null
}

function hasAssemblyMetricDetailsFromRow(row) {
  if (!row) return false
  return (
    hasMetricValue(row.proposedAreaPct) ||
    hasMetricValue(row.controlledArea) ||
    hasMetricValue(row.proposedPolicy) ||
    hasMetricValue(row.developmentPlan) ||
    hasMetricValue(row.intermediateAreaPct) ||
    hasMetricValue(row.coreAreaPct) ||
    hasMetricValue(row.subPrimeAreaPct) ||
    hasMetricValue(row.mcPct) ||
    hasMetricValue(row.existingIndustry)
  )
}

function hasAssemblyAreaBreakupFromRow(row) {
  if (!row) return false
  return (
    hasMetricValue(row.coreAreaPct) ||
    hasMetricValue(row.intermediateAreaPct) ||
    hasMetricValue(row.subPrimeAreaPct) ||
    hasMetricValue(row.mcPct) ||
    hasMetricValue(row.existingIndustry)
  )
}

function hasAssemblyNameFromRow(row) {
  if (!row) return false
  return !!(row.vidhanSabha || row.nearestTehsil)
}

function normalizePlaceLabel(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
}

function assemblySnapshotMatchesPlace(snapshot, place) {
  if (!snapshot || !place) return !!snapshot
  var snapDistrict = normalizePlaceLabel(snapshot.district)
  var placeDistrict = normalizePlaceLabel(place.district)
  if (placeDistrict && snapDistrict && snapDistrict !== placeDistrict) return false
  var snapTehsil = normalizePlaceLabel(snapshot.nearestTehsil || snapshot.vidhanSabha)
  var placeTehsil = normalizePlaceLabel(place.tehsil)
  if (placeTehsil && snapTehsil && snapTehsil !== placeTehsil) return false
  return true
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

  return parseIsoMs(analysisSnap.generatedAt) >= parseIsoMs(mapSnap.generatedAt)
    ? analysisSnap
    : mapSnap
}

function isClosestAnalysisReport(reportSnap) {
  return !!(
    reportSnap &&
    reportSnap.reportKind === 'analysis' &&
    String(reportSnap.tool || '').toLowerCase() === 'closest'
  )
}

function getClosestRowCount(row) {
  if (!row) return 0
  if (row.nearestItem) return 1
  return getCategoryItems(row).length > 0 ? 1 : 0
}

function isMapClickPlaceOnlyReport(reportSnap) {
  return !!(
    reportSnap &&
    reportSnap.reportKind === 'map-selection' &&
    reportSnap.placeOnly === true &&
    !reportSnap.accumulate
  )
}

function isCommunitySummaryCandidate(reportSnap) {
  if (!reportSnap) return false
  if (reportSnap.communitySummary) return true
  if (reportSnap.reportKind === 'map-selection') {
    if (reportSnap.placeOnly) return false
    return !!reportSnap.accumulate
  }
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

function reportHasPlaceLookupContext(reportSnap) {
  if (!reportSnap) return false
  if (extractPointForPlaceLookup(null, reportSnap)) return true
  return !!(
    reportSnap.summaryGeometryJson ||
    reportSnap.queryGeometryJson ||
    reportSnap.analysisGeometryJson ||
    reportSnap.geometryJson
  )
}

function shouldAutoOpenCommunityPanel(reportSnap) {
  if (!reportSnap) return false
  if (resolvePlaceDetails(null, reportSnap)) return true
  if (resolveAssemblyDetails(null, reportSnap)) return true
  if (reportHasPlaceLookupContext(reportSnap)) return true
  var isAnalysis = reportSnap.reportKind === 'analysis'
  var tool = String(reportSnap.tool || '').toLowerCase()
  if (isAnalysis && (tool === 'closest' || tool === 'proximity' || tool === 'buffer')) {
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

function getRowDisplayCount(row, isClosestMode) {
  if (isClosestMode) return getClosestRowCount(row)
  var count = Number(row && row.count)
  return Number.isFinite(count) ? count : 0
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

const PLACE_DETAIL_FIELDS = [
  { key: 'district', label: 'District', icon: 'map' },
  { key: 'tehsil', label: 'Tehsil', icon: 'building' },
  { key: 'village', label: 'Village', icon: 'home' },
  { key: 'block', label: 'Block', icon: 'grid' },
  { key: 'ward', label: 'Ward', icon: 'people' },
  { key: 'pincode', label: 'Pincode', icon: 'pin' },
]

const ASSEMBLY_METRIC_ROWS = [
  { key: 'proposedAreaPct', label: 'Proposed Area %', suffix: '%', tone: '#7c3aed', bg: '#ede9fe' },
  { key: 'coreAreaPct', label: 'Core Area %', suffix: '%', tone: '#2563eb', bg: '#dbeafe' },
  { key: 'intermediateAreaPct', label: 'Intermediate Area %', suffix: '%', tone: '#0891b2', bg: '#cffafe' },
  { key: 'subPrimeAreaPct', label: 'Sub Prime Area %', suffix: '%', tone: '#ea580c', bg: '#ffedd5' },
  { key: 'mcPct', label: 'MC %', suffix: '%', tone: '#0d9488', bg: '#ccfbf1' },
  { key: 'existingIndustry', label: 'Existing Industry %', suffix: '%', tone: '#64748b', bg: '#f1f5f9' },
]

function SectionTitleIcon({ kind }) {
  if (kind === 'assembly') {
    return (
      <span className="community-ba-section-icon community-ba-section-icon--assembly" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path
            d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-4h6v4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }
  return (
    <span className="community-ba-section-icon community-ba-section-icon--place" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path
          d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="11" r="2.5" fill="currentColor" />
      </svg>
    </span>
  )
}

function AssemblyMetricIcon({ tone }) {
  return (
    <span className="community-ba-assembly-metric__icon" style={{ color: tone }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  )
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
  const [pinnedTehsilMetrics, setPinnedTehsilMetrics] = useState(null)
  const [assemblyMetricsLoading, setAssemblyMetricsLoading] = useState(false)
  const [assemblyMetricsError, setAssemblyMetricsError] = useState('')
  const [placeDetailsLoading, setPlaceDetailsLoading] = useState(false)
  const [resolvedLookupPoint, setResolvedLookupPoint] = useState(null)
  const placeLookupCacheRef = useRef({})
  const assemblyLookupCacheRef = useRef({})
  const assemblyTehsilFetchKeyRef = useRef('')
  const autoAssemblySelectionRef = useRef('')
  const panelRef = useRef(null)

  useEffect(() => {
    function refreshSnapshots() {
      if (typeof window === 'undefined') return

      var nextAnalysis =
        typeof window.msmeGisGetAnalysisReportSnapshot === 'function'
          ? window.msmeGisGetAnalysisReportSnapshot()
          : null
      var nextMap =
        typeof window.msmeGisGetMapSelectionReportSnapshot === 'function'
          ? window.msmeGisGetMapSelectionReportSnapshot()
          : null

      setAnalysisSnap(nextAnalysis)
      setMapSnap(nextMap)

      var latest =
        nextAnalysis && nextMap
          ? parseIsoMs(nextAnalysis.generatedAt) >= parseIsoMs(nextMap.generatedAt)
            ? nextAnalysis
            : nextMap
          : nextAnalysis || nextMap

      if (shouldAutoOpenCommunityPanel(latest)) {
        setOpen(true)
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

  const isClosestMode = isClosestAnalysisReport(latestReport)
  const isMapClickPlaceOnly = useMemo(
    () => isMapClickPlaceOnlyReport(latestReport),
    [latestReport],
  )

  const waitingForCounts =
    !isMapClickPlaceOnly && !summary && isCommunitySummaryCandidate(latestReport)
  const displaySummary = isMapClickPlaceOnly ? null : summary || lastSummary

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
  const assemblyDetails = useMemo(() => {
    var snap = assemblySnapshotMatchesPlace(assemblyDetailsFromSnapshot, placeDetails)
      ? assemblyDetailsFromSnapshot
      : null
    // Runtime API metrics first; snapshot only fills missing labels.
    return mergeAssemblyDetails(runtimeAssemblyDetails, snap)
  }, [assemblyDetailsFromSnapshot, runtimeAssemblyDetails, placeDetails])
  const displayAssemblyMetrics = useMemo(() => {
    if (pinnedTehsilMetrics && hasAssemblyMetricDetailsFromRow(pinnedTehsilMetrics)) {
      // Keep pinned % metrics, but preserve missing text fields
      // (e.g. developmentPlan) from broader assembly details.
      return mergeAssemblyDetails(assemblyDetails, pinnedTehsilMetrics)
    }
    return assemblyDetails
  }, [pinnedTehsilMetrics, assemblyDetails])
  const assemblyTehsilLabel = useMemo(
    () =>
      (placeDetails && placeDetails.tehsil) ||
      (assemblyDetails && assemblyDetails.nearestTehsil) ||
      (assemblyDetails && assemblyDetails.vidhanSabha) ||
      '',
    [placeDetails, assemblyDetails],
  )
  const assemblyDistrictLabel = useMemo(
    () =>
      (placeDetails && placeDetails.district) ||
      (assemblyDetails && assemblyDetails.district) ||
      '-',
    [assemblyDetails, placeDetails],
  )
  const hasAssemblyMetricDetails = useMemo(() => {
    if (!displayAssemblyMetrics) return false
    return hasAssemblyMetricDetailsFromRow(displayAssemblyMetrics)
  }, [displayAssemblyMetrics])
  const hasAssemblyName = !!(assemblyDetails && assemblyDetails.vidhanSabha)
  const nearestTehsilLabel =
    (assemblyDetails && assemblyDetails.nearestTehsil) ||
    (placeDetails && placeDetails.tehsil) ||
    ''
  const usedTehsilFallback = !!(assemblyDetails && assemblyDetails.usedTehsilFallback)

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
      if (isClosestAnalysisReport(latestReport)) {
        var seenClosest = {}
        var closestKeys = []
        var closestCats = Array.isArray(summary.categories) ? summary.categories : []
        closestCats.forEach((row) => {
          var key = String(row && row.key ? row.key : '').toLowerCase()
          if (!key || seenClosest[key]) return
          if (!getClosestRowCount(row)) return
          seenClosest[key] = true
          closestKeys.push(key)
        })
        setSelectedCategoryKeys(closestKeys)
      } else {
        setSelectedCategoryKeys([])
      }
    }
  }, [summary, latestReport])

  useEffect(() => {
    if (isMapClickPlaceOnly) {
      setLastSummary(null)
      setSelectedCategoryKeys([])
      setOpenCategoryKey(null)
    }
  }, [isMapClickPlaceOnly, latestReport && latestReport.generatedAt])

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
      setPlaceDetailsLoading(false)
      return () => {
        cancelled = true
      }
    }

    if (!resolvedLookupPoint) {
      setRuntimePlaceDetails(null)
      setPlaceDetailsLoading(false)
      return () => {
        cancelled = true
      }
    }

    var cacheKey = `${resolvedLookupPoint.lat.toFixed(6)},${resolvedLookupPoint.lon.toFixed(6)}`
    if (placeLookupCacheRef.current[cacheKey]) {
      setRuntimePlaceDetails(placeLookupCacheRef.current[cacheKey])
      setPlaceDetailsLoading(false)
      return () => {
        cancelled = true
      }
    }

    setPlaceDetailsLoading(true)
    queryPlaceDetailsByPointWgs84(resolvedLookupPoint).then((details) => {
      if (cancelled) return
      setPlaceDetailsLoading(false)
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

  /** Pinned tehsil → load % cards (dedicated state — never wiped by other effects). */
  useEffect(() => {
    var cancelled = false
    var district = placeDetails && placeDetails.district
    var tehsil = placeDetails && placeDetails.tehsil
    if (!district || !tehsil) {
      setPinnedTehsilMetrics(null)
      setAssemblyMetricsError('')
      assemblyTehsilFetchKeyRef.current = ''
      return () => {}
    }

    var tehsilFetchKey = `${normalizePlaceLabel(district)}|${normalizePlaceLabel(tehsil)}`
    if (assemblyTehsilFetchKeyRef.current === tehsilFetchKey && pinnedTehsilMetrics) {
      return () => {}
    }
    assemblyTehsilFetchKeyRef.current = tehsilFetchKey

    setAssemblyMetricsLoading(true)
    setAssemblyMetricsError('')
    fetchTehsilAssemblyMetrics(district, tehsil)
      .then((metrics) => {
        if (cancelled) return
        if (metrics && hasAssemblyMetricDetailsFromRow(metrics)) {
          if (!hasAssemblyAreaBreakupFromRow(metrics)) {
            return fillAssemblyMetricsForTehsil(district, tehsil, resolvedLookupPoint).then(
              (fallbackMetrics) => {
                if (cancelled) return
                var mergedMetrics = mergeAssemblyDetails(metrics, fallbackMetrics)
                setPinnedTehsilMetrics(mergedMetrics)
                setRuntimeAssemblyDetails((prev) => mergeAssemblyDetails(prev, mergedMetrics))
                setAssemblyMetricsError('')
              },
            )
          }
          setPinnedTehsilMetrics(metrics)
          setRuntimeAssemblyDetails((prev) => mergeAssemblyDetails(prev, metrics))
          setAssemblyMetricsError('')
        } else {
          setPinnedTehsilMetrics(null)
          setAssemblyMetricsError(
            'Area metrics load nahi ho paye. MSME_Backend chalu karein (port 8083) aur page refresh karein.',
          )
        }
      })
      .catch(() => {
        if (cancelled) return
        setPinnedTehsilMetrics(null)
        setAssemblyMetricsError(
          'Backend connect nahi ho raha. Terminal mein: cd MSME_Backend → npm run dev (port 8083).',
        )
      })
      .finally(() => {
        if (!cancelled) setAssemblyMetricsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [placeDetails && placeDetails.district, placeDetails && placeDetails.tehsil, resolvedLookupPoint])

  useEffect(() => {
    var cancelled = false

    if (!resolvedLookupPoint) {
      if (!(placeDetails && placeDetails.district && placeDetails.tehsil)) {
        setRuntimeAssemblyDetails(null)
      }
      return () => {
        cancelled = true
      }
    }

    var cacheKey = `${resolvedLookupPoint.lat.toFixed(6)},${resolvedLookupPoint.lon.toFixed(6)}`
    var districtHint =
      (placeDetails && placeDetails.district) ||
      (assemblyDetailsFromSnapshot && assemblyDetailsFromSnapshot.district) ||
      ''
    var tehsilHint =
      (placeDetails && placeDetails.tehsil) ||
      (assemblyDetailsFromSnapshot && assemblyDetailsFromSnapshot.nearestTehsil) ||
      ''

    var cacheKeyFull = `${cacheKey}|${normalizePlaceLabel(districtHint)}|${normalizePlaceLabel(tehsilHint)}`
    var cached = assemblyLookupCacheRef.current[cacheKeyFull]
    if (
      cached &&
      hasAssemblyMetricDetailsFromRow(cached) &&
      assemblySnapshotMatchesPlace(cached, placeDetails)
    ) {
      setRuntimeAssemblyDetails(cached)
      return () => {
        cancelled = true
      }
    }

    function applyAssemblyDetails(details) {
      if (cancelled || !details) return
      var merged = mergeAssemblyDetails(details, {
        nearestTehsil: tehsilHint || details.nearestTehsil,
        district: districtHint || details.district,
        vidhanSabha: details.vidhanSabha || tehsilHint || details.nearestTehsil,
      })
      assemblyLookupCacheRef.current[cacheKeyFull] = merged
      setRuntimeAssemblyDetails((prev) => mergeAssemblyDetails(prev, merged))
    }

    var tehsilFetchKey =
      districtHint && tehsilHint
        ? `${normalizePlaceLabel(districtHint)}|${normalizePlaceLabel(tehsilHint)}`
        : ''
    var tehsilFetchHandledElsewhere =
      tehsilFetchKey &&
      assemblyTehsilFetchKeyRef.current === tehsilFetchKey &&
      (assemblyMetricsLoading || pinnedTehsilMetrics)

    var loadPromise = tehsilFetchHandledElsewhere
      ? Promise.resolve(pinnedTehsilMetrics || runtimeAssemblyDetails)
      : districtHint && tehsilHint
        ? fetchTehsilAssemblyMetrics(districtHint, tehsilHint).then((metrics) => {
            if (metrics && hasAssemblyMetricDetailsFromRow(metrics)) {
              if (hasAssemblyAreaBreakupFromRow(metrics)) return metrics
              return fillAssemblyMetricsForTehsil(
                districtHint,
                tehsilHint,
                resolvedLookupPoint,
              ).then((fallbackMetrics) => mergeAssemblyDetails(metrics, fallbackMetrics))
            }
            return fillAssemblyMetricsForTehsil(districtHint, tehsilHint, resolvedLookupPoint)
          })
        : loadVidhanSabhaPanelForCommunity(resolvedLookupPoint, districtHint, tehsilHint)

    loadPromise
      .then((details) => {
        if (cancelled) return
        if (details && hasAssemblyMetricDetailsFromRow(details)) {
          applyAssemblyDetails(details)
          if (hasAssemblyAreaBreakupFromRow(details) || !districtHint || !tehsilHint) return
          return fillAssemblyMetricsForTehsil(districtHint, tehsilHint, resolvedLookupPoint).then(
            (fallbackDetails) => {
              if (fallbackDetails && hasAssemblyMetricDetailsFromRow(fallbackDetails)) {
                applyAssemblyDetails(mergeAssemblyDetails(details, fallbackDetails))
              }
            },
          )
        }
        if (districtHint && tehsilHint && !tehsilFetchHandledElsewhere) {
          return fetchTehsilAssemblyMetrics(districtHint, tehsilHint).then((metrics) => {
            if (metrics && hasAssemblyMetricDetailsFromRow(metrics)) applyAssemblyDetails(metrics)
          })
        }
        if (districtHint) {
          return fillAssemblyMetricsForDistrict(districtHint, resolvedLookupPoint).then(
            (districtMetrics) => {
              if (districtMetrics && hasAssemblyMetricDetailsFromRow(districtMetrics)) {
                applyAssemblyDetails(districtMetrics)
              }
            },
          )
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [
    assemblyDetailsFromSnapshot,
    resolvedLookupPoint,
    placeDetails && placeDetails.district,
    placeDetails && placeDetails.tehsil,
    displaySummary,
    latestReport,
    pinnedTehsilMetrics,
    assemblyMetricsLoading,
    runtimeAssemblyDetails,
  ])

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
    if (resolvedLookupPoint) return true
    if (reportHasPlaceLookupContext(latestReport)) return true
    if (latestReport.reportKind === 'analysis') return true
    return false
  }, [hasPlaceDetails, latestReport, resolvedLookupPoint])
  const placeHeaderLines = useMemo(() => {
    if (!placeCardShouldRender) return null
    const formatField = (field) => {
      const value = placeDetails && placeDetails[field.key]
      if (value) return `${field.label}: ${value}`
      if (placeDetailsLoading || (resolvedLookupPoint && !placeDetailsFromSnapshot)) {
        return `${field.label}: …`
      }
      return `${field.label}: -`
    }
    return {
      line1: PLACE_DETAIL_FIELDS.slice(0, 3).map(formatField).join(' · '),
      line2: PLACE_DETAIL_FIELDS.slice(3).map(formatField).join(' · '),
    }
  }, [placeCardShouldRender, placeDetails, placeDetailsLoading, resolvedLookupPoint, placeDetailsFromSnapshot])
  const assemblyCardShouldRender = useMemo(() => {
    if (hasAssemblyDetails) return true
    if (!latestReport) return false
    if (latestReport.reportKind === 'map-selection') return true
    if (resolvedLookupPoint) return true
    if (reportHasPlaceLookupContext(latestReport)) return true
    if (latestReport.reportKind === 'analysis') return true
    return false
  }, [hasAssemblyDetails, latestReport, resolvedLookupPoint])

  useEffect(() => {
    if (!assemblyDetails) return
    var key = `${assemblyDetails.vidhanSabhaCode || ''}|${assemblyDetails.vidhanSabha || ''}|${assemblyDetails.district || ''}`
    if (!key || key === '||') return
    if (autoAssemblySelectionRef.current === key) return
    autoAssemblySelectionRef.current = key
    autoSelectVidhanSabhaInUi(assemblyDetails)
  }, [assemblyDetails])

  const shouldShowPanelShell =
    !!displaySummary ||
    waitingForCounts ||
    hasPlaceDetails ||
    hasAssemblyDetails ||
    placeCardShouldRender ||
    assemblyCardShouldRender

  useEffect(() => {
    if (!open || !shouldShowPanelShell) return undefined
    const el = panelRef.current
    if (!el) return undefined
    const stopWheelToMap = (event) => {
      event.stopPropagation()
    }
    el.addEventListener('wheel', stopWheelToMap, { capture: true, passive: true })
    return () => {
      el.removeEventListener('wheel', stopWheelToMap, { capture: true })
    }
  }, [open, shouldShowPanelShell])

  if (!shouldShowPanelShell) return null
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

  const rows = displaySummary
    ? allRows.filter((row) => getRowDisplayCount(row, isClosestMode) > 0 || hasCategoryData(row))
    : allRows

  const hasUnavailable = allRows.some((r) => r && r.available === false)

  const totalCountNum = rows.reduce(
    (sum, row) => sum + Math.max(0, getRowDisplayCount(row, isClosestMode)),
    0,
  )

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
        var lat = Number(focusItem.lat)
        var lng = Number(focusItem.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          if (!coords) return
          lat = coords.lat
          lng = coords.lng
        }
        var name = focusItem.name
        var dedupeKey = `${keyLower}|${name}|${lat.toFixed(6)},${lng.toFixed(6)}`
        if (seen[dedupeKey]) return
        seen[dedupeKey] = true
        combined.push({
          name,
          lat,
          lng,
          category: keyLower,
          item: focusItem.item,
        })
      })
    })

    if (combined.length > 0) {
      window.dispatchEvent(
        new CustomEvent('msme-gis-focus-community-category', {
          detail: {
            category: selectedCategoryKeys.length === 1 ? selectedCategoryKeys[0] : 'multi',
            label: allowedLabels.length > 0 ? allowedLabels.join(' + ') : 'selected categories',
            items: combined,
            total: combined.length,
            showAllRoutes: true,
          },
        }),
      )
      return
    }

    if (
      typeof window !== 'undefined' &&
      typeof window.msmeGisDrawCommunityRoutesForCategories === 'function'
    ) {
      window
        .msmeGisDrawCommunityRoutesForCategories(selectedCategoryKeys, {
          showAllRoutes: true,
        })
        .then(function (ok) {
          if (!ok) {
            window.alert(
              'No POI coordinates found in buffer for selected categories. Increase closest/buffer distance and try again.',
            )
          }
        })
      return
    }

    window.alert(
      'No POI coordinates available for the selected categories. Run buffer or closest analysis first.',
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
            showAllRoutes: true,
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
      ref={panelRef}
      className="community-summary-panel community-ba-panel"
      role="complementary"
      aria-label="Community counts"
    >
      <div className="community-ba-head">
        <div className="community-ba-head-brand">
          <div className="community-ba-head-title-row">
            <span className="community-ba-head-logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 15V9l3 4 3-6 3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3>MSME REPORT</h3>
          </div>
          {placeHeaderLines ? (
            <div
              className="community-ba-head-place-lines"
              aria-label="Place details"
            >
              <p className="community-ba-head-place-line">{placeHeaderLines.line1}</p>
              <p className="community-ba-head-place-line">{placeHeaderLines.line2}</p>
            </div>
          ) : null}
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

      <div className="community-ba-scroll">
      {assemblyCardShouldRender ? (
        <section className="community-ba-section community-ba-assembly-card" aria-label="Vidhan Sabha profile">
          <h4 className="community-ba-section__title">
            <SectionTitleIcon kind="assembly" />
            Vidhan Sabha Profile
          </h4>
          <div className="community-ba-assembly-header">
            <p className="community-ba-assembly-name">
              {assemblyTehsilLabel ||
                (assemblyDetails && assemblyDetails.vidhanSabha) ||
                (usedTehsilFallback && nearestTehsilLabel) ||
                '—'}
            </p>
            <p className="community-ba-assembly-sub">
              {assemblyTehsilLabel ? `Tehsil: ${assemblyTehsilLabel}` : null}
              {assemblyTehsilLabel && assemblyDistrictLabel ? ' · ' : null}
              {assemblyDistrictLabel ? `District: ${assemblyDistrictLabel}` : null}
              {usedTehsilFallback && nearestTehsilLabel && !assemblyTehsilLabel
                ? ` · Nearest tehsil: ${nearestTehsilLabel}`
                : ''}
            </p>
          </div>
          <div className="community-ba-assembly-grid">
            {ASSEMBLY_METRIC_ROWS.map((metric) => (
              <article
                key={metric.key}
                className="community-ba-assembly-metric"
                style={{ background: metric.bg }}
              >
                <AssemblyMetricIcon tone={metric.tone} />
                <strong>{metric.label}</strong>
                <span>
                  {assemblyMetricsLoading && !hasAssemblyMetricDetails
                    ? '…'
                    : metric.suffix
                      ? formatMetricValue(
                          resolveAssemblyMetricDisplayValue(displayAssemblyMetrics, metric.key),
                          metric.suffix,
                        )
                      : resolveAssemblyMetricDisplayValue(displayAssemblyMetrics, metric.key) || '-'}
                </span>
              </article>
            ))}
          </div>
          {assemblyMetricsLoading ? (
            <p className="community-ba-assembly-note community-ba-assembly-note--info">
              <span className="community-ba-assembly-note__dot" aria-hidden="true" />
              Loading area metrics for {assemblyTehsilLabel || assemblyDistrictLabel}…
            </p>
          ) : null}
          {assemblyMetricsError && !hasAssemblyMetricDetails ? (
            <p className="community-ba-assembly-note">
              <span className="community-ba-assembly-note__dot" aria-hidden="true" />
              {assemblyMetricsError}
            </p>
          ) : null}
          {!assemblyMetricsLoading &&
          !hasAssemblyName &&
          !hasAssemblyMetricDetails &&
          !usedTehsilFallback &&
          !assemblyTehsilLabel ? (
            <p className="community-ba-assembly-note">
              <span className="community-ba-assembly-note__dot" aria-hidden="true" />
              Is clicked point par Vidhan Sabha match nahi mila (outside Haryana ho sakta hai).
            </p>
          ) : null}
          {usedTehsilFallback && !hasAssemblyName && hasAssemblyMetricDetails ? (
            <p className="community-ba-assembly-note community-ba-assembly-note--info">
              <span className="community-ba-assembly-note__dot" aria-hidden="true" />
              Clicked point ke liye nearest tehsil ({nearestTehsilLabel || '—'}) se profile load ki gayi.
            </p>
          ) : null}
          {hasAssemblyName && !hasAssemblyMetricDetails ? (
            <p className="community-ba-assembly-note">
              <span className="community-ba-assembly-note__dot" aria-hidden="true" />
              Detailed policy/area metrics is waqt map service me available nahi hain.
            </p>
          ) : null}
        </section>
      ) : null}

      {assemblyCardShouldRender ? (
        <section className="community-ba-section community-ba-planning-card" aria-label="Planning details">
          <h4 className="community-ba-section__title">
            <SectionTitleIcon kind="assembly" />
            Planning Details
          </h4>
          <div className="community-ba-planning-grid">
            <article className="community-ba-planning-item">
              <strong>Controlled Area</strong>
              <span>
                {formatMetricValue(
                  displayAssemblyMetrics &&
                    (displayAssemblyMetrics.controlledArea != null
                      ? displayAssemblyMetrics.controlledArea
                      : displayAssemblyMetrics.proposedAreaPct),
                  '%',
                )}
              </span>
            </article>
            <article className="community-ba-planning-item">
              <strong>Development Plan</strong>
              <span>
                {(displayAssemblyMetrics &&
                  (displayAssemblyMetrics.developmentPlan || displayAssemblyMetrics.proposedPolicy)) ||
                  '-'}
              </span>
            </article>
          </div>
        </section>
      ) : null}

      {!isMapClickPlaceOnly ? (
      <>
      <section className="community-ba-section community-ba-toolbar">
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
      </section>

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
              : 'Loading community counts (schools, hospitals, utilities nearby)...'}
          </p>
        ) : null}

        {displaySummary && !waitingForCounts && totalCountNum === 0 ? (
          <p className="community-summary-loading">
            {isClosestMode
              ? `No nearest facility found in ${radiusM ? `${Math.round(Number(radiusM))} m` : 'this'} closest buffer. Increase closest distance and click the map again.`
              : `No nearby facilities found in ${radiusM ? `${Math.round(Number(radiusM))} m` : 'this'} radius. Increase search distance in cadastral settings and click the map again.`}
          </p>
        ) : null}

        <div className="community-ba-cards">
          {rows.map((row, idx) => {
            var count = getRowDisplayCount(row, isClosestMode)
            var label = row && row.label ? row.label : 'Category'
            var key = String(row && row.key ? row.key : idx)
            var keyLower = key.toLowerCase()
            var showLoadingBadge = !displaySummary || waitingForCounts
            var color = getCategoryColor(idx)
            var items = getCategoryItems(row)
            var canExpandList = !isClosestMode && items.length > 0
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
                <div className="community-ba-card__head">
                  <h4 className="community-ba-card__title">{label}</h4>
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
                <p className="community-ba-desc">{getCategoryDescription(row)}</p>

                <button
                  type="button"
                  className={`community-ba-card__stat${canFocusCategory || canExpandList ? ' is-clickable' : ''}`}
                  onClick={() => handleCategoryClick(row)}
                  disabled={!canFocusCategory && !canExpandList}
                >
                  <strong style={{ color }}>{showLoadingBadge ? '...' : count}</strong>
                  <span style={{ color }}>
                    {isClosestMode ? (count > 0 ? 'Nearest' : 'None') : label}
                  </span>
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
            Select categories and click on the map to view the data.
            {updatedAt ? ` Updated ${formatUpdatedAt(updatedAt)}.` : ''}
            {radiusM ? ` Radius ${radiusM} m.` : ''}
            {displaySummary ? ` Total ${totalCount}.` : ''}
          </span>
        </p>

        {hasUnavailable ? (
          <p className="community-summary-note">
            Some requested categories are not available as dedicated layers, so
            they appear as 0.
          </p>
        ) : null}
      </div>
      </>
      ) : null}
      </div>
    </aside>
  )
}
