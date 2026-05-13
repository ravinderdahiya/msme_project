/* eslint-disable -- generated runtime loader */
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import { identify } from "@arcgis/core/rest/identify.js";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import * as jsonUtils from "@arcgis/core/geometry/support/jsonUtils.js";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import IdentityManager from "@arcgis/core/identity/IdentityManager.js";
import esriConfig from "@arcgis/core/config.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Home from "@arcgis/core/widgets/Home.js";
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import { solve } from "@arcgis/core/rest/route.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import Point from "@arcgis/core/geometry/Point.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import { jsPDF } from "jspdf";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { SR_METER, SR_WEB, SR4326, defaultStudyExtent32643 } from "./spatialRefs.js";
import {
  BASE_MS,
  ADMIN_MS,
  ENV_MS,
  INV_MS,
  SOC_MS,
  TRANS_MS,
  UTIL_MS,
  CAD_MS,
  CON_MS,
  IDENTIFY_URLS,
  LAYER_DISTRICT,
  LAYER_TEHSIL,
  LAYER_VILLAGE,
  LAYER_ROADS_LINE,
  LAYER_FOREST,
  LAYER_INVESTMENT,
  LAYER_WATER,
  LAYER_CON_ASSEMBLY,
  LAYER_CON_PARLIAMENT,
  HR_DISTRICT_LONLAT,
  normalizeDistrictCodeKey,
  themeKeyFromUrl,
  POI_LAYERS,
  INT_LAYERS,
  UTIL_LINES,
  approxModeFromAdminLayerId,
} from "./serviceUrlsAndLayers.js";
import { queryLayer, requestArcGisJson } from "./queryClient.js";
import {
  geomFromJSON,
  wkidValue,
  normalizeSpatialReference,
  isWebMercatorWkid,
  coerceMissingSpatialReference,
  haversineMeters,
  ensureSR32643,
  toEngineSR,
  geometryToQueryParams,
  sqlQuote,
  geometryIsUsable,
  extentLooksEmpty,
  normalizeDistrictKey,
  geodesicDistanceMetersFallback,
  distanceFromPointToGeometry,
  getGeometryCentroid,
} from "./geometryUtils.js";
import { queryAdministrativeGeometryForZoom } from "./adminGeometryQuery.js";
import { zoomToAdminFeatureExtent } from "./adminExtentZoom.js";
import { mergeNearbyLayerLists } from "./nearbyLayers.js";
import { isGateway502Error } from "./gateway502.js";
import { alertNoData as alertNoDataExternal } from "./noDataAlert.js";
import { readAoiVillageBufferMeters, syncAoiVillageBufferState } from "./aoiVillageBufferHelpers.js";
import { msmeBind } from "./domBind.js";
import { fixGeometrySR } from "./fixGeometrySR.js";
import { readCadNearRadiusMeters } from "./cadNearRadius.js";
import { isAdministrativeAoiTabActive } from "./aoiTabVisibility.js";
import { optionTextByValue } from "./selectOptionText.js";
import { constituencyRowsFromFeatures } from "./constituencyRows.js";
import { formatDistanceLabel } from "./distanceLabel.js";
import {
  setBufferDistanceMeters,
  setProximityDistanceMeters,
  setBufferQueryRadiusMeters,
  readBufferPickDistanceMetersFromUi,
  readProximityDistanceMetersFromUi,
  readClosestDistanceMetersFromUi,
} from "./distanceUiHelpers.js";
import { deriveCommunityZoomLabel, resolveCommunityZoomPoint4326 } from "./communityZoomHelpers.js";
import { readLandReportDomContext } from "./reportDomContext.js";
import {
  publishAoiLandReportSnapshot,
  publishMapSelectionReportSnapshot,
  publishAnalysisReportSnapshot,
  publishAnalysisToolResult,
  getAoiLandReportSnapshot,
  getMapSelectionReportSnapshot,
  getAnalysisReportSnapshot,
} from "./reportSnapshots.js";
import { getSelectedAoiLabel, openAoiRoutePanel, closeAoiRoutePanel, renderAoiRoutePanel } from "./aoiRoutePanel.js";
import { formatIsoForPdf, addPdfLine } from "./pdfHelpers.js";
import { chunkArray } from "./listUtils.js";
import { isMainRoadFeature, featureOid, extractCommunityPlaceNameFromAttributes } from "./communityAttributeHelpers.js";
import { parseCoordTextPair, normalizeEsriCoordNode, normalizeEsriGeometryJson } from "./esriGeometryJsonNormalize.js";
import { SCHOOL_LAYER_DEFS, COMMUNITY_SUMMARY_LAYER_SPECS } from "./communityLayerSpecs.js";
import {
  normalizeDistrictName,
  HSVP_DISTRICT_ALIASES,
  getHsvpDistrictNameByCode,
  hsvpPlotOid,
  hsvpPlotNo,
  hsvpPlotName,
  hsvpSectorAreaLabel,
  hsvpSectorKey,
} from "./hsvpHelpers.js";
import {
  isBoundaryLayerName,
  pickSmallestPolygonFromIdentifyFlat,
  pickPrimaryIdentifyHitsForMap,
  identifyResultDedupeKey,
  pickIdentifyHitsForHighlight,
  escapeHtml,
  buildSimpleIdentifyPopupHtml,
  computeUnionGeometryFromFlats,
} from "./identifyFeatureHelpers.js";
import { gisPh, setRefreshGisPlaceholderLabelsImpl, applyMsmeGisUiStrings } from "./uiLabels.js";
import {
  getEsriRouteSolveUrl,
  hasArcGisRoutingApiKey,
  routeServiceNeedsApiKey,
  isRoutingAuthError,
  isValidWgsLatLon,
  coerceLocationToWgs,
  planarDistanceMeters,
  buildRoadGraph,
  findNearestGraphNode,
  shortestPathRoadGraph,
  compactPathCoords,
  buildRoutePinDataUrl,
  shortRouteLabelText,
} from "./routingHelpers.js";

import c1 from "./runtimeChunks/chunk01.js";
import c2 from "./runtimeChunks/chunk02.js";
import c3 from "./runtimeChunks/chunk03.js";

const __msmeImportMeta = {
  env: (typeof import.meta !== "undefined" && import.meta && import.meta.env) ? import.meta.env : {},
};

