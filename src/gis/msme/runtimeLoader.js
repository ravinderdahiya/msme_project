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
    "    doc.save(filename);",
    "    setStatus(\"Map PDF downloaded with legend.\");",
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

  return out;
}

// Eval parses code as a script; import.meta is invalid there, so rewrite to a safe alias first.
const __legacySource = patchLegacySource([c1, c2, c3].join("").replace(/import\.meta/g, "__msmeImportMeta"));

const __legacyExports = eval("(() => {\n" + __legacySource + "\nreturn { initMsmeWebGis, applyMsmeGisUiStrings };\n})()");

export const initMsmeWebGis = __legacyExports.initMsmeWebGis;
export { applyMsmeGisUiStrings };