function patchLegacySource(source) {
  if (!source) return source;
  var out = source;
  var closestPdfFnPattern = /(function buildClosestScreenPdfReport\(\)\s*\{[\s\S]*?\n\})(\r?\n\r?\n\/\*\* @deprecated Use getters per report type; returns map selection only for backward compatibility\. \*\/)/;
  var closestPdfFnReplacement = [
    "function buildClosestScreenPdfReport() {",
    "  var filename = \"closest-screen-\" + new Date().toISOString().replace(/[:.]/g, \"-\") + \".pdf\";",
    "  if (!view || view.destroyed || typeof view.takeScreenshot !== \"function\") {",
    "    window.alert(\"Map screenshot not available right now.\");",
    "    return;",
    "  }",
    "",
    "  setStatus(\"Preparing map PDF...\");",
    "  try {",
    "    if (view.popup && view.popup.visible) view.popup.close();",
    "  } catch (e0) {}",
    "",
    "  function captureLegendImageForPdf() {",
    "    var panel = document.getElementById(\"legendPanel\");",
    "    var inner = document.getElementById(\"legendInner\");",
    "    if (!panel || !inner) return Promise.resolve(null);",
    "    if (!String(inner.textContent || \"\").trim()) return Promise.resolve(null);",
    "",
    "    var clone = panel.cloneNode(true);",
    "    clone.id = \"legendPanelPrintClone\";",
    "    clone.classList.add(\"visible\");",
    "    clone.style.display = \"block\";",
    "    clone.style.position = \"fixed\";",
    "    clone.style.left = \"-10000px\";",
    "    clone.style.top = \"0\";",
    "    clone.style.maxHeight = \"none\";",
    "    clone.style.height = \"auto\";",
    "    clone.style.overflow = \"visible\";",
    "    clone.style.opacity = \"1\";",
    "    clone.style.visibility = \"visible\";",
    "    clone.style.pointerEvents = \"none\";",
    "    clone.style.width = \"860px\";",
    "    clone.style.padding = \"12px 14px\";",
    "    clone.style.borderRadius = \"10px\";",
    "    clone.style.background = \"#ffffff\";",
    "    clone.style.border = \"1px solid #d3e1ee\";",
    "    clone.style.boxShadow = \"none\";",
    "    clone.style.transform = \"none\";",
    "    clone.style.zoom = \"1\";",
    "    document.body.appendChild(clone);",
    "",
    "    return import(\"html2canvas\").then(function (mod) {",
    "      var html2canvas = mod && mod.default ? mod.default : mod;",
    "      return html2canvas(clone, {",
    "        backgroundColor: \"#ffffff\",",
    "        useCORS: true,",
    "        allowTaint: true,",
    "        logging: false,",
    "        scale: Math.min(2.5, Math.max(2, Number(window.devicePixelRatio) || 1)),",
    "      });",
    "    }).then(function (legendCanvas) {",
    "      if (!legendCanvas || !legendCanvas.width || !legendCanvas.height) return null;",
    "      return {",
    "        canvas: legendCanvas,",
    "        width: legendCanvas.width,",
    "        height: legendCanvas.height,",
    "      };",
    "    }).catch(function (e1) {",
    "      console.warn(\"[closest pdf] legend capture failed\", e1);",
    "      return null;",
    "    }).finally(function () {",
    "      try {",
    "        if (clone && clone.parentNode) clone.parentNode.removeChild(clone);",
    "      } catch (e2) {}",
    "    });",
    "  }",
    "",
    "  var pixelRatio = Math.max(2, Math.min(4, Number(window.devicePixelRatio) || 1));",
    "  var shotWidth = Math.max(1600, Math.round((Number(view.width) || 1200) * pixelRatio));",
    "  var shotHeight = Math.max(1000, Math.round((Number(view.height) || 800) * pixelRatio));",
    "  var shotPromise = view.takeScreenshot({",
    "    format: \"png\",",
    "    quality: 1,",
    "    width: shotWidth,",
    "    height: shotHeight",
    "  });",
    "",
    "  Promise.all([shotPromise, captureLegendImageForPdf()]).then(function (res) {",
    "    var shot = res && res[0] ? res[0] : null;",
    "    var legendImg = res && res[1] ? res[1] : null;",
    "    if (!shot || !shot.dataUrl) {",
    "      window.alert(\"Map screenshot failed. Please try again.\");",
    "      return;",
    "    }",
    "",
    "    var sw = Number(shot.width || shotWidth || 1);",
    "    var sh = Number(shot.height || shotHeight || 1);",
    "    var isLandscape = sw >= sh;",
    "    var doc = new jsPDF({",
    "      orientation: isLandscape ? \"landscape\" : \"portrait\",",
    "      unit: \"mm\",",
    "      format: \"a4\"",
    "    });",
    "",
    "    var pageW = doc.internal.pageSize.getWidth();",
    "    var pageH = doc.internal.pageSize.getHeight();",
    "    var margin = 4;",
    "    var sectionGap = 3;",
    "    var contentW = pageW - margin * 2;",
    "    var contentH = pageH - margin * 2;",
    "    var mapFrameH = Math.max(80, Math.floor(contentH * 0.73));",
    "    var legendFrameH = Math.max(28, contentH - mapFrameH - sectionGap);",
    "",
    "    var mapFrameX = margin;",
    "    var mapFrameY = margin;",
    "    var mapFrameW = contentW;",
    "",
    "    var legendFrameX = margin;",
    "    var legendFrameY = mapFrameY + mapFrameH + sectionGap;",
    "    var legendFrameW = contentW;",
    "",
    "    doc.setFillColor(255, 255, 255);",
    "    doc.rect(0, 0, pageW, pageH, \"F\");",
    "",
    "    doc.setFillColor(246, 249, 253);",
    "    doc.rect(mapFrameX, mapFrameY, mapFrameW, mapFrameH, \"F\");",
    "    doc.setDrawColor(194, 211, 228);",
    "    doc.setLineWidth(0.6);",
    "    doc.rect(mapFrameX, mapFrameY, mapFrameW, mapFrameH, \"S\");",
    "",
    "    var mapPad = 1;",
    "    var mapInnerX = mapFrameX + mapPad;",
    "    var mapInnerY = mapFrameY + mapPad;",
    "    var mapInnerW = mapFrameW - mapPad * 2;",
    "    var mapInnerH = mapFrameH - mapPad * 2;",
    "    var mapScale = Math.min(mapInnerW / sw, mapInnerH / sh);",
    "    var mapDrawW = Math.max(10, sw * mapScale);",
    "    var mapDrawH = Math.max(10, sh * mapScale);",
    "    var mapDrawX = mapInnerX + (mapInnerW - mapDrawW) / 2;",
    "    var mapDrawY = mapInnerY;",
    "    doc.addImage(shot.dataUrl, \"PNG\", mapDrawX, mapDrawY, mapDrawW, mapDrawH, undefined, \"FAST\");",
    "",
    "    doc.setFillColor(252, 254, 255);",
    "    doc.rect(legendFrameX, legendFrameY, legendFrameW, legendFrameH, \"F\");",
    "    doc.setDrawColor(194, 211, 228);",
    "    doc.setLineWidth(0.6);",
    "    doc.rect(legendFrameX, legendFrameY, legendFrameW, legendFrameH, \"S\");",
    "",
    "    var legendPad = 3;",
    "    var legendInnerX = legendFrameX + legendPad;",
    "    var legendInnerY = legendFrameY + legendPad;",
    "    var legendInnerW = legendFrameW - legendPad * 2;",
    "    var legendInnerH = legendFrameH - legendPad * 2;",
    "",
    "    var legendContentX = legendInnerX;",
    "    var legendContentY = legendInnerY;",
    "    var legendContentW = legendInnerW;",
    "    var legendContentH = legendInnerH;",
    "",
    "    var legendColumns = [",
    "      {",
    "        title: \"Transportation\",",
    "        rows: [",
    "          { label: \"Airports\", type: \"point\", color: [230, 73, 199] },",
    "          { label: \"Bus Stops\", type: \"point\", color: [37, 99, 235] },",
    "          { label: \"Rail Network\", type: \"line\", color: [225, 29, 72] }",
    "        ]",
    "      },",
    "      {",
    "        title: \"Metro Network\",",
    "        rows: [",
    "          { label: \"Proposed_Metro_Station\", type: \"point\", color: [2, 132, 199] },",
    "          { label: \"Rapid_Metro_Station\", type: \"point\", color: [220, 38, 38] },",
    "          { label: \"Delhi_Metro_Station\", type: \"point\", color: [192, 38, 211] }",
    "        ]",
    "      },",
    "      {",
    "        title: \"Metro Lines\",",
    "        rows: [",
    "          { label: \"Proposed_Metro_Line\", type: \"line\", color: [56, 189, 248] },",
    "          { label: \"Rapid_Metro_Line\", type: \"line\", color: [239, 68, 68] },",
    "          { label: \"Delhi_Metro_Line\", type: \"line\", color: [232, 121, 249] }",
    "        ]",
    "      },",
    "      {",
    "        title: \"Administrative boundaries\",",
    "        rows: [",
    "          { label: \"Village Boundary\", type: \"boundary\", color: [51, 51, 51] },",
    "          { label: \"Tehsil Boundary\", type: \"boundary\", color: [245, 158, 11] },",
    "          { label: \"District Boundary\", type: \"boundary\", color: [59, 130, 246] }",
    "        ]",
    "      }",
    "    ];",
    "",
    "    var colGap = 2.5;",
    "    var colCount = 4;",
    "    var cardW = (legendContentW - (colCount - 1) * colGap) / colCount;",
    "    var cardH = legendContentH;",
    "    for (var c = 0; c < legendColumns.length; c++) {",
    "      var cardX = legendContentX + c * (cardW + colGap);",
    "      var cardY = legendContentY;",
    "      var card = legendColumns[c];",
    "",
    "      doc.setFillColor(255, 255, 255);",
    "      doc.rect(cardX, cardY, cardW, cardH, \"F\");",
    "      doc.setDrawColor(214, 224, 236);",
    "      doc.setLineWidth(0.35);",
    "      doc.rect(cardX, cardY, cardW, cardH, \"S\");",
    "",
    "      var padX = 3;",
    "      var curX = cardX + padX;",
    "      var curY = cardY + 5.5;",
    "",
    "      doc.setTextColor(48, 54, 61);",
    "      doc.setFont(\"helvetica\", \"bold\");",
    "      doc.setFontSize(8.5);",
    "      doc.text(String(card.title || \"\"), curX, curY);",
    "",
    "      curY += 4.5;",
    "      var rows = Array.isArray(card.rows) ? card.rows : [];",
    "      for (var r = 0; r < rows.length; r++) {",
    "        var row = rows[r];",
    "        doc.setFont(\"helvetica\", \"bold\");",
    "        doc.setFontSize(7.4);",
    "        doc.setTextColor(41, 45, 51);",
    "        doc.text(String(row.label || \"\"), curX + 1, curY);",
    "",
    "        var sy = curY + 2.4;",
    "        if (row.type === \"point\") {",
    "          doc.setDrawColor(165, 177, 191);",
    "          doc.setLineWidth(0.3);",
    "          doc.setFillColor(255, 255, 255);",
    "          doc.circle(curX + 5, sy, 1.8, \"FD\");",
    "          doc.setFillColor(row.color[0], row.color[1], row.color[2]);",
    "          doc.circle(curX + 5, sy, 1.05, \"F\");",
    "        } else if (row.type === \"line\") {",
    "          doc.setDrawColor(row.color[0], row.color[1], row.color[2]);",
    "          doc.setLineWidth(0.8);",
    "          doc.line(curX + 3, sy, curX + 10, sy);",
    "        } else {",
    "          doc.setDrawColor(row.color[0], row.color[1], row.color[2]);",
    "          doc.setLineWidth(0.5);",
    "          doc.rect(curX + 3, sy - 1.5, 3, 3, \"S\");",
    "        }",
    "",
    "        curY += 10;",
    "      }",
    "    }",
    "",
    "    var distanceRows = [];",
    "    try {",
    "      var aSnap = typeof getAnalysisReportSnapshot === \"function\" ? getAnalysisReportSnapshot() : null;",
    "      var mSnap = typeof getMapSelectionReportSnapshot === \"function\" ? getMapSelectionReportSnapshot() : null;",
    "      var aSummary = aSnap && aSnap.communitySummary ? aSnap.communitySummary : null;",
    "      var mSummary = mSnap && mSnap.communitySummary ? mSnap.communitySummary : null;",
    "      var summary = null;",
    "      if (aSummary && mSummary) {",
    "        var aT = Date.parse(aSummary.generatedAt || aSnap.generatedAt || \"\") || 0;",
    "        var mT = Date.parse(mSummary.generatedAt || mSnap.generatedAt || \"\") || 0;",
    "        summary = aT >= mT ? aSummary : mSummary;",
    "      } else {",
    "        summary = aSummary || mSummary || null;",
    "      }",
    "",
    "      function numOrNull(v) {",
    "        if (v == null) return null;",
    "        if (typeof v === \"string\") {",
    "          var t = v.trim();",
    "          if (!t) return null;",
    "          if (t === \"-\" || t === \"--\" || t === \"na\" || t === \"n/a\") return null;",
    "        }",
    "        var n = Number(v);",
    "        return isFinite(n) ? n : null;",
    "      }",
    "",
    "      function asList(row) {",
    "        if (!row) return [];",
    "        if (Array.isArray(row.items)) return row.items;",
    "        if (Array.isArray(row.features)) return row.features;",
    "        if (Array.isArray(row.list)) return row.list;",
    "        return [];",
    "      }",
    "",
    "      function itemName(it, categoryLabel, idx) {",
    "        var a = it && it.attributes ? it.attributes : {};",
    "        var p = it && it.properties ? it.properties : {};",
    "        return String(",
    "          (it && (it.name || it.Name || it.label || it.title || it.hospitalName || it.schoolName || it.itiName)) ||",
    "          a.name || a.Name || a.label || a.title ||",
    "          a.school_name || a.SCHOOL_NAME || a.schoolName || a.SCHOOLNAME ||",
    "          a.iti_name || a.ITI_NAME || a.itiName ||",
    "          a.hospital_name || a.HOSPITAL_NAME || a.hospitalName ||",
    "          p.name || p.Name || p.label || p.title ||",
    "          p.school_name || p.SCHOOL_NAME || p.schoolName || p.SCHOOLNAME ||",
    "          p.iti_name || p.ITI_NAME || p.itiName ||",
    "          p.hospital_name || p.HOSPITAL_NAME || p.hospitalName ||",
    "          ((categoryLabel || \"Location\") + \" \" + String((idx || 0) + 1))",
    "        );",
    "      }",
    "",
    "      function itemDistanceMeters(it, fallbackMeters) {",
    "        var a = it && it.attributes ? it.attributes : {};",
    "        var p = it && it.properties ? it.properties : {};",
    "        var m =",
    "          numOrNull(it && (it.nearestDistanceM || it.distanceM || it.distance_m || it.dM)) ||",
    "          numOrNull(a.nearestDistanceM || a.distanceM || a.distance_m || a.dM) ||",
    "          numOrNull(p.nearestDistanceM || p.distanceM || p.distance_m || p.dM);",
    "        if (m != null) return m;",
    "",
    "        var km =",
    "          numOrNull(it && (it.distanceKm || it.distance_km)) ||",
    "          numOrNull(a.distanceKm || a.distance_km) ||",
    "          numOrNull(p.distanceKm || p.distance_km);",
    "        if (km != null) return km * 1000;",
    "",
    "        var lbl =",
    "          (it && (it.distanceLabel || it.distance_label)) ||",
    "          a.distanceLabel || a.distance_label ||",
    "          p.distanceLabel || p.distance_label;",
    "        if (lbl != null) {",
    "          var txt = String(lbl).toLowerCase();",
    "          var mm = txt.match(/([\\d.]+)/);",
    "          if (mm && mm[1]) {",
    "            var val = Number(mm[1]);",
    "            if (isFinite(val)) return txt.indexOf(\"km\") >= 0 ? val * 1000 : val;",
    "          }",
    "        }",
    "        return numOrNull(fallbackMeters);",
    "      }",
    "",
    "      var categories = summary && Array.isArray(summary.categories) ? summary.categories : [];",
    "      var selectedKeysMap = {};",
    "      var selectedCount = 0;",
    "      if (typeof window !== \"undefined\" && Array.isArray(window.msmeGisSelectedCommunityCategoryKeys)) {",
    "        window.msmeGisSelectedCommunityCategoryKeys.forEach(function (k) {",
    "          var kk = String(k || \"\").toLowerCase().trim();",
    "          if (!kk) return;",
    "          if (!selectedKeysMap[kk]) {",
    "            selectedKeysMap[kk] = true;",
    "            selectedCount++;",
    "          }",
    "        });",
    "      }",
    "      for (var ci = 0; ci < categories.length; ci++) {",
    "        var crow = categories[ci] || {};",
    "        var crowKey = String(crow.key || \"\").toLowerCase().trim();",
    "        if (selectedCount > 0 && !selectedKeysMap[crowKey]) continue;",
    "        var categoryLabel = String(crow.label || crow.key || \"Category\");",
    "        var fallbackMeters = numOrNull(crow.nearestDistanceM || crow.distanceM || crow.distance_m || crow.dM);",
    "        var items = asList(crow);",
    "        if (items.length) {",
    "          for (var ii = 0; ii < items.length; ii++) {",
    "            var dM0 = itemDistanceMeters(items[ii], fallbackMeters);",
    "            if (dM0 == null) continue;",
    "            distanceRows.push({",
    "              category: categoryLabel,",
    "              name: itemName(items[ii], categoryLabel, ii),",
    "              distanceM: dM0",
    "            });",
    "          }",
    "          continue;",
    "        }",
    "        if (crow.nearestItem) {",
    "          var dM1 = itemDistanceMeters(crow.nearestItem, fallbackMeters);",
    "          if (dM1 != null) {",
    "            distanceRows.push({",
    "              category: categoryLabel,",
    "              name: itemName(crow.nearestItem, categoryLabel, 0),",
    "              distanceM: dM1",
    "            });",
    "          }",
    "        }",
    "      }",
    "",
    "      function categoryRank(label) {",
    "        var c = String(label || \"\").toLowerCase();",
    "        if (c.indexOf(\"school\") >= 0) return 0;",
    "        if (c.indexOf(\"hospital\") >= 0 && c.indexOf(\"private\") < 0) return 1;",
    "        if (c.indexOf(\"airport\") >= 0) return 2;",
    "        if (c.indexOf(\"private hospital\") >= 0) return 3;",
    "        if (c.indexOf(\"police station\") >= 0) return 4;",
    "        if (c.indexOf(\"industrial\") >= 0) return 5;",
    "        if (c.indexOf(\"aayush\") >= 0 && c.indexOf(\"bharat\") >= 0) return 6;",
    "        if (c.indexOf(\"hsvp\") >= 0 && c.indexOf(\"plot\") >= 0) return 7;",
    "        if (c.indexOf(\"hsvp\") >= 0 && c.indexOf(\"sector\") >= 0) return 8;",
    "        if (c.indexOf(\"electric station\") >= 0) return 9;",
    "        return 999;",
    "      }",
    "",
    "      distanceRows.sort(function (a, b) {",
    "        var ra = categoryRank(a && a.category);",
    "        var rb = categoryRank(b && b.category);",
    "        if (ra !== rb) return ra - rb;",
    "",
    "        var da = Number(a && a.distanceM);",
    "        var db = Number(b && b.distanceM);",
    "        if (!isFinite(da) && !isFinite(db)) {",
    "          var ca0 = String((a && a.category) || \"\");",
    "          var cb0 = String((b && b.category) || \"\");",
    "          var byCat0 = ca0.localeCompare(cb0);",
    "          if (byCat0) return byCat0;",
    "          return String((a && a.name) || \"\").localeCompare(String((b && b.name) || \"\"));",
    "        }",
    "        if (!isFinite(da)) return 1;",
    "        if (!isFinite(db)) return -1;",
    "        if (da !== db) return da - db;",
    "",
    "        var ca = String((a && a.category) || \"\");",
    "        var cb = String((b && b.category) || \"\");",
    "        var byCat = ca.localeCompare(cb);",
    "        if (byCat) return byCat;",
    "        return String((a && a.name) || \"\").localeCompare(String((b && b.name) || \"\"));",
    "      });",
    "    } catch (ePdfRows) {",
    "      console.warn(\"[closest pdf] distance page build failed\", ePdfRows);",
    "    }",
    "",
    "    function formatKmFromMeters(m) {",
    "      var n = Number(m);",
    "      if (!isFinite(n) || n < 0) return \"-\";",
    "      return (n / 1000).toFixed(2) + \" km\";",
    "    }",
    "",
    "    doc.addPage();",
    "    var p2W = doc.internal.pageSize.getWidth();",
    "    var p2H = doc.internal.pageSize.getHeight();",
    "    var p2M = 12;",
    "    var tableX = p2M;",
    "    var tableW = p2W - p2M * 2;",
    "    var col1W = 13;",
    "    var col2W = 38;",
    "    var col4W = 34;",
    "    var col3W = tableW - col1W - col2W - col4W;",
    "    var headY = 20;",
    "    var rowH = 8;",
    "",
    "    doc.setFillColor(255, 255, 255);",
    "    doc.rect(0, 0, p2W, p2H, \"F\");",
    "    doc.setTextColor(22, 40, 68);",
    "    doc.setFont(\"helvetica\", \"bold\");",
    "    doc.setFontSize(14);",
    "    doc.text(\"Nearby Features Distance Report\", p2M, headY);",
    "    doc.setFont(\"helvetica\", \"normal\");",
    "    doc.setFontSize(10);",
    "    doc.setTextColor(70, 86, 110);",
    "    doc.text(\"Distance from selected point\", p2M, headY + 6);",
    "",
    "    var y = headY + 14;",
    "    function drawHeader() {",
    "      doc.setFillColor(242, 246, 251);",
    "      doc.rect(tableX, y, tableW, rowH, \"F\");",
    "      doc.setDrawColor(190, 206, 224);",
    "      doc.setLineWidth(0.3);",
    "      doc.rect(tableX, y, tableW, rowH, \"S\");",
    "      doc.line(tableX + col1W, y, tableX + col1W, y + rowH);",
    "      doc.line(tableX + col1W + col2W, y, tableX + col1W + col2W, y + rowH);",
    "      doc.line(tableX + col1W + col2W + col3W, y, tableX + col1W + col2W + col3W, y + rowH);",
    "      doc.setFont(\"helvetica\", \"bold\");",
    "      doc.setFontSize(10);",
    "      doc.setTextColor(34, 51, 76);",
    "      doc.text(\"No.\", tableX + 3, y + 5.6);",
    "      doc.text(\"Category\", tableX + col1W + 2, y + 5.6);",
    "      doc.text(\"Name\", tableX + col1W + col2W + 2, y + 5.6);",
    "      doc.text(\"Distance\", tableX + col1W + col2W + col3W + 2, y + 5.6);",
    "      y += rowH;",
    "    }",
    "",
    "    drawHeader();",
    "",
    "    if (!distanceRows.length) {",
    "      doc.setFont(\"helvetica\", \"normal\");",
    "      doc.setFontSize(10);",
    "      doc.setTextColor(80, 92, 112);",
    "      doc.text(\"No nearby distance data available for current selection.\", tableX + 2, y + 7);",
    "    } else {",
    "      for (var s = 0; s < distanceRows.length; s++) {",
    "        var entry = distanceRows[s] || {};",
    "        var catLines = doc.splitTextToSize(String(entry.category || \"-\"), col2W - 3);",
    "        var nameLines = doc.splitTextToSize(String(entry.name || \"-\"), col3W - 3);",
    "        if (!catLines || !catLines.length) catLines = [\"-\"];",
    "        if (!nameLines || !nameLines.length) nameLines = [\"-\"];",
    "        var cellH = Math.max(rowH, Math.max(catLines.length, nameLines.length) * 4.4 + 4);",
    "",
    "        if (y + cellH > p2H - p2M) {",
    "          doc.addPage();",
    "          y = p2M;",
    "          drawHeader();",
    "        }",
    "",
    "        doc.setDrawColor(206, 218, 233);",
    "        doc.setLineWidth(0.25);",
    "        doc.rect(tableX, y, tableW, cellH, \"S\");",
    "        doc.line(tableX + col1W, y, tableX + col1W, y + cellH);",
    "        doc.line(tableX + col1W + col2W, y, tableX + col1W + col2W, y + cellH);",
    "        doc.line(tableX + col1W + col2W + col3W, y, tableX + col1W + col2W + col3W, y + cellH);",
    "",
    "        doc.setFont(\"helvetica\", \"normal\");",
    "        doc.setFontSize(9.5);",
    "        doc.setTextColor(38, 48, 64);",
    "        doc.text(String(s + 1), tableX + 4, y + 5.5);",
    "        doc.text(catLines, tableX + col1W + 2, y + 5.5);",
    "        doc.text(nameLines, tableX + col1W + col2W + 2, y + 5.5);",
    "        doc.text(formatKmFromMeters(entry.distanceM), tableX + col1W + col2W + col3W + 2, y + 5.5);",
    "        y += cellH;",
    "      }",
    "    }",
    "",
    "    doc.save(filename);",
    "    setStatus(\"Map PDF downloaded with all nearby distance rows.\");",
    "  }).catch(function (e3) {",
    "    console.warn(\"[closest pdf] map screenshot failed\", e3);",
    "    window.alert(\"Map screenshot failed. Please try again.\");",
    "  });",
    "}",
  ].join("\n");

  if (closestPdfFnPattern.test(out)) {
    out = out.replace(closestPdfFnPattern, closestPdfFnReplacement + "$2");
  } else {
    console.warn("[msme runtime patch] closest PDF patch not applied.");
  }

  var hsvpSectorZoomPattern =
    /(function zoomToHsvpSectorArea\(sectorKeyValue\)\s*\{[\s\S]*?\n\})\r?\n\r?\nfunction loadHsvpPlotsBySector/;
  var hsvpSectorZoomReplacement = [
    "function zoomToHsvpSectorArea(sectorKeyValue) {",
    "  var bucket = sectorKeyValue ? hsvpSectorBuckets[String(sectorKeyValue)] : null;",
    "  if (!bucket || !bucket.features || !bucket.features.length) return Promise.resolve(false);",
    "",
    "  var xmin = Infinity;",
    "  var ymin = Infinity;",
    "  var xmax = -Infinity;",
    "  var ymax = -Infinity;",
    "  var validCount = 0;",
    "  var firstPt = null;",
    "",
    "  bucket.features.forEach(function (f) {",
    "    var p = hsvpPoint32643FromFeature(f);",
    "    if (!p) return;",
    "    if (!firstPt) firstPt = p;",
    "    xmin = Math.min(xmin, p.x);",
    "    ymin = Math.min(ymin, p.y);",
    "    xmax = Math.max(xmax, p.x);",
    "    ymax = Math.max(ymax, p.y);",
    "    validCount++;",
    "  });",
    "",
    "  if (!validCount || !firstPt) {",
    "    return Promise.resolve(false);",
    "  }",
    "",
    "  if (validCount === 1) {",
    "    return projection.load().then(function () {",
    "      var pWeb = projection.project(firstPt, SR_WEB);",
    "      if (!pWeb) return false;",
    "      return view.goTo({ center: pWeb, zoom: 15, padding: getUiZoomPadding() }).then(function () {",
    "        return true;",
    "      }).catch(function () {",
    "        return false;",
    "      });",
    "    }).catch(function () {",
    "      return false;",
    "    });",
    "  }",
    "",
    "  var ext = new Extent({",
    "    xmin: xmin,",
    "    ymin: ymin,",
    "    xmax: xmax,",
    "    ymax: ymax,",
    "    spatialReference: SR_METER",
    "  });",
    "  return zoomToGeometry(ext, { expandFactor: 1.28 }).then(function () {",
    "    return true;",
    "  }).catch(function () {",
    "    return false;",
    "  });",
    "}",
  ].join("\n");

  if (hsvpSectorZoomPattern.test(out)) {
    out = out.replace(hsvpSectorZoomPattern, hsvpSectorZoomReplacement + "\n\nfunction loadHsvpPlotsBySector");
  } else {
    console.warn("[msme runtime patch] HSVP sector zoom patch not applied.");
  }

  var hsvpWireUiPattern = /\(function wireHsvpUi\(\)\s*\{[\s\S]*?\}\)\(\);/;
  var hsvpWireUiReplacement = [
    "(function wireHsvpUi() {",
    "  var hd = document.getElementById(\"hsvpDistrictSelect\");",
    "  if (hd) {",
    "    hd.addEventListener(\"change\", function () {",
    "      var dCode = this.value ? String(this.value).trim() : \"\";",
    "      if (!dCode) {",
    "        resetHsvpSectorAndPlotSelects();",
    "        loadHsvpPlots(\"\").catch(function (err0) {",
    "          console.warn(\"[hsvp district change: clear plots]\", err0);",
    "        });",
    "        return;",
    "      }",
    "",
    "      Promise.resolve()",
    "        .then(function () {",
    "          return zoomToHsvpDistrict(dCode);",
    "        })",
    "        .catch(function (err1) {",
    "          console.warn(\"[hsvp district change: zoom district]\", err1);",
    "        })",
    "        .then(function () {",
    "          return loadHsvpPlots(dCode);",
    "        })",
    "        .catch(function (err2) {",
    "          console.warn(\"[hsvp district change: load plots]\", err2);",
    "        });",
    "    });",
    "  }",
    "",
    "  var hs = document.getElementById(\"hsvpSectorSelect\");",
    "  if (hs) {",
    "    hs.addEventListener(\"change\", function () {",
    "      var sectorKeyValue = this.value ? String(this.value).trim() : \"\";",
    "      if (!sectorKeyValue) {",
    "        loadHsvpPlotsBySector(\"\").catch(function (err3) {",
    "          console.warn(\"[hsvp sector change: clear plots]\", err3);",
    "        });",
    "        return;",
    "      }",
    "",
    "      loadHsvpPlotsBySector(sectorKeyValue)",
    "        .then(function () {",
    "          return zoomToHsvpSectorArea(sectorKeyValue);",
    "        })",
    "        .then(function (zoomed) {",
    "          if (zoomed) return;",
    "          var plotSel = document.getElementById(\"hsvpPlotSelect\");",
    "          if (!plotSel || !plotSel.options || plotSel.options.length <= 1) return;",
    "          if (!plotSel.value) plotSel.selectedIndex = 1;",
    "          if (!plotSel.value) return;",
    "          return performHsvpLandZoom();",
    "        })",
    "        .catch(function (err4) {",
    "          console.warn(\"[hsvp sector change]\", err4);",
    "        });",
    "    });",
    "  }",
    "",
    "  var hp = document.getElementById(\"hsvpPlotSelect\");",
    "  if (hp) {",
    "    hp.addEventListener(\"change\", function () {",
    "      if (this.value) {",
    "        performHsvpLandZoom().catch(function (err5) {",
    "          console.warn(\"[hsvp plot change: zoom]\", err5);",
    "        });",
    "      }",
    "    });",
    "  }",
    "",
    "  var hb = document.getElementById(\"btnHsvpApply\");",
    "  if (hb) {",
    "    hb.addEventListener(\"click\", function () {",
    "      performHsvpLandZoom().catch(function (err6) {",
    "        console.warn(\"[hsvp button: zoom]\", err6);",
    "      });",
    "    });",
    "  }",
    "})();",
  ].join("\n");

  if (hsvpWireUiPattern.test(out)) {
    out = out.replace(hsvpWireUiPattern, hsvpWireUiReplacement);
  } else {
    console.warn("[msme runtime patch] HSVP UI wiring patch not applied.");
  }

  var proximityReportPattern =
    /publishAnalysisToolResult\("proximity",\s*msgP,\s*\{\s*count:\s*hits,\s*maxDistanceM:\s*maxD\s*\}\s*\);/;
  var proximityReportReplacement =
    'publishAnalysisToolResult("proximity", msgP, { count: hits, maxDistanceM: maxD, radiusM: maxD });';
  if (proximityReportPattern.test(out)) {
    out = out.replace(proximityReportPattern, proximityReportReplacement);
  } else {
    console.warn("[msme runtime patch] proximity report radius patch not applied.");
  }

  // When proximity succeeds, also trigger community-summary calculation for the drawn proximity buffer.
  var proximitySuccessBlockPattern =
    /else\s*\{\s*var msgP = "Proximity: " \+ hits \+ " villages within " \+ maxD \+ " m of selected POI\."\;\s*setStatus\(msgP\);\s*publishAnalysisToolResult\("proximity",\s*msgP,\s*\{\s*count:\s*hits,\s*maxDistanceM:\s*maxD,\s*radiusM:\s*maxD\s*\}\);\s*\}/;
  var proximitySuccessBlockReplacement = [
    "else {",
    '      var msgP = "Proximity: " + hits + " villages within " + maxD + " m of selected POI.";',
    "      setStatus(msgP);",
    '      var baseProxReport = publishAnalysisToolResult("proximity", msgP, { count: hits, maxDistanceM: maxD, radiusM: maxD });',
    "      var proxSummaryGeom = proxPreview32643 || buildFallbackAnchorBuffer32643(qg, maxD);",
    "      if (proxSummaryGeom) {",
    "        publishBufferCommunitySummaryInBackground(baseProxReport, proxSummaryGeom, null);",
    "      }",
    "    }",
  ].join("\n");
  if (proximitySuccessBlockPattern.test(out)) {
    out = out.replace(proximitySuccessBlockPattern, proximitySuccessBlockReplacement);
  } else {
    console.warn("[msme runtime patch] proximity success community-summary patch not applied.");
  }

  // In proximity mode, show the clicked-point buffer on map (same UX expectation as buffer/closest tools).
  var proximityBufferPreviewPattern =
    /var qg = activeQueryGeometry\(\);\s*var hasPointAnchor = !!\(bufferMarkPoint32643 && bufferMarkPoint32643\.type === "point"\);/;
  var proximityBufferPreviewReplacement = [
    'var qg = activeQueryGeometry();',
    '  var proxPreview32643 = buildFallbackAnchorBuffer32643(qg, maxD);',
    '  if (proxPreview32643) {',
    '    var proxPreviewWeb = projection.project(proxPreview32643, SR_WEB);',
    '    if (proxPreviewWeb) {',
    '      resultsLayer.add(new Graphic({',
    '        geometry: proxPreviewWeb,',
    '        symbol: symBuffer,',
    '        attributes: { type: "proximity-buffer", radiusM: maxD }',
    '      }));',
    '    }',
    '  }',
    '  var hasPointAnchor = !!(bufferMarkPoint32643 && bufferMarkPoint32643.type === "point");',
  ].join("\n");
  if (proximityBufferPreviewPattern.test(out)) {
    out = out.replace(proximityBufferPreviewPattern, proximityBufferPreviewReplacement);
  } else {
    console.warn("[msme runtime patch] proximity buffer preview patch not applied.");
  }

  // Avoid blocking browser alert for zero-hit proximity runs; keep workflow smooth.
  var proximityNoHitAlertPattern = /if\s*\(!hits\)\s*alertNoData\("proximity"\);/;
  var proximityNoHitAlertReplacement =
    [
      'if (!hits) {',
      '  var msgP0 = "No nearby results found for proximity. Increase distance and try again.";',
      '  setStatus(msgP0);',
      '  var proxNoHitReport = publishAnalysisToolResult("proximity", msgP0, { count: 0, maxDistanceM: maxD, radiusM: maxD });',
      '  var proxSummaryGeom0 = proxPreview32643 || buildFallbackAnchorBuffer32643(qg, maxD);',
      '  if (proxSummaryGeom0) {',
      '    publishBufferCommunitySummaryInBackground(proxNoHitReport, proxSummaryGeom0, null);',
      '  }',
      '}',
    ].join("\n");
  if (proximityNoHitAlertPattern.test(out)) {
    out = out.replace(proximityNoHitAlertPattern, proximityNoHitAlertReplacement);
  } else {
    console.warn("[msme runtime patch] proximity no-hit alert patch not applied.");
  }

  // Buffer run should still work when legacy UI controls (bufRoadLayer/bufDist) are hidden.
  var runBufferUiFallbackPattern =
    /var roadLayerEl = document\.getElementById\("bufRoadLayer"\);\s*var roadLayerId = parseInt\(roadLayerEl\.value, 10\);\s*var roadSourceText = roadLayerEl && roadLayerEl\.selectedOptions && roadLayerEl\.selectedOptions\[0\]\s*\? String\(roadLayerEl\.selectedOptions\[0\]\.text \|\| ""\)\.trim\(\)\s*:\s*"Road source";\s*var distM = parseFloat\(document\.getElementById\("bufDist"\)\.value\) \|\| 1500;/;
  var runBufferUiFallbackReplacement = [
    'var roadLayerEl = document.getElementById("bufRoadLayer");',
    '  var roadLayerId = roadLayerEl ? parseInt(roadLayerEl.value, 10) : NaN;',
    '  if (!isFinite(roadLayerId)) roadLayerId = 4;',
    '  var roadSourceText = roadLayerEl && roadLayerEl.selectedOptions && roadLayerEl.selectedOptions[0]',
    '    ? String(roadLayerEl.selectedOptions[0].text || "").trim()',
    '    : "Roads (line)";',
    '  var distInputEl = document.getElementById("bufDist");',
    '  var distM = distInputEl ? parseFloat(distInputEl.value) : NaN;',
    '  if (!isFinite(distM) || distM <= 0) distM = readBufferPickDistanceMetersFromUi();',
    '  if (!isFinite(distM) || distM <= 0) distM = 1500;',
    '  setBufferDistanceMeters(distM);',
  ].join("\n");
  if (runBufferUiFallbackPattern.test(out)) {
    out = out.replace(runBufferUiFallbackPattern, runBufferUiFallbackReplacement);
  } else {
    console.warn("[msme runtime patch] runBuffer UI fallback patch not applied.");
  }

  // Ignore plain random map clicks unless identify tools are explicitly active.
  var mapClickSelectGuardPattern =
    /if \(!mapSelectionAccumulateMode\) \{\s*identifyLayer\.removeAll\(\);/;
  var mapClickSelectGuardReplacement = [
    "if (!selectParcelToolActive && !mapSelectionAccumulateMode) {",
    "    return;",
    "  }",
    "  if (!mapSelectionAccumulateMode) {",
    "    identifyLayer.removeAll();",
  ].join("\n");
  if (mapClickSelectGuardPattern.test(out)) {
    out = out.replace(mapClickSelectGuardPattern, mapClickSelectGuardReplacement);
  } else {
    console.warn("[msme runtime patch] map click select guard patch not applied.");
  }

  // Expose MapView for React UI (custom basemap dropdown) — first UI mount on the main map view.
  var msmeMapViewBridgePattern = /view\.ui\.add/;
  var msmeMapViewBridgeReplacement =
    'try{if(typeof window!=="undefined")window.__msmeGisMapView=view;}catch(_msmeMvBr0){}view.ui.add';
  if (msmeMapViewBridgePattern.test(out)) {
    out = out.replace(msmeMapViewBridgePattern, msmeMapViewBridgeReplacement);
  } else {
    console.warn("[msme runtime patch] map view bridge (__msmeGisMapView) not applied.");
  }

  return out;
}

// Eval parses code as a script; import.meta is invalid there, so rewrite to a safe alias first.
const __legacySource = patchLegacySource([c1, c2, c3].join("").replace(/import\.meta/g, "__msmeImportMeta"));

const __legacyExports = eval("(() => {\n" + __legacySource + "\nreturn { initMsmeWebGis, applyMsmeGisUiStrings };\n})()");

export const initMsmeWebGis = __legacyExports.initMsmeWebGis;
export { applyMsmeGisUiStrings };

const TRACK_TOOL_BUTTON_ID = "btnTrackPickPoint";
const TRACK_TOOL_LAYER_ID = 2; // Transportation_Infrastructure -> Rail Network
const TRACK_TOOL_BUFFER_METERS = 500;
const TRACK_TOOL_PICK_SNAP_METERS = 1500;

function installRailTrackBufferTool() {
  if (typeof window === "undefined") return;
  if (window.__msmeRailTrackToolInstalled) return;
  window.__msmeRailTrackToolInstalled = true;

  var state = {
    buttonEl: null,
    clickHandle: null,
    pickMode: false,
    running: false,
    graphicsLayer: null,
    viewRef: null,
    prevCursor: "",
  };

  function setButtonLabel() {
    if (!state.buttonEl) return;
    state.buttonEl.textContent = "Track Buffer (All, 500m)";
    state.buttonEl.setAttribute("aria-pressed", "false");
    state.buttonEl.title = "Create 500m both-side buffer for all railway tracks";
  }

  function setStatus(msg) {
    var statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = String(msg || "");
  }

  function normalizeTrackBufferMeters(distanceM) {
    var n = Number(distanceM);
    if (!isFinite(n) || n <= 0) return TRACK_TOOL_BUFFER_METERS;
    return Math.round(n);
  }

  function trackWidthToSideBufferMeters(widthM) {
    var width = normalizeTrackBufferMeters(widthM);
    var side = Math.round(width / 2);
    if (!isFinite(side) || side <= 0) side = Math.max(1, Math.round(TRACK_TOOL_BUFFER_METERS / 2));
    return side;
  }

  function clearLegacyTrackConflicts() {
    try {
      window.dispatchEvent(new CustomEvent("msme-gis-clear-community-graphics"));
    } catch (e0) {}
  }

  function ensureGraphicsLayer(view) {
    if (!view || !view.map) return null;
    if (state.graphicsLayer && !state.graphicsLayer.destroyed) {
      if (view.map.layers && view.map.layers.includes(state.graphicsLayer)) return state.graphicsLayer;
      try {
        view.map.add(state.graphicsLayer);
      } catch (e0) {}
      return state.graphicsLayer;
    }
    state.graphicsLayer = new GraphicsLayer({
      id: "__msmeRailTrackBufferLayer",
      title: "Track buffer results",
      listMode: "hide",
    });
    view.map.add(state.graphicsLayer);
    return state.graphicsLayer;
  }

  function clearClickHandle() {
    if (!state.clickHandle) return;
    try {
      state.clickHandle.remove();
    } catch (e0) {}
    state.clickHandle = null;
  }

  function setPickCursor(view) {
    if (!view || !view.container) return;
    try {
      state.prevCursor = String(view.container.style.cursor || "");
      view.container.style.cursor = "crosshair";
    } catch (e0) {}
  }

  function resetPickCursor(view) {
    if (!view || !view.container) return;
    try {
      view.container.style.cursor = state.prevCursor || "";
    } catch (e0) {}
    state.prevCursor = "";
  }

  function stopPickMode() {
    var view = state.viewRef || window.__msmeGisMapView;
    state.pickMode = false;
    clearClickHandle();
    resetPickCursor(view);
    setButtonLabel();
  }

  function featureGeometryToEngine(geomJson) {
    if (!geomJson) return null;
    try {
      var geom = geomFromJSON(geomJson);
      if (!geom) return null;
      return toEngineSR(ensureSR32643(geom));
    } catch (e0) {
      return null;
    }
  }

  function polylineVertexCount(g) {
    if (!g || String(g.type || "").toLowerCase() !== "polyline") return 0;
    var paths = Array.isArray(g.paths) ? g.paths : [];
    var count = 0;
    for (var i = 0; i < paths.length; i++) {
      var path = Array.isArray(paths[i]) ? paths[i] : [];
      count += path.length;
    }
    return count;
  }

  function isUsableRailPolyline(g) {
    if (!g || !geometryIsUsable(g)) return false;
    if (String(g.type || "").toLowerCase() !== "polyline") return false;
    return polylineVertexCount(g) >= 2;
  }

  function resolveRailLineForBuffer(anchor32643, railLine32643, bufferMeters) {
    if (!isUsableRailPolyline(railLine32643)) return railLine32643;
    if (!anchor32643 || anchor32643.type !== "point") return railLine32643;

    var clipRadiusM = Math.max(TRACK_TOOL_PICK_SNAP_METERS, Math.round(Number(bufferMeters || 0) * 6));
    if (!isFinite(clipRadiusM) || clipRadiusM <= 0) clipRadiusM = TRACK_TOOL_PICK_SNAP_METERS;
    var clipZone = null;
    try {
      clipZone = geometryEngine.buffer(anchor32643, clipRadiusM, "meters");
    } catch (e0) {
      clipZone = null;
    }
    if (!clipZone) return railLine32643;

    try {
      var clipped = geometryEngine.intersect(railLine32643, clipZone);
      if (!clipped) return railLine32643;
      if (Array.isArray(clipped)) {
        for (var i = 0; i < clipped.length; i++) {
          if (isUsableRailPolyline(clipped[i])) return clipped[i];
        }
        return railLine32643;
      }
      if (isUsableRailPolyline(clipped)) return clipped;
    } catch (e1) {}
    return railLine32643;
  }

  function buildRailBufferFromLines(lineInputs, bufferMeters) {
    var lines = [];
    if (Array.isArray(lineInputs)) {
      lineInputs.forEach(function (g) {
        if (isUsableRailPolyline(g)) lines.push(g);
      });
    } else if (isUsableRailPolyline(lineInputs)) {
      lines.push(lineInputs);
    }
    if (!lines.length) return null;

    var bufferGeom = null;
    try {
      bufferGeom = geometryEngine.buffer(lines, bufferMeters, "meters", true);
    } catch (e0) {
      bufferGeom = null;
    }
    if (Array.isArray(bufferGeom)) {
      var valid = bufferGeom.filter(function (g) {
        return !!(g && geometryIsUsable(g));
      });
      if (valid.length === 1) bufferGeom = valid[0];
      else if (valid.length > 1) bufferGeom = geometryEngine.union(valid);
      else bufferGeom = null;
    }
    if (!bufferGeom || !geometryIsUsable(bufferGeom)) {
      try {
        bufferGeom = geometryEngine.buffer(lines, bufferMeters, "meters", false);
      } catch (e1) {
        bufferGeom = null;
      }
      if (Array.isArray(bufferGeom)) {
        var valid2 = bufferGeom.filter(function (g2) {
          return !!(g2 && geometryIsUsable(g2));
        });
        if (valid2.length === 1) bufferGeom = valid2[0];
        else if (valid2.length > 1) bufferGeom = geometryEngine.union(valid2);
        else bufferGeom = null;
      }
    }
    return bufferGeom && geometryIsUsable(bufferGeom) ? bufferGeom : null;
  }

  function pickNearestRailFeature(anchor32643, railFeatures) {
    var best = null;
    var bestDist = Infinity;
    (railFeatures || []).forEach(function (f) {
      var g32643 = featureGeometryToEngine(f && f.geometry);
      if (!isUsableRailPolyline(g32643)) return;
      var dM = distanceFromPointToGeometry(anchor32643, g32643);
      if (!isFinite(dM) || dM < 0) return;
      if (dM < bestDist) {
        bestDist = dM;
        best = {
          feature: f,
          geometry: g32643,
          snapDistanceM: dM,
        };
      }
    });
    return best;
  }

  function addTrackResultGraphics(
    view,
    anchor32643,
    lineBuffer32643,
    selectedRail32643,
    snapDistanceM,
    bufferWidthMeters,
    sideBufferMeters,
  ) {
    var layer = ensureGraphicsLayer(view);
    if (!layer) return;

    layer.removeAll();

    var bufferWeb = projection.project(lineBuffer32643, SR_WEB) || lineBuffer32643 || null;
    var selectedRailWeb = projection.project(selectedRail32643, SR_WEB) || selectedRail32643 || null;
    var anchorWeb = projection.project(anchor32643, SR_WEB) || anchor32643 || null;
    if (bufferWeb) {
      layer.add(
        new Graphic({
          geometry: bufferWeb,
          symbol: new SimpleFillSymbol({
            color: [56, 189, 248, 0.2],
            outline: new SimpleLineSymbol({ color: [2, 132, 199, 0.95], width: 1.5 }),
          }),
          attributes: { type: "track-buffer", radiusM: sideBufferMeters, widthM: bufferWidthMeters },
        }),
      );
    }
    if (selectedRailWeb) {
      layer.add(
        new Graphic({
          geometry: selectedRailWeb,
          symbol: new SimpleLineSymbol({
            color: [190, 24, 93, 1],
            width: 4,
            style: "solid",
          }),
          attributes: { type: "rail-track-selected" },
        }),
      );
    }
    if (anchorWeb) {
      layer.add(
        new Graphic({
          geometry: anchorWeb,
          symbol: new SimpleMarkerSymbol({
            style: "circle",
            size: 10,
            color: [22, 163, 74, 0.96],
            outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1.2 }),
          }),
          attributes: { type: "track-anchor" },
        }),
      );
    }

    var extentSrc = bufferWeb && bufferWeb.extent ? bufferWeb : anchorWeb;
    if (view && extentSrc && extentSrc.extent) {
      view
        .goTo({ target: extentSrc.extent.expand(1.35), padding: { top: 80, right: 40, bottom: 60, left: 40 } })
        .catch(function () {
          return null;
        });
    }

    var snapText = isFinite(snapDistanceM) ? " (snap: " + Math.round(snapDistanceM) + " m)" : "";
    setStatus(
      "Track buffer ready: selected railway track, " +
        bufferWidthMeters +
        " m width (" +
        sideBufferMeters +
        " m each side)." +
        snapText,
    );
  }

  function runTrackNetworkBufferForAll(view, distanceM) {
    if (state.running) {
      setStatus("Track: buffer generation already in progress...");
      return Promise.resolve(false);
    }
    var bufferMeters = normalizeTrackBufferMeters(distanceM);
    state.running = true;
    return projection
      .load()
      .then(function () {
        if (!view || view.destroyed) return null;
        clearLegacyTrackConflicts();
        setStatus("Track: loading railway network...");
        return queryLayer(TRANS_MS, TRACK_TOOL_LAYER_ID, {
          where: "1=1",
          outFields: "objectid",
          returnGeometry: true,
          resultRecordCount: 2000,
        })
          .then(function (data) {
            var features = data && Array.isArray(data.features) ? data.features : [];
            var lineGeoms = [];
            features.forEach(function (f) {
              var g32643 = featureGeometryToEngine(f && f.geometry);
              if (!g32643 || !geometryIsUsable(g32643)) return;
              if (String(g32643.type || "").toLowerCase() !== "polyline") return;
              lineGeoms.push(g32643);
            });
            if (!lineGeoms.length) {
              setStatus("Track: railway line data not available for buffer.");
              return null;
            }
            var fullBuffer32643 = null;
            try {
              fullBuffer32643 = geometryEngine.buffer(lineGeoms, bufferMeters, "meters", true);
            } catch (eBuf0) {
              fullBuffer32643 = null;
            }
            if (Array.isArray(fullBuffer32643)) {
              var unionInput0 = fullBuffer32643.filter(function (g) {
                return !!(g && geometryIsUsable(g));
              });
              if (unionInput0.length === 1) fullBuffer32643 = unionInput0[0];
              else if (unionInput0.length > 1) fullBuffer32643 = geometryEngine.union(unionInput0);
              else fullBuffer32643 = null;
            }
            if (!fullBuffer32643 || !geometryIsUsable(fullBuffer32643)) {
              var pieces = null;
              try {
                pieces = geometryEngine.buffer(lineGeoms, bufferMeters, "meters", false);
              } catch (eBuf1) {
                pieces = null;
              }
              if (Array.isArray(pieces) && pieces.length) {
                var unionInput1 = pieces.filter(function (g2) {
                  return !!(g2 && geometryIsUsable(g2));
                });
                if (unionInput1.length === 1) fullBuffer32643 = unionInput1[0];
                else if (unionInput1.length > 1) fullBuffer32643 = geometryEngine.union(unionInput1);
              }
            }
            if (!fullBuffer32643 || !geometryIsUsable(fullBuffer32643)) {
              setStatus("Track: railway network buffer create nahi hua.");
              return null;
            }

            var layer = ensureGraphicsLayer(view);
            if (!layer) return null;
            layer.removeAll();

            var bufferWeb = projection.project(fullBuffer32643, SR_WEB) || fullBuffer32643 || null;
            if (bufferWeb) {
              layer.add(
                new Graphic({
                  geometry: bufferWeb,
                  symbol: new SimpleFillSymbol({
                    color: [56, 189, 248, 0.2],
                    outline: new SimpleLineSymbol({ color: [2, 132, 199, 0.95], width: 1.6 }),
                  }),
                  attributes: { type: "track-network-buffer", radiusM: bufferMeters },
                }),
              );
            }

            var maxLinesToDraw = Math.min(lineGeoms.length, 250);
            for (var i = 0; i < maxLinesToDraw; i++) {
              var lw = projection.project(lineGeoms[i], SR_WEB) || null;
              if (!lw) continue;
              layer.add(
                new Graphic({
                  geometry: lw,
                  symbol: new SimpleLineSymbol({
                    color: [190, 24, 93, 0.9],
                    width: 2.5,
                    style: "solid",
                  }),
                  attributes: { type: "rail-track-network-line" },
                }),
              );
            }

            if (view && bufferWeb && bufferWeb.extent) {
              view
                .goTo({ target: bufferWeb.extent.expand(1.12), padding: { top: 80, right: 40, bottom: 60, left: 40 } })
                .catch(function () {
                  return null;
                });
            }

            setStatus(
              "Track network buffer ready: " +
                lineGeoms.length +
                " railway segment(s), both side " +
                bufferMeters +
                " m buffer.",
            );
            return true;
          })
          .catch(function (err) {
            console.warn("[track network buffer] railway query failed", err);
            setStatus("Track: railway network query failed.");
            return null;
          });
      })
      .catch(function (err0) {
        console.warn("[track network buffer] projection failed", err0);
        setStatus("Track: map projection unavailable.");
        return null;
      })
      .finally(function () {
        state.running = false;
      });
  }

  function runTrackBufferForPoint(view, mapPoint, distanceM) {
    var bufferWidthMeters = normalizeTrackBufferMeters(distanceM);
    var sideBufferMeters = trackWidthToSideBufferMeters(bufferWidthMeters);
    return projection
      .load()
      .then(function () {
        if (!view || view.destroyed || !mapPoint) return null;
        var anchor32643 = projection.project(mapPoint, SR_METER) || null;
        if (!anchor32643) {
          setStatus("Track: selected point is invalid.");
          return null;
        }
        var pickZone32643 = geometryEngine.buffer(anchor32643, TRACK_TOOL_PICK_SNAP_METERS, "meters");
        if (!pickZone32643) {
          setStatus("Track: could not create track selection zone.");
          return null;
        }
        function queryByRadius(radiusM) {
          var zone = geometryEngine.buffer(anchor32643, radiusM, "meters");
          if (!zone) return Promise.resolve([]);
          var q = Object.assign(
            {
              where: "1=1",
              outFields: "*",
              returnGeometry: true,
              resultRecordCount: 2000,
            },
            geometryToQueryParams(zone),
          );
          return queryLayer(TRANS_MS, TRACK_TOOL_LAYER_ID, q)
            .then(function (data) {
              return data && Array.isArray(data.features) ? data.features : [];
            })
            .catch(function () {
              return [];
            });
        }

        var narrowRadiusM = Math.max(50, Math.min(300, Math.round(sideBufferMeters * 0.5)));
        return queryByRadius(narrowRadiusM)
          .then(function (nearFeatures) {
            if (nearFeatures && nearFeatures.length) return nearFeatures;
            return queryByRadius(TRACK_TOOL_PICK_SNAP_METERS);
          })
          .then(function (features) {
            var nearest = pickNearestRailFeature(anchor32643, features || []);
            if (nearest && nearest.geometry) return nearest;
            return queryLayer(TRANS_MS, TRACK_TOOL_LAYER_ID, {
              where: "1=1",
              outFields: "objectid",
              returnGeometry: true,
              resultRecordCount: 2000,
            })
              .then(function (allData) {
                var allFeatures = allData && Array.isArray(allData.features) ? allData.features : [];
                return pickNearestRailFeature(anchor32643, allFeatures);
              })
              .catch(function () {
                return null;
              });
          })
          .then(function (nearestResolved) {
            if (!nearestResolved || !nearestResolved.geometry) {
              setStatus("Track: nearest railway trace nahi mila. Track ke paas click karein.");
              return null;
            }
            var sourceRailLine32643 = resolveRailLineForBuffer(anchor32643, nearestResolved.geometry, sideBufferMeters);
            if (!isUsableRailPolyline(sourceRailLine32643)) {
              setStatus("Track: selected railway trace par valid line segment nahi mila.");
              return null;
            }
            var lineBuffer32643 = buildRailBufferFromLines([sourceRailLine32643], sideBufferMeters);
            if (!lineBuffer32643 || !geometryIsUsable(lineBuffer32643)) {
              setStatus("Track: selected railway trace par buffer create nahi hua.");
              return null;
            }
            addTrackResultGraphics(
              view,
              anchor32643,
              lineBuffer32643,
              sourceRailLine32643,
              nearestResolved.snapDistanceM,
              bufferWidthMeters,
              sideBufferMeters,
            );
            return true;
          })
          .catch(function (err) {
            console.warn("[track buffer] railway query failed", err);
            setStatus("Track: railway query failed.");
          });
      })
      .catch(function (err0) {
        console.warn("[track buffer] projection failed", err0);
        setStatus("Track: map projection unavailable.");
      });
  }

  function startPickMode(view, distanceM) {
    var bufferWidthMeters = normalizeTrackBufferMeters(distanceM);
    if (!view || view.destroyed) return;
    clearLegacyTrackConflicts();
    stopPickMode();
    state.pickMode = true;
    if (state.buttonEl) {
      state.buttonEl.textContent = "Track: Select on map";
      state.buttonEl.setAttribute("aria-pressed", "true");
      state.buttonEl.title = "Click on map near railway track";
    }
    setPickCursor(view);
    setStatus(
      "Track mode on: click selected railway track to create " +
        bufferWidthMeters +
        " m width parallel buffer.",
    );
    state.clickHandle = view.on("click", function (event) {
      if (!state.pickMode) return;
      stopPickMode();
      var mapPoint = event && event.mapPoint ? event.mapPoint : null;
      runTrackBufferForPoint(view, mapPoint, bufferWidthMeters);
    });
  }

  function wireButton() {
    var btn = document.getElementById(TRACK_TOOL_BUTTON_ID);
    if (!btn || btn === state.buttonEl) return;
    state.buttonEl = btn;
    state.buttonEl.textContent = "Track Buffer (All, 500m)";
    state.buttonEl.title = "Create 500m both-side buffer for all railway tracks";
    state.buttonEl.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      var view = window.__msmeGisMapView;
      if (!view || view.destroyed) {
        setStatus("Track tool unavailable: map not ready.");
        return;
      }
      stopPickMode();
      runTrackNetworkBufferForAll(view, TRACK_TOOL_BUFFER_METERS);
    });
  }

  function syncViewRef() {
    var view = window.__msmeGisMapView;
    if (state.viewRef === view) return;
    state.viewRef = view || null;
    stopPickMode();
    if (state.graphicsLayer && view && view.map && !view.map.layers.includes(state.graphicsLayer)) {
      try {
        view.map.add(state.graphicsLayer);
      } catch (e0) {}
    }
  }

  window.msmeGisRunTrackNetworkBuffer500 = function () {
    return window.msmeGisRunTrackNetworkBuffer(TRACK_TOOL_BUFFER_METERS);
  };

  window.msmeGisRunTrackNetworkBuffer = function (distanceM) {
    var view = window.__msmeGisMapView;
    if (!view || view.destroyed) {
      setStatus("Track tool unavailable: map not ready.");
      return Promise.resolve(false);
    }
    stopPickMode();
    return runTrackNetworkBufferForAll(view, distanceM);
  };

  window.msmeGisStartTrackPickWithDistance = function (distanceM) {
    var view = window.__msmeGisMapView;
    if (!view || view.destroyed) {
      setStatus("Track tool unavailable: map not ready.");
      return false;
    }
    startPickMode(view, distanceM);
    return true;
  };

  window.setInterval(function () {
    wireButton();
    syncViewRef();
  }, 800);
}

installRailTrackBufferTool();
