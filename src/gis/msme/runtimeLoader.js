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
import { getToken } from "../../utils/authStorage.js";
import { handleGisUnauthorized } from "../../utils/gisAuthFailure.js";
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
import {
  extractPlaceDetailsFromIdentifyFlat,
  mergePlaceDetails,
  queryPlaceDetailsByPointWgs84,
} from "./placeDetailsHelpers.js";
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

import { HSACGGM_MAP_SERVICE_URLS } from "./arcgisMapServiceUrls.js";
import analysisPlaceContextSnippet from "./analysisPlaceContextSnippet.js";
import { queryAssemblyDetailsByPointWgs84 } from "./assemblyDetailsHelpers.js";
import c1 from "./runtimeChunks/chunk01.js";
import c2 from "./runtimeChunks/chunk02.js";
import c3 from "./runtimeChunks/chunk03.js";

const __msmeImportMeta = {
  env: (typeof import.meta !== "undefined" && import.meta && import.meta.env) ? import.meta.env : {},
};

function applyArcGisIdentityPolicy() {
  var env = __msmeImportMeta && __msmeImportMeta.env ? __msmeImportMeta.env : {};
  var useIdentity =
    String(env.VITE_ARCGIS_USE_IDENTITY || "").trim().toLowerCase() === "true";
  var portalUrl = String(env.VITE_ARCGIS_PORTAL_URL || "").trim();

  if (esriConfig && esriConfig.request) {
    // Public map services should not trigger IdentityManager/browser auth popups.
    esriConfig.request.useIdentity = useIdentity;
  }

  if (!useIdentity) {
    try {
      IdentityManager.destroyCredentials();
    } catch (_identityErr0) {}
  }

  if (portalUrl) {
    esriConfig.portalUrl = portalUrl.replace(/\/+$/, "");
  }
}

applyArcGisIdentityPolicy();

const MAP_PIN_PATH_LEGACY =
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

const POPUP_SR_WEB = new SpatialReference({ wkid: 3857 });

/** Stable map anchor for identify popup (always Web Mercator, matches MapView). */
function resolvePopupAnchorPoint(mapPoint) {
  if (!mapPoint || mapPoint.type !== "point") return mapPoint;
  const wkid = mapPoint.spatialReference && Number(mapPoint.spatialReference.wkid);
  if (wkid === 3857 || wkid === 102100) return mapPoint;
  try {
    const projected = projection.project(mapPoint, POPUP_SR_WEB);
    return projected && projected.type === "point" ? projected : mapPoint;
  } catch (eProj) {
    console.warn("[popup anchor]", eProj);
    return mapPoint;
  }
}

/** Keep popup above the red pin — not auto-docked to a screen corner. */
function repositionIdentifyPopup(view, mapPoint) {
  if (!view || view.destroyed || !view.popup || !mapPoint) return;
  const popup = view.popup;
  const anchor = resolvePopupAnchorPoint(mapPoint);
  const apply = function () {
    if (!view || view.destroyed || !popup || !popup.visible) return;
    try {
      popup.dockEnabled = false;
      popup.location = anchor;
      if (typeof popup.reposition === "function") popup.reposition();
    } catch (eRepo) {
      console.warn("[popup reposition]", eRepo);
    }
  };
  apply();
  if (typeof window !== "undefined") {
    window.requestAnimationFrame(apply);
    window.setTimeout(apply, 80);
  }
}

/** Minimize on identify popup; no auto-dock to corner; no default blue highlight. */
function configureMsmeMapPopupUi(view) {
  if (!view || view.destroyed || !view.popup) return;
  try {
    const popup = view.popup;
    popup.dockEnabled = false;
    popup.alignment = "top-center";
    popup.highlightEnabled = false;
    popup.dockOptions = {
      buttonEnabled: false,
      breakpoint: false,
    };
    if ("collisionEnabled" in popup) popup.collisionEnabled = true;
    popup.visibleElements = {
      closeButton: true,
      collapseButton: true,
      dockButton: false,
      featureNavigation: true,
      heading: true,
      spinner: true,
    };
  } catch (eCfg) {
    console.warn("[popup ui]", eCfg);
  }
}

function installIdentifyPopupLayoutHook() {
  if (typeof window === "undefined" || window.__msmeIdentifyPopupLayoutHook) return;
  window.__msmeIdentifyPopupLayoutHook = true;
  const previousNotify = window.notifyViewLayoutChanged;
  window.notifyViewLayoutChanged = function () {
    if (typeof previousNotify === "function") {
      try {
        previousNotify.apply(this, arguments);
      } catch (ePrev) {
        console.warn("[notifyViewLayoutChanged]", ePrev);
      }
    }
    const view = window.__msmeGisMapView;
    const loc = window.__msmeLastIdentifyPopupLocation;
    if (view && loc && view.popup && view.popup.visible) {
      repositionIdentifyPopup(view, loc);
    }
  };
}

function installMapPopupUiSetup() {
  if (typeof window === "undefined") return;
  let tries = 0;
  const timer = window.setInterval(function () {
    tries += 1;
    const view = window.__msmeGisMapView;
    if (view && !view.destroyed && view.popup) {
      configureMsmeMapPopupUi(view);
      window.clearInterval(timer);
      return;
    }
    if (tries >= 80) window.clearInterval(timer);
  }, 200);
}

function openIdentifyMapPopup(view, mapPoint, lat, lon, primaryLayerName, distM, flat) {
  if (!view || view.destroyed || !mapPoint || !view.popup) return;
  configureMsmeMapPopupUi(view);
  const anchorPoint = resolvePopupAnchorPoint(mapPoint);
  if (typeof window !== "undefined") {
    window.__msmeLastIdentifyPopupLocation = anchorPoint;
  }
  try {
    var syncPlace = extractPlaceDetailsFromIdentifyFlat(flat || [], ADMIN_MS);
    var popupHtml = buildSimpleIdentifyPopupHtml(
      lat,
      lon,
      primaryLayerName,
      distM,
      gisPh("mapPopupTitle"),
      syncPlace,
    );
    const popup = view.popup;
    try {
      if (popup.visible) popup.close();
    } catch (eClose0) {}
    view.openPopup({
      title: "",
      content: popupHtml,
      location: anchorPoint,
      updateLocationEnabled: true,
      collapsed: false,
    });
    repositionIdentifyPopup(view, anchorPoint);
    queryPlaceDetailsByPointWgs84({ lat: lat, lon: lon })
      .then(function (queried) {
        if (!view || view.destroyed || !view.popup || !view.popup.visible) return;
        var merged = mergePlaceDetails(syncPlace, queried);
        if (!merged) return;
        var updatedHtml = buildSimpleIdentifyPopupHtml(
          lat,
          lon,
          primaryLayerName,
          distM,
          gisPh("mapPopupTitle"),
          merged,
        );
        try {
          view.popup.content = updatedHtml;
          repositionIdentifyPopup(view, anchorPoint);
        } catch (eUp) {
          console.warn("[identify popup update]", eUp);
        }
      })
      .catch(function () {});
  } catch (ePop) {
    console.warn("[popup]", ePop);
  }
}

function patchLegacyMapServiceUrls(source) {
  if (!source) return source;
  var out = source;
  var isDev = Boolean(__msmeImportMeta.env && __msmeImportMeta.env.DEV);

  if (isDev) {
    out = out.replace(/https?:\/\/hsacggm\.in/gi, "/arcgis");
  }

  Object.keys(HSACGGM_MAP_SERVICE_URLS).forEach(function (key) {
    var direct = HSACGGM_MAP_SERVICE_URLS[key];
    if (!direct) return;
    var layerUrl = isDev ? direct.replace(/^https?:\/\/hsacggm\.in/i, "/arcgis") : direct;
    var escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    [
      new RegExp("https?:\\/\\/[^\"'`\\s]+\\/mapserver\\/service\\/" + escapedKey, "gi"),
      new RegExp("\\/msme_backend\\/api\\/mapserver\\/service\\/" + escapedKey, "gi"),
    ].forEach(function (re) {
      out = out.replace(re, layerUrl);
    });
  });
  return out;
}

function patchLegacySource(source) {
  if (!source) return source;
  var out = patchLegacyMapServiceUrls(source);
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

  // Expose a bridge so external tools (e.g. track buffer) can trigger community summary
  // using any computed polygon geometry instead of center-only fallback.
  var communitySummaryBridgePattern =
    /window\.msmeGisDownloadClosestPdf = function \(\) \{\s*buildClosestScreenPdfReport\(\);\s*\};/;
  var communitySummaryBridgeReplacement = [
    "window.msmeGisDownloadClosestPdf = function () {",
    "  buildClosestScreenPdfReport();",
    "};",
    "",
    "window.msmeGisRunCommunitySummaryForGeometry = function (geomInput, opts) {",
    "  opts = opts || {};",
    "  return projection.load().then(function () {",
    "    var gIn = geomInput || null;",
    "    if (!gIn) return false;",
    "    var g326 = toEngineSR(ensureSR32643(gIn));",
    "    if (!g326 || !geometryIsUsable(g326)) return false;",
    "    var radNum = Number(opts.radiusM);",
    "    var rad = isFinite(radNum) && radNum > 0 ? Math.max(1, Math.round(radNum)) : null;",
    "    var summaryMsg = opts.summary ? String(opts.summary) : \"Buffer area selected.\";",
    "    var base = publishAnalysisToolResult(\"buffer\", summaryMsg, {",
    "      selectionSource: opts.selectionSource ? String(opts.selectionSource) : \"external-geometry\",",
    "      radiusM: rad,",
    "      distanceM: rad,",
    "      roadSource: opts.roadSource ? String(opts.roadSource) : \"geometry-bridge\"",
    "    });",
    "    publishBufferCommunitySummaryInBackground(base, g326, null);",
    "    return true;",
    "  }).catch(function (e0) {",
    "    console.warn(\"[community summary bridge] failed\", e0);",
    "    return false;",
    "  });",
    "};",
    "",
    "function resolveCommunityQueryGeometry32643() {",
    "  var report = window.msmeGisGetAnalysisReportSnapshot ? window.msmeGisGetAnalysisReportSnapshot() : null;",
    "  var ctx = lastBufferExportContext || {};",
    "  var candidates = [];",
    "  if (report) {",
    "    candidates.push(report.summaryGeometryJson, report.queryGeometryJson, report.analysisGeometryJson);",
    "  }",
    "  candidates.push(ctx.queryGeometryJson, ctx.summaryGeometryJson);",
    "  for (var i = 0; i < candidates.length; i++) {",
    "    var gj = candidates[i];",
    "    if (!gj) continue;",
    "    try {",
    "      var g = geomFromJSON(gj);",
    "      if (!g) continue;",
    "      var g326 = toEngineSR(ensureSR32643(g));",
    "      if (g326 && geometryIsUsable(g326)) return g326;",
    "    } catch (eGeom0) {}",
    "  }",
    "  if (bufferMarkPoint32643 && bufferMarkPoint32643.type === \"point\") {",
    "    var rad = Number(report && report.radiusM);",
    "    if (!isFinite(rad) || rad <= 0) rad = Number(ctx && ctx.radiusM);",
    "    if (!isFinite(rad) || rad <= 0) {",
    "      try { rad = readClosestDistanceMetersFromUi(); } catch (eRadUi) { rad = NaN; }",
    "    }",
    "    if (!isFinite(rad) || rad <= 0) rad = 1500;",
    "    var buf = createSafeBuffer32643(bufferMarkPoint32643, rad);",
    "    if (buf) return buf;",
    "  }",
    "  return null;",
    "}",
    "",
    "window.msmeGisDrawCommunityRoutesForCategories = function (categoryKeys, opts) {",
    "  opts = opts || {};",
    "  var keysLower = {};",
    "  (Array.isArray(categoryKeys) ? categoryKeys : []).forEach(function (k) {",
    "    var kk = String(k || \"\").toLowerCase();",
    "    if (kk) keysLower[kk] = true;",
    "  });",
    "  if (!Object.keys(keysLower).length) {",
    '    setStatus("Select at least one community category first.");',
    "    return Promise.resolve(false);",
    "  }",
    "  var anchor = resolveBufferCenterPoint32643();",
    "  if (!anchor || anchor.type !== \"point\") {",
    '    setStatus("Center point available nahi hai. Pehle buffer ya closest point select karein.");',
    "    return Promise.resolve(false);",
    "  }",
    "  return projection.load().then(function () {",
    "    var queryGeom = resolveCommunityQueryGeometry32643();",
    "    if (!queryGeom) {",
    '      setStatus("Buffer geometry not available. Run buffer/closest again.");',
    "      return false;",
    "    }",
    "    var specs = COMMUNITY_SUMMARY_LAYER_SPECS.filter(function (spec) {",
    "      return keysLower[String(spec && spec.key ? spec.key : \"\").toLowerCase()];",
    "    });",
    "    if (!specs.length) {",
    '      setStatus("No matching community categories for route drawing.");',
    "      return false;",
    "    }",
    '    setStatus("Fetching POI coordinates for routes...");',
    "    return Promise.all(specs.map(function (spec) {",
    "      return fetchCommunityCategoryItems(spec, queryGeom).then(function (data) {",
    "        return { spec: spec, data: data || { items: [] } };",
    "      });",
    "    })).then(function (rows) {",
    "      var combined = [];",
    "      var seen = {};",
    "      rows.forEach(function (row) {",
    "        var spec = row && row.spec ? row.spec : null;",
    "        var data = row && row.data ? row.data : { items: [] };",
    "        var catKey = String(spec && spec.key ? spec.key : \"\").toLowerCase();",
    "        var items = Array.isArray(data.items) ? data.items : [];",
    "        items.forEach(function (item, idx) {",
    "          var lat = Number(item && item.lat);",
    "          var lng = Number(item && item.lng);",
    "          if (!isFinite(lat) || !isFinite(lng)) return;",
    "          var name = String((item && item.name) || (spec && spec.label ? spec.label + \" \" + (idx + 1) : \"Location \" + (idx + 1)));",
    "          var dedupeKey = catKey + \"|\" + name + \"|\" + lat.toFixed(6) + \",\" + lng.toFixed(6);",
    "          if (seen[dedupeKey]) return;",
    "          seen[dedupeKey] = true;",
    "          combined.push({ name: name, lat: lat, lng: lng, category: catKey, item: item });",
    "        });",
    "      });",
    "      if (!combined.length) {",
    '        setStatus("No POI coordinates found in buffer for selected categories.");',
    "        return false;",
    "      }",
    "      return drawCommunityCategoryConnectors({",
    '        category: "multi",',
    '        label: "selected categories",',
    "        items: combined,",
    "        total: combined.length,",
    "        showAllRoutes: !!(opts && opts.showAllRoutes)",
    "      });",
    "    });",
    "  }).catch(function (eRoutes) {",
    '    console.warn("[community routes bridge]", eRoutes);',
    '    setStatus("Could not draw POI routes. See console.");',
    "    return false;",
    "  });",
    "};",
  ].join("\n");
  if (communitySummaryBridgePattern.test(out)) {
    out = out.replace(communitySummaryBridgePattern, communitySummaryBridgeReplacement);
  } else {
    console.warn("[msme runtime patch] community summary bridge patch not applied.");
  }

  var communitySummaryFetchHelpersPattern =
    /function queryLayerObjectIdsWithinGeometry\(url, layerId, queryGeom32643\) \{[\s\S]*?\n\}\r?\n\r?\nfunction computeCommunitySummaryForGeometry/;
  var communitySummaryFetchHelpersReplacement = [
    "function queryLayerObjectIdsWithinGeometry(url, layerId, queryGeom32643) {",
    "  return queryLayer(url, layerId, Object.assign({",
    "    where: \"1=1\",",
    "    returnGeometry: false,",
    "    returnIdsOnly: true",
    "  }, geometryToQueryParams(queryGeom32643))).then(function (data) {",
    "    var ids = data && Array.isArray(data.objectIds) ? data.objectIds : [];",
    "    return ids.filter(function (id) { return id != null; });",
    "  }).catch(function () {",
    "    return [];",
    "  });",
    "}",
    "",
    "function queryLayerFeaturesByObjectIds(url, layerId, objectIds) {",
    "  var ids = Array.isArray(objectIds) ? objectIds : [];",
    "  if (!ids.length) return Promise.resolve([]);",
    "  var chunks = chunkArray(ids, 160);",
    "  var tasks = chunks.map(function (idChunk) {",
    "    return queryLayer(url, layerId, {",
    "      where: \"1=1\",",
    "      objectIds: idChunk.join(\",\"),",
    "      returnGeometry: true,",
    "      outFields: \"*\",",
    "      outSR: 4326,",
    "      resultRecordCount: Math.max(200, idChunk.length + 20)",
    "    }).then(function (data) {",
    "      return {",
    "        features: data && Array.isArray(data.features) ? data.features : [],",
    "        spatialReference: data && data.spatialReference ? data.spatialReference : null",
    "      };",
    "    }).catch(function () {",
    "      return { features: [], spatialReference: null };",
    "    });",
    "  });",
    "  return Promise.all(tasks).then(function (parts) {",
    "    var merged = [];",
    "    (parts || []).forEach(function (part) {",
    "      var sr = part && part.spatialReference ? part.spatialReference : null;",
    "      (part && part.features ? part.features : []).forEach(function (feature) {",
    "        merged.push({ feature: feature, spatialReference: sr, layerId: layerId });",
    "      });",
    "    });",
    "    return merged;",
    "  });",
    "}",
    "",
    "function queryLayerFeaturesWithinGeometry(url, layerId, queryGeom32643) {",
    "  return queryLayer(url, layerId, Object.assign({",
    "    where: \"1=1\",",
    "    returnGeometry: true,",
    "    outFields: \"*\",",
    "    outSR: 4326,",
    "    resultRecordCount: 2000",
    "  }, geometryToQueryParams(queryGeom32643))).then(function (data) {",
    "    var sr = data && data.spatialReference ? data.spatialReference : null;",
    "    var features = data && Array.isArray(data.features) ? data.features : [];",
    "    return features.map(function (feature) {",
    "      return { feature: feature, spatialReference: sr, layerId: layerId };",
    "    });",
    "  }).catch(function () {",
    "    return [];",
    "  });",
    "}",
    "",
    "function extractWgs84PointFromFeature(feature, responseSr) {",
    "  var raw = geomFromJSON(feature && feature.geometry);",
    "  if (raw) {",
    "    coerceMissingSpatialReference(raw, responseSr || SR4326);",
    "    var g = raw;",
    "    try {",
    "      var wkid = wkidValue(g.spatialReference);",
    "      if (wkid !== 4326) {",
    "        var projected = projection.project(g, SR4326);",
    "        if (projected) g = projected;",
    "      }",
    "    } catch (e0) {}",
    "",
    "    var point = g && g.type === \"point\" ? g : getGeometryCentroid(g);",
    "    if (point && point.type !== \"point\") point = getGeometryCentroid(point);",
    "    if (point) {",
    "      try {",
    "        var pointWkid = wkidValue(point.spatialReference);",
    "        if (pointWkid !== 4326) {",
    "          var projectedPoint = projection.project(point, SR4326);",
    "          if (projectedPoint) point = projectedPoint;",
    "        }",
    "      } catch (e1) {}",
    "",
    "      var lat = Number(point.y);",
    "      var lng = Number(point.x);",
    "      if (isFinite(lat) && isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {",
    "        return { lat: lat, lng: lng };",
    "      }",
    "    }",
    "  }",
    "",
    "  var attrs = feature && feature.attributes ? feature.attributes : {};",
    "  var latAttr = attrs.latitude != null ? attrs.latitude : (attrs.Latitude != null ? attrs.Latitude : (attrs.LATITUDE != null ? attrs.LATITUDE : (attrs.lat != null ? attrs.lat : (attrs.Lat != null ? attrs.Lat : attrs.LAT))));",
    "  var lngAttr = attrs.longitude != null ? attrs.longitude : (attrs.Longitude != null ? attrs.Longitude : (attrs.LONGITUDE != null ? attrs.LONGITUDE : (attrs.lng != null ? attrs.lng : (attrs.lon != null ? attrs.lon : (attrs.Lon != null ? attrs.Lon : (attrs.LON != null ? attrs.LON : (attrs.long != null ? attrs.long : (attrs.Long != null ? attrs.Long : attrs.LONG))))))));",
    "  var lat2 = Number(latAttr);",
    "  var lng2 = Number(lngAttr);",
    "  if (!isFinite(lat2) || !isFinite(lng2)) return null;",
    "  if (Math.abs(lat2) > 90 || Math.abs(lng2) > 180) return null;",
    "  return { lat: lat2, lng: lng2 };",
    "}",
    "",
    "function fetchCommunityCategoryItems(spec, queryGeom32643) {",
    "  var layers = spec && spec.layers ? spec.layers : [];",
    "  if (!layers.length) return Promise.resolve({ count: 0, items: [] });",
    "  var key = String(spec && spec.key ? spec.key : \"category\").toLowerCase();",
    "",
    "  var tasks = layers.map(function (layerDef) {",
    "    var layerUrl = layerDef && layerDef.url ? layerDef.url : \"\";",
    "    var layerId = layerDef && layerDef.layerId != null ? layerDef.layerId : null;",
    "    if (!layerUrl || layerId == null) return Promise.resolve({ count: 0, records: [] });",
    "",
    "    function buildFallbackResult() {",
    "      return queryLayerFeaturesWithinGeometry(layerUrl, layerId, queryGeom32643).then(function (records) {",
    "        return { count: records.length, records: records };",
    "      });",
    "    }",
    "",
    "    return queryLayerObjectIdsWithinGeometry(layerUrl, layerId, queryGeom32643).then(function (objectIds) {",
    "      if (objectIds.length) {",
    "        return queryLayerFeaturesByObjectIds(layerUrl, layerId, objectIds).then(function (records) {",
    "          return { count: objectIds.length, records: records };",
    "        });",
    "      }",
    "      return buildFallbackResult();",
    "    }).catch(function () {",
    "      return buildFallbackResult();",
    "    });",
    "  });",
    "",
    "  return Promise.all(tasks).then(function (layerResults) {",
    "    var total = 0;",
    "    var items = [];",
    "    var seen = {};",
    "    var fallbackIdx = 0;",
    "    (layerResults || []).forEach(function (layerResult) {",
    "      total += Number(layerResult && layerResult.count) || 0;",
    "      (layerResult && layerResult.records ? layerResult.records : []).forEach(function (record) {",
    "        var feature = record && record.feature ? record.feature : null;",
    "        if (!feature) return;",
    "        var attrs = feature.attributes || {};",
    "        var point = extractWgs84PointFromFeature(feature, record.spatialReference);",
    "        if (!point) return;",
    "        var name = extractCommunityPlaceNameFromAttributes(attrs, key, fallbackIdx);",
    "        fallbackIdx += 1;",
    "        var oid = attrs.OBJECTID != null ? String(attrs.OBJECTID) : (attrs.objectid != null ? String(attrs.objectid) : \"\");",
    "        var layerKey = record && record.layerId != null ? String(record.layerId) : \"na\";",
    "        var pointKey = point.lat.toFixed(6) + \",\" + point.lng.toFixed(6);",
    "        var nameKey = String(name || \"\").trim().toLowerCase();",
    "        var dedupeKey = (nameKey && pointKey)",
    "          ? (nameKey + \"|\" + pointKey)",
    "          : (layerKey + \":\" + (oid || (nameKey + \"|\" + pointKey)));",
    "        if (seen[dedupeKey]) return;",
    "        seen[dedupeKey] = true;",
    "        items.push({",
    "          id: oid || (key + \"_\" + String(items.length + 1)),",
    "          name: name,",
    "          lat: point.lat,",
    "          lng: point.lng,",
    "          properties: attrs",
    "        });",
    "      });",
    "    });",
    "    items.sort(function (a, b) {",
    "      return String(a && a.name ? a.name : \"\").localeCompare(String(b && b.name ? b.name : \"\"));",
    "    });",
    "    return {",
    "      count: total,",
    "      plotCount: items.length,",
    "      items: items",
    "    };",
    "  }).catch(function () {",
    "    return { count: 0, plotCount: 0, items: [] };",
    "  });",
    "}",
    "",
    "function computeCommunitySummaryForGeometry",
  ].join("\n");
  if (communitySummaryFetchHelpersPattern.test(out)) {
    out = out.replace(communitySummaryFetchHelpersPattern, communitySummaryFetchHelpersReplacement);
  } else {
    console.warn("[msme runtime patch] community summary fetch helper patch not applied.");
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

  // For sketch area tools (polygon/rectangle/circle), use inward buffer geometry for intersection.
  var sketchInwardAnchorPattern = /var anchor32643 = g326\.type === "point" \? g326 : getGeometryCentroid\(g326\);/;
  var sketchInwardAnchorReplacement = [
    "var sketchAnalysisGeom32643 = g326;",
    "      var sketchInwardMeters = readBufferPickDistanceMetersFromUi();",
    "      if (!isFinite(sketchInwardMeters) || sketchInwardMeters <= 0) sketchInwardMeters = 500;",
    "      if (String(g326.type || \"\").toLowerCase() === \"polygon\") {",
    "        var inwardGeom32643 = null;",
    "        try {",
    "          inwardGeom32643 = geometryEngine.buffer(g326, -Math.abs(sketchInwardMeters), \"meters\", true);",
    "        } catch (eIn0) {",
    "          inwardGeom32643 = null;",
    "        }",
    "        if (Array.isArray(inwardGeom32643)) {",
    "          var inwardParts = inwardGeom32643.filter(function (gPart) {",
    "            return !!(gPart && geometryIsUsable(gPart));",
    "          });",
    "          inwardGeom32643 = inwardParts.length ? inwardParts[0] : null;",
    "        }",
    "        if (inwardGeom32643 && geometryIsUsable(inwardGeom32643)) {",
    "          sketchAnalysisGeom32643 = inwardGeom32643;",
    "          setStatus(\"Sketch inward buffer applied: \" + sketchInwardMeters + \" m inside polygon.\");",
    "        }",
    "      }",
    "      if (String(g326.type || \"\").toLowerCase() === \"polyline\") {",
    "        var lineBuffer32643 = null;",
    "        try {",
    "          lineBuffer32643 = geometryEngine.buffer(g326, Math.abs(sketchInwardMeters), \"meters\", true);",
    "        } catch (eLn0) {",
    "          lineBuffer32643 = null;",
    "        }",
    "        if (Array.isArray(lineBuffer32643)) {",
    "          var lineParts = lineBuffer32643.filter(function (gPart2) {",
    "            return !!(gPart2 && geometryIsUsable(gPart2));",
    "          });",
    "          if (lineParts.length === 1) lineBuffer32643 = lineParts[0];",
    "          else if (lineParts.length > 1) lineBuffer32643 = geometryEngine.union(lineParts);",
    "          else lineBuffer32643 = null;",
    "        }",
    "        if (lineBuffer32643 && geometryIsUsable(lineBuffer32643)) {",
    "          sketchAnalysisGeom32643 = lineBuffer32643;",
    "          setStatus(\"Sketch line buffer applied: \" + sketchInwardMeters + \" m on both sides.\");",
    "        }",
    "      }",
    "      var anchor32643 = sketchAnalysisGeom32643.type === \"point\" ? sketchAnalysisGeom32643 : getGeometryCentroid(sketchAnalysisGeom32643);",
  ].join("\n");
  if (sketchInwardAnchorPattern.test(out)) {
    out = out.replace(sketchInwardAnchorPattern, sketchInwardAnchorReplacement);
  } else {
    console.warn("[msme runtime patch] sketch inward buffer anchor patch not applied.");
  }

  var sketchInwardQueryPattern = /return querySketchIntersection\(g326\)\.then\(function \(flat\) \{/;
  var sketchInwardQueryReplacement =
    "var querySketchGeom32643 = sketchAnalysisGeom32643 || g326;\n      return querySketchIntersection(querySketchGeom32643).then(function (flat) {";
  if (sketchInwardQueryPattern.test(out)) {
    out = out.replace(sketchInwardQueryPattern, sketchInwardQueryReplacement);
  } else {
    console.warn("[msme runtime patch] sketch inward buffer query patch not applied.");
  }

  // Default basemap: use imagery instead of gray vector.
  var defaultBasemapPattern = /basemap:\s*"gray-vector"/;
  if (defaultBasemapPattern.test(out)) {
    out = out.replace(defaultBasemapPattern, 'basemap: "satellite"');
  } else {
    console.warn("[msme runtime patch] default imagery basemap patch not applied.");
  }

  // Expose MapView for React UI (custom basemap dropdown) — first UI mount on the main map view.
  // Some ArcGIS services expose a world-sized fullExtent; keep Haryana fallback on startup in that case.
  // Keep Transportation -> Roads group and children (layer ids 3,4,5) off by default at startup.
  var cadLayerDefaultOnPattern =
    /addOperationalLayerToMap\(transLayer\);\r\n  \/\/ Keep only transportation ON by default; all other operational layers stay OFF\.\r\n  baseRefLayer\.visible = false;\r\n  socialLayer\.visible = false;\r\n  transLayer\.visible = true;\r\n  utilLayer\.visible = false;\r\n  envLayer\.visible = false;\r\n  invLayer\.visible = false;\r\n  cadLayer\.visible = false;/;
  var cadLayerDefaultOnReplacement = [
    "addOperationalLayerToMap(transLayer);",
    "  addOperationalLayerToMap(cadLayer);",
    "  // Transportation and cadastral ON by default.",
    "  baseRefLayer.visible = false;",
    "  socialLayer.visible = false;",
    "  transLayer.visible = true;",
    "  utilLayer.visible = false;",
    "  envLayer.visible = false;",
    "  invLayer.visible = false;",
    "  cadLayer.visible = true;",
  ].join("\n");
  if (cadLayerDefaultOnPattern.test(out)) {
    out = out.replace(cadLayerDefaultOnPattern, cadLayerDefaultOnReplacement);
  } else {
    console.warn("[msme runtime patch] cadastral default-on preset patch not applied.");
  }

  var transportRoadsDefaultOnPattern = /applyInitialRequestedLayerPreset\(\);/;
  var transportRoadsDefaultOnReplacement = [
    "applyInitialRequestedLayerPreset();",
    "    try {",
    "      var transLyr = null;",
    "      var cadLyr = null;",
    "      if (map && map.layers && typeof map.layers.forEach === \"function\") {",
    "        map.layers.forEach(function (lyr) {",
    "          if (transLyr && cadLyr) return;",
    "          var title0 = String((lyr && lyr.title) || \"\");",
    "          var url0 = String((lyr && lyr.url) || \"\");",
    "          var isTransport = /Transportation/i.test(title0) || /Transportation_Infrastructure/i.test(url0);",
    "          if (isTransport) transLyr = lyr;",
    "          var isCad = /Cadastral/i.test(title0) || /Haryana_Cadastral/i.test(url0) || /MSME_CADASTRAL/i.test(url0);",
    "          if (isCad) cadLyr = lyr;",
    "        });",
    "      }",
    "      if (transLyr && typeof transLyr.when === \"function\") {",
    "        transLyr.when(function () {",
    "          [3, 4, 5].forEach(function (sid) {",
    "            var roadsSl = transLyr.findSublayerById ? transLyr.findSublayerById(sid) : null;",
    "            if (!roadsSl) return;",
    "            roadsSl.visible = false;",
    "            roadsSl.minScale = 0;",
    "            roadsSl.maxScale = 0;",
    "          });",
    "          if (transLyr.allSublayers && typeof transLyr.allSublayers.forEach === \"function\") {",
    "            transLyr.allSublayers.forEach(function (sl) {",
    "              var sName = String((sl && sl.title) || (sl && sl.name) || \"\");",
    "              if (/bus\\s*stops?/i.test(sName) || /metro\\s*network/i.test(sName)) {",
    "                try { sl.visible = false; } catch (eTs0) {}",
    "              }",
    "            });",
    "          }",
    "        });",
    "      }",
      "      function maybeEnableCadOnBoot() {",
      "        if (!cadLyr) return;",
      "        try { cadLyr.visible = true; cadLyr.opacity = 1; } catch (eCad0) {}",
      "        if (typeof cadLyr.when === \"function\") {",
      "          cadLyr.when(function () {",
      "            try { if (typeof fixCadastralScales === \"function\") fixCadastralScales(); } catch (eCad1) {}",
      "          }).catch(function () {});",
      "        }",
      "      }",
      "      maybeEnableCadOnBoot();",
    "    } catch (eRoadOn) {",
    "      console.warn(\"[msme runtime patch] transport roads default-off failed\", eRoadOn);",
    "    }",
  ].join("\n");
  if (transportRoadsDefaultOnPattern.test(out)) {
    out = out.replace(transportRoadsDefaultOnPattern, transportRoadsDefaultOnReplacement);
  } else {
    console.warn("[msme runtime patch] transport roads default-off patch not applied.");
  }

  var initialExtentGuardPattern = /function getInitialMapExtent\(\) \{[\s\S]*?return projection\.project\(defaultStudyExtent32643, SR_WEB\);\r?\n\}/;
  var initialExtentGuardReplacement = [
    "function getInitialMapExtent() {",
    "  var fallbackWeb = projection.project(defaultStudyExtent32643, SR_WEB);",
    "  var haryanaFocusWeb = fallbackWeb && typeof fallbackWeb.expand === \"function\" ? fallbackWeb.expand(0.92) : fallbackWeb;",
    "  var adminExtent = adminLayer && adminLayer.fullExtent ? adminLayer.fullExtent : null;",
    "  if (!adminExtent) return haryanaFocusWeb;",
    "  try {",
    "    var adminWeb = projection.project(adminExtent, SR_WEB) || adminExtent;",
    "    if (!adminWeb) return haryanaFocusWeb;",
    "    var xmin = Number(adminWeb.xmin);",
    "    var ymin = Number(adminWeb.ymin);",
    "    var xmax = Number(adminWeb.xmax);",
    "    var ymax = Number(adminWeb.ymax);",
    "    if (!isFinite(xmin) || !isFinite(ymin) || !isFinite(xmax) || !isFinite(ymax)) return haryanaFocusWeb;",
    "    var width = Math.abs(xmax - xmin);",
    "    var height = Math.abs(ymax - ymin);",
    "    if (width > 20000000 || height > 20000000) {",
    "      console.warn(\"[extent] admin full extent too broad; using Haryana fallback extent.\");",
    "      return haryanaFocusWeb;",
    "    }",
    "    return adminWeb;",
    "  } catch (e0) {",
    "    console.warn(\"[extent] admin full extent projection failed\", e0);",
    "  }",
    "  return haryanaFocusWeb;",
    "}",
  ].join("\n");
  if (initialExtentGuardPattern.test(out)) {
    out = out.replace(initialExtentGuardPattern, initialExtentGuardReplacement);
  } else {
    console.warn("[msme runtime patch] initial extent guard patch not applied.");
  }

  // If startup chain fails (e.g. APIs unreachable), still park map on Haryana fallback extent.
  var initCatchFallbackPattern = /console\.error\(e\);\s*if \(isGateway502Error\(e\)\) \{/;
  var initCatchFallbackReplacement = [
    "console.error(e);",
    "  projection.load().then(function () {",
    "    var fallbackWeb = projection.project(defaultStudyExtent32643, SR_WEB);",
    "    var haryanaFocusWeb = fallbackWeb && typeof fallbackWeb.expand === \"function\" ? fallbackWeb.expand(0.92) : fallbackWeb;",
    "    if (view && haryanaFocusWeb) {",
    "      view.goTo(haryanaFocusWeb, { animate: false }).catch(function () { return null; });",
    "    }",
    "  }).catch(function () { return null; });",
    "  if (isGateway502Error(e)) {",
  ].join("\n");
  if (initCatchFallbackPattern.test(out)) {
    out = out.replace(initCatchFallbackPattern, initCatchFallbackReplacement);
  } else {
    console.warn("[msme runtime patch] init catch Haryana fallback patch not applied.");
  }

  var msmeMapViewBridgePattern = /view\.ui\.add/;
  var msmeMapViewBridgeReplacement =
    'try{if(typeof window!=="undefined"){window.__msmeGisMapView=view;if(window.configureMsmeMapPopupUi)window.configureMsmeMapPopupUi(view);}}catch(_msmeMvBr0){}view.ui.add';
  if (msmeMapViewBridgePattern.test(out)) {
    out = out.replace(msmeMapViewBridgePattern, msmeMapViewBridgeReplacement);
  } else {
    console.warn("[msme runtime patch] map view bridge (__msmeGisMapView) not applied.");
  }

  // Keep Haryana visually centered in map viewport when sidebar/panels toggle.
  // Legacy padding uses large left inset, which pushes goTo center towards left.
  var uiZoomPaddingPattern =
    /function getUiZoomPadding\(\) \{[\s\S]*?return \{ top: 76, bottom: 56, left: left, right: 44 \};\s*\}/;
  var uiZoomPaddingReplacement = [
    "function getUiZoomPadding() {",
    "  var isMobileLayout = typeof window !== \"undefined\" && window.matchMedia && window.matchMedia(\"(max-width: 1024px)\").matches;",
    "  var inset = isMobileLayout ? 12 : 44;",
    "  return {",
    "    top: isMobileLayout ? 68 : 76,",
    "    bottom: isMobileLayout ? 40 : 56,",
    "    left: inset,",
    "    right: inset",
    "  };",
    "}",
  ].join("\n");
  if (uiZoomPaddingPattern.test(out)) {
    out = out.replace(uiZoomPaddingPattern, uiZoomPaddingReplacement);
  } else {
    console.warn("[msme runtime patch] UI zoom padding centering patch not applied.");
  }

  // Community panel fetches can fan out into many objectId chunk requests.
  // Keep chunk size + parallelism conservative to avoid proxy/TLS disconnects.
  var communityFeatureFetchPattern =
    /function queryLayerFeaturesByObjectIds\(url, layerId, objectIds\) \{[\s\S]*?return Promise\.all\(tasks\)\.then\(function \(parts\) \{[\s\S]*?return merged;\s*\}\);\s*\}/;
  var communityFeatureFetchReplacement = [
    "function queryLayerFeaturesByObjectIds(url, layerId, objectIds) {",
    "  var ids = Array.isArray(objectIds) ? objectIds : [];",
    "  if (!ids.length) return Promise.resolve([]);",
    "  var chunks = chunkArray(ids, 140);",
    "  var nextIdx = 0;",
    "  var merged = [];",
    "  var workerCount = Math.min(4, Math.max(1, chunks.length));",
    "",
    "  function fetchChunk(idChunk) {",
    "    return queryLayer(url, layerId, {",
    "      where: \"1=1\",",
    "      objectIds: idChunk.join(\",\"),",
    "      returnGeometry: true,",
    "      outFields: \"*\",",
    "      outSR: 4326,",
    "      resultRecordCount: Math.max(120, idChunk.length + 20)",
    "    }).then(function (data) {",
    "      return {",
    "        features: data && Array.isArray(data.features) ? data.features : [],",
    "        spatialReference: data && data.spatialReference ? data.spatialReference : null",
    "      };",
    "    }).catch(function () {",
    "      return { features: [], spatialReference: null };",
    "    });",
    "  }",
    "",
    "  function runWorker() {",
    "    if (nextIdx >= chunks.length) return Promise.resolve();",
    "    var myIdx = nextIdx++;",
    "    var idChunk = chunks[myIdx];",
    "    return fetchChunk(idChunk).then(function (part) {",
    "      var sr = part && part.spatialReference ? part.spatialReference : null;",
    "      (part && part.features ? part.features : []).forEach(function (feature) {",
    "        merged.push({ feature: feature, spatialReference: sr, layerId: layerId });",
    "      });",
    "      return runWorker();",
    "    });",
    "  }",
    "",
    "  var workers = [];",
    "  for (var w = 0; w < workerCount; w++) workers.push(runWorker());",
    "  return Promise.all(workers).then(function () { return merged; });",
    "}",
  ].join("\n");
  if (communityFeatureFetchPattern.test(out)) {
    out = out.replace(communityFeatureFetchPattern, communityFeatureFetchReplacement);
  } else {
    console.warn("[msme runtime patch] community feature fetch throttling patch not applied.");
  }

  // Plan Route must use fresh device GPS, not a stale cached point (often Delhi from IP geolocation).
  var ensureCurrentLocationRoutePattern =
    /function ensureCurrentLocationForRoute\(\) \{\s*return resolveCurrentLocationForRoute\(\)\.then\(function \(wgs\) \{\s*if \(wgs\) return wgs;\s*setStatus\("Fetching current location for routing\.\.\."\);\s*return fetchBrowserCurrentLocationWgsForRoute\(\);\s*\}\)\.then\(function \(wgsFinal\) \{/;
  var ensureCurrentLocationRouteReplacement = [
    "function ensureCurrentLocationForRoute() {",
    '  setStatus("Fetching current location for routing...");',
    "  lastCurrentLocationWgs = null;",
    "  return fetchBrowserCurrentLocationWgsForRoute().then(function (freshWgs) {",
    "    if (freshWgs) return freshWgs;",
    "    return resolveCurrentLocationForRoute();",
    "  }).then(function (wgsFinal) {",
  ].join("\n");
  if (ensureCurrentLocationRoutePattern.test(out)) {
    out = out.replace(ensureCurrentLocationRoutePattern, ensureCurrentLocationRouteReplacement);
  } else {
    console.warn("[msme runtime patch] ensureCurrentLocationForRoute GPS-first patch not applied.");
  }

  var resolveCurrentLocationGeomPattern =
    /return projection\.load\(\)\.then\(function \(\) \{\s*if \(g\.type === "point" && isValidWgsLatLon\(Number\(g\.y\), Number\(g\.x\)\)\) \{\s*return \{ lat: Number\(g\.y\), lon: Number\(g\.x\) \};\s*\}\s*var p = g\.type === "point" \? g : null;\s*var pWgs = p \? projection\.project\(p, SR4326\) : null;/;
  var resolveCurrentLocationGeomReplacement = [
    "return projection.load().then(function () {",
    '      var lat = NaN;',
    "      var lon = NaN;",
    '      if (g.type === "point") {',
    "        if (g.latitude != null && g.longitude != null) {",
    "          lat = Number(g.latitude);",
    "          lon = Number(g.longitude);",
    "        } else {",
    "          lat = Number(g.y);",
    "          lon = Number(g.x);",
    "        }",
    "      }",
    "      if (isValidWgsLatLon(lat, lon)) {",
    "        return { lat: lat, lon: lon };",
    "      }",
    "      var p = g.type === \"point\" ? g : null;",
    "      var pWgs = p ? projection.project(p, SR4326) : null;",
  ].join("\n");
  if (resolveCurrentLocationGeomPattern.test(out)) {
    out = out.replace(resolveCurrentLocationGeomPattern, resolveCurrentLocationGeomReplacement);
  } else {
    console.warn("[msme runtime patch] resolveCurrentLocation geometry patch not applied.");
  }

  var fetchBrowserGeoErrorPattern =
    /resolve\(lastCurrentLocationWgs\);\s*\}, function \(\) \{\s*resolve\(null\);\s*\}, \{\s*enableHighAccuracy: true,\s*timeout: 10000,\s*maximumAge: 0\s*\}\);\s*\}\);\s*\}\s*function buildAoiSelectionQueryForRoute/;
  var fetchBrowserGeoErrorReplacement = [
    "resolve(lastCurrentLocationWgs);",
    "    }, function (geoErr) {",
    "      try {",
    '        if (geoErr && geoErr.code === 1) setStatus("Location permission denied. Allow location access in the browser.");',
    '        else if (geoErr && geoErr.code === 2) setStatus("Location unavailable. Enable GPS or try again.");',
    '        else if (geoErr && geoErr.code === 3) setStatus("Location request timed out. Try again.");',
    "      } catch (eGeo) {}",
    "      resolve(null);",
    "    }, {",
    "      enableHighAccuracy: true,",
    "      timeout: 15000,",
    "      maximumAge: 0",
    "    });",
    "  });",
    "}",
    "",
    "function buildAoiSelectionQueryForRoute",
  ].join("\n");
  if (fetchBrowserGeoErrorPattern.test(out)) {
    out = out.replace(fetchBrowserGeoErrorPattern, fetchBrowserGeoErrorReplacement);
  } else {
    console.warn("[msme runtime patch] fetchBrowser geolocation error patch not applied.");
  }

  var analysisPlaceInjectPattern = /function publishBufferCommunitySummaryInBackground\(baseReportPayload, summaryGeom32643, ctxRef\) \{/;
  if (analysisPlaceInjectPattern.test(out)) {
    out = out.replace(
      analysisPlaceInjectPattern,
      analysisPlaceContextSnippet + "\nfunction publishBufferCommunitySummaryInBackground(baseReportPayload, summaryGeom32643, ctxRef) {",
    );
  } else {
    console.warn("[msme runtime patch] analysis place context inject not applied.");
  }

  var bufferBgEnrichPattern =
    /enriched\.communitySummary = communitySummary;\s*publishAnalysisReportSnapshot\(enriched\);/;
  var bufferBgEnrichReplacement = [
    "enriched.communitySummary = communitySummary;",
    "    publishAnalysisReportSnapshot(enriched);",
    "    try {",
    '      if (typeof window !== "undefined" && window.dispatchEvent) {',
    '        window.dispatchEvent(new CustomEvent("msme-community-panel-open"));',
    "      }",
    "    } catch (eOpen0) {}",
    "    var anchorBg = (bufferMarkPoint32643 && bufferMarkPoint32643.type === \"point\") ? bufferMarkPoint32643 : null;",
    "    enrichReportSnapshotWithPlaceContext(enriched, anchorBg, summaryGeom32643).then(function (finalSnap) {",
    "      if (finalSnap) publishAnalysisReportSnapshot(finalSnap);",
    "    }).catch(function (eEnrichBg) {",
    '      console.warn("[buffer summary] place enrich failed", eEnrichBg);',
    "    });",
  ].join("\n");
  if (bufferBgEnrichPattern.test(out)) {
    out = out.replace(bufferBgEnrichPattern, bufferBgEnrichReplacement);
  } else {
    console.warn("[msme runtime patch] buffer background place context patch not applied.");
  }

  var constituencySummaryGeomInitPattern =
    /var distM = 0;\s*var constituencyBuffer = g32643;\s*userMapAnalysisGeometry32643 = g32643;/;
  var constituencySummaryGeomInitReplacement = [
    "var distM = 0;",
    "    var constituencyBuffer = g32643;",
    "    var constituencySummaryGeom = constituencyBuffer;",
    "    try {",
    "      var constituencyExtent0 = constituencyBuffer && constituencyBuffer.extent ? ensureSR32643(constituencyBuffer.extent) : null;",
    "      if (constituencyExtent0 && geometryIsUsable(constituencyExtent0)) {",
    "        constituencySummaryGeom = constituencyExtent0;",
    "      }",
    "    } catch (eConSummary0) {}",
    "    userMapAnalysisGeometry32643 = g32643;",
  ].join("\n");
  if (constituencySummaryGeomInitPattern.test(out)) {
    out = out.replace(
      constituencySummaryGeomInitPattern,
      constituencySummaryGeomInitReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency summary geometry init patch not applied.");
  }

  var constituencySummaryGeomJsonPattern =
    /var qJson = constituencyBuffer && typeof constituencyBuffer\.toJSON === "function" \? constituencyBuffer\.toJSON\(\) : null;/;
  var constituencySummaryGeomJsonReplacement = [
    "var qJson = constituencyBuffer && typeof constituencyBuffer.toJSON === \"function\" ? constituencyBuffer.toJSON() : null;",
    "    var sJson = constituencySummaryGeom && typeof constituencySummaryGeom.toJSON === \"function\" ? constituencySummaryGeom.toJSON() : qJson;",
  ].join("\n");
  if (constituencySummaryGeomJsonPattern.test(out)) {
    out = out.replace(
      constituencySummaryGeomJsonPattern,
      constituencySummaryGeomJsonReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency summary geometry JSON patch not applied.");
  }

  var constituencyCtxSummaryPattern =
    /queryGeometryJson: qJson,\s*objectIds: \[\],\s*featureSource: type === "lok" \? "parliamentary-lok" : "parliamentary-vidhan",/;
  var constituencyCtxSummaryReplacement = [
    "queryGeometryJson: qJson,",
    "      summaryGeometryJson: sJson,",
    "      objectIds: [],",
    "      featureSource: type === \"lok\" ? \"parliamentary-lok\" : \"parliamentary-vidhan\",",
  ].join("\n");
  if (constituencyCtxSummaryPattern.test(out)) {
    out = out.replace(
      constituencyCtxSummaryPattern,
      constituencyCtxSummaryReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency ctx summary geometry patch not applied.");
  }

  var constituencyBaseReportSummaryPattern =
    /queryGeometryJson: qJson,\s*clippedFromAdminSelection: false,\s*constituencyType: type,/;
  var constituencyBaseReportSummaryReplacement = [
    "queryGeometryJson: qJson,",
    "        summaryGeometryJson: sJson,",
    "        clippedFromAdminSelection: false,",
    "        constituencyType: type,",
  ].join("\n");
  if (constituencyBaseReportSummaryPattern.test(out)) {
    out = out.replace(
      constituencyBaseReportSummaryPattern,
      constituencyBaseReportSummaryReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency base-report summary geometry patch not applied.");
  }

  var constituencySummaryPublishPattern =
    /if \(constituency(?:SummaryGeom|Buffer)\) publishBufferCommunitySummaryInBackground\(baseReport, constituency(?:SummaryGeom|Buffer), ctx\);/;
  var constituencySummaryPublishReplacement =
    "if (constituencyBuffer) publishBufferCommunitySummaryInBackground(baseReport, constituencyBuffer, ctx);";
  if (constituencySummaryPublishPattern.test(out)) {
    out = out.replace(
      constituencySummaryPublishPattern,
      constituencySummaryPublishReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency summary publish patch not applied.");
  }

  var constituencyZoomLabelsClearResultsPattern =
    /function clearResults\(\) \{ resultsLayer\.removeAll\(\); \}/;
  var constituencyZoomLabelsClearResultsReplacement = [
    "var constituencyVillageLabelGraphics = [];",
    "var constituencyAssemblyLabelGraphic = null;",
    "",
    "function clearConstituencyZoomLabels() {",
    "  try {",
    "    if (constituencyAssemblyLabelGraphic && identifyLayer) {",
    "      identifyLayer.remove(constituencyAssemblyLabelGraphic);",
    "    }",
    "  } catch (eConLbl0) {}",
    "  constituencyAssemblyLabelGraphic = null;",
    "  try {",
    "    if (constituencyVillageLabelGraphics.length && identifyLayer) {",
    "      identifyLayer.removeMany(constituencyVillageLabelGraphics);",
    "    }",
    "  } catch (eConLbl1) {}",
    "  constituencyVillageLabelGraphics = [];",
    "  try {",
    "    if (adminLayer) {",
    "      adminLayer.when(function () {",
    "        var villageSl = adminLayer.findSublayerById(LAYER_VILLAGE);",
    "        if (villageSl) villageSl.labelsVisible = false;",
    "      });",
    "    }",
    "  } catch (eConLbl2) {}",
    "  try {",
    "    if (conLayer) {",
    "      conLayer.when(function () {",
    "        var assemblySl = conLayer.findSublayerById(LAYER_CON_ASSEMBLY);",
    "        if (assemblySl) assemblySl.labelsVisible = false;",
    "      });",
    "    }",
    "  } catch (eConLbl3) {}",
    "}",
    "",
    "function showConstituencyZoomMapLabels(type, assemblyName, geom32643) {",
    "  clearConstituencyZoomLabels();",
    "  if (!geom32643 || !geometryIsUsable(geom32643)) return Promise.resolve();",
    "  var labelName = String(assemblyName || \"\").trim();",
    "  if (!labelName) return Promise.resolve();",
    "",
    "  var centroid32643 = getGeometryCentroid(geom32643);",
    "  if (centroid32643 && identifyLayer) {",
    "    try {",
    "      var centerWeb = projection.project(ensureSR32643(centroid32643), SR_WEB);",
    "      if (centerWeb) {",
    "        constituencyAssemblyLabelGraphic = new Graphic({",
    "          geometry: centerWeb,",
    '          attributes: { type: "constituency-assembly-label" },',
    "          symbol: new TextSymbol({",
    "            text: labelName,",
    '            color: "#0b2d4d",',
    '            haloColor: "#ffffff",',
    "            haloSize: 2,",
    "            yoffset: -4,",
    '            font: { size: 14, family: "Segoe UI", weight: "bold" }',
    "          })",
    "        });",
    "        identifyLayer.add(constituencyAssemblyLabelGraphic);",
    "      }",
    "    } catch (eAsmLbl) {}",
    "  }",
    "",
    "  var layerTasks = [];",
    "  if (adminLayer) {",
    "    layerTasks.push(adminLayer.when(function () {",
    "      var villageSl = adminLayer.findSublayerById(LAYER_VILLAGE);",
    "      if (villageSl) {",
    "        villageSl.visible = true;",
    "        villageSl.labelsVisible = true;",
    "        villageSl.minScale = 0;",
    "        villageSl.maxScale = 0;",
    "      }",
    "    }));",
    "  }",
    '  if (conLayer && String(type || "").toLowerCase() === "vidhan") {',
    "    layerTasks.push(conLayer.when(function () {",
    "      var assemblySl = conLayer.findSublayerById(LAYER_CON_ASSEMBLY);",
    "      if (assemblySl) {",
    "        assemblySl.labelsVisible = true;",
    "        assemblySl.minScale = 0;",
    "        assemblySl.maxScale = 0;",
    "      }",
    "    }));",
    "  }",
    "",
    "  return Promise.all(layerTasks).then(function () {",
    '    if (String(type || "").toLowerCase() !== "vidhan") return null;',
    "    return queryLayer(ADMIN_MS, LAYER_VILLAGE, Object.assign({",
    '      where: "1=1",',
    '      outFields: "n_v_name,n_v_code",',
    "      returnGeometry: true,",
    "      resultRecordCount: 2000,",
    "    }, geometryToQueryParams(geom32643)));",
    "  }).then(function (data) {",
    "    if (!data || !identifyLayer) return;",
    "    var features = data.features || [];",
    "    features.forEach(function (feature) {",
    "      var attrs = feature && feature.attributes ? feature.attributes : {};",
    '      var vName = String(attrs.n_v_name || attrs.n_v_code || "").trim();',
    "      if (!vName) return;",
    "      var g = geomFromJSON(feature.geometry);",
    "      if (!g || !geometryIsUsable(g)) return;",
    "      var c = getGeometryCentroid(g);",
    "      if (!c) return;",
    "      var cWeb = null;",
    "      try {",
    "        cWeb = projection.project(ensureSR32643(c), SR_WEB);",
    "      } catch (eV0) {}",
    "      if (!cWeb) return;",
    "      var gV = new Graphic({",
    "        geometry: cWeb,",
    '        attributes: { type: "constituency-village-label", villageName: vName },',
    "        symbol: new TextSymbol({",
    "          text: vName,",
    '          color: "#163a56",',
    '          haloColor: "#ffffff",',
    "          haloSize: 1.2,",
    '          font: { size: 9, family: "Segoe UI", weight: "600" }',
    "        })",
    "      });",
    "      identifyLayer.add(gV);",
    "      constituencyVillageLabelGraphics.push(gV);",
    "    });",
    "  }).catch(function () {",
    "    return null;",
    "  });",
    "}",
    "",
    "function clearResults() { resultsLayer.removeAll(); clearConstituencyZoomLabels(); }",
  ].join("\n");
  if (constituencyZoomLabelsClearResultsPattern.test(out)) {
    out = out.replace(
      constituencyZoomLabelsClearResultsPattern,
      constituencyZoomLabelsClearResultsReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency zoom labels clearResults patch not applied.");
  }

  var constituencyZoomLabelsAfterZoomPattern =
    /\.then\(function \(\) \{\s*setStatus\(msg\);\s*window\.setTimeout\(hydrateAndPublishAfterZoom, 0\);\s*return true;\s*\}\);/;
  var constituencyZoomLabelsAfterZoomReplacement = [
    ".then(function () {",
    "      setStatus(msg);",
    "      showConstituencyZoomMapLabels(type, name, constituencyBuffer);",
    "      window.setTimeout(hydrateAndPublishAfterZoom, 0);",
    "      return true;",
    "    });",
  ].join("\n");
  if (constituencyZoomLabelsAfterZoomPattern.test(out)) {
    out = out.replace(
      constituencyZoomLabelsAfterZoomPattern,
      constituencyZoomLabelsAfterZoomReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency zoom labels after-zoom patch not applied.");
  }

  var vidhanSabhaDrawSymbolPattern =
    /if \(drawGeom\) \{\s*resultsLayer\.add\(new Graphic\(\{\s*geometry: drawGeom,\s*symbol: symBuffer,\s*attributes: attrs \|\| \{\}\s*\}\)\);\s*\}\s*var sourceLabel = type === "lok" \? "Lok Sabha boundary" : "Vidhan Sabha boundary";/;
  var vidhanSabhaDrawSymbolReplacement = [
    "if (drawGeom) {",
    "      resultsLayer.add(new Graphic({",
    "        geometry: drawGeom,",
    '        symbol: type === "vidhan" ? symVidhanSabha : symBuffer,',
    "        attributes: attrs || {}",
    "      }));",
    "    }",
    '    var sourceLabel = type === "lok" ? "Lok Sabha boundary" : "Vidhan Sabha boundary";',
  ].join("\n");
  if (vidhanSabhaDrawSymbolPattern.test(out)) {
    out = out.replace(vidhanSabhaDrawSymbolPattern, vidhanSabhaDrawSymbolReplacement);
  } else {
    console.warn("[msme runtime patch] Vidhan Sabha dark-blue draw symbol patch not applied.");
  }

  var constituencyZoomLabelsClearBoundaryPattern =
    /\.then\(function \(\) \{\s*setStatus\("Parliamentary boundary cleared\."\);\s*\}\)/;
  var constituencyZoomLabelsClearBoundaryReplacement = [
    ".then(function () {",
    "      clearConstituencyZoomLabels();",
    '      setStatus("Parliamentary boundary cleared.");',
    "    })",
  ].join("\n");
  if (constituencyZoomLabelsClearBoundaryPattern.test(out)) {
    out = out.replace(
      constituencyZoomLabelsClearBoundaryPattern,
      constituencyZoomLabelsClearBoundaryReplacement,
    );
  } else {
    console.warn("[msme runtime patch] constituency zoom labels clear-boundary patch not applied.");
  }

  var bufferPublishPattern =
    /var baseReport = publishAnalysisToolResult\("buffer", msg, \{\s*count: stats\.n,\s*distanceM: distM,\s*searchRadiusM: searchRadiusM,\s*roadSource: roadSourceText\s*\}\);\s*if \(stats\.summaryGeometry32643\) \{\s*publishBufferCommunitySummaryInBackground\(baseReport, stats\.summaryGeometry32643, lastBufferExportContext\);\s*\}/;
  var bufferPublishReplacement = [
    'var anchorBuf = (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") ? bufferMarkPoint32643 : null;',
    '    var bufToolId = (typeof window !== "undefined" && window.__msmeGisActiveAnalysisTool) ? String(window.__msmeGisActiveAnalysisTool) : "buffer";',
    '    try { if (typeof window !== "undefined") window.__msmeGisActiveAnalysisTool = null; } catch (eToolId) {}',
    "    publishAnalysisToolResultWithPlaceContext(bufToolId, msg, {",
    "      count: stats.n,",
    "      distanceM: distM,",
    "      searchRadiusM: searchRadiusM,",
    "      roadSource: roadSourceText",
    "    }, anchorBuf, stats.summaryGeometry32643, distM).then(function (baseReport) {",
    "      if (stats.summaryGeometry32643 && baseReport) {",
    "        publishBufferCommunitySummaryInBackground(baseReport, stats.summaryGeometry32643, lastBufferExportContext);",
    "      }",
    "    });",
  ].join("\n");
  if (bufferPublishPattern.test(out)) {
    out = out.replace(bufferPublishPattern, bufferPublishReplacement);
  } else {
    console.warn("[msme runtime patch] buffer publish place context patch not applied.");
  }

  var proxSuccessPublishPattern =
    /var baseProxReport = publishAnalysisToolResult\("proximity", msgP, \{ count: hits, maxDistanceM: maxD, radiusM: maxD \}\);\s*var proxSummaryGeom = proxPreview32643 \|\| buildFallbackAnchorBuffer32643\(qg, maxD\);\s*if \(proxSummaryGeom\) \{\s*publishBufferCommunitySummaryInBackground\(baseProxReport, proxSummaryGeom, null\);\s*\}/;
  var proxSuccessPublishReplacement = [
    'var proxAnchor = (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") ? bufferMarkPoint32643 : null;',
    "      var proxSummaryGeom = proxPreview32643 || buildFallbackAnchorBuffer32643(qg, maxD);",
    "      publishAnalysisToolResultWithPlaceContext(\"proximity\", msgP, { count: hits, maxDistanceM: maxD, radiusM: maxD }, proxAnchor, proxSummaryGeom, maxD).then(function (baseProxReport) {",
    "        if (proxSummaryGeom && baseProxReport) {",
    "          publishBufferCommunitySummaryInBackground(baseProxReport, proxSummaryGeom, null);",
    "        }",
    "      });",
  ].join("\n");
  if (proxSuccessPublishPattern.test(out)) {
    out = out.replace(proxSuccessPublishPattern, proxSuccessPublishReplacement);
  } else {
    console.warn("[msme runtime patch] proximity success place context patch not applied.");
  }

  var proxNoHitPublishPattern =
    /var proxNoHitReport = publishAnalysisToolResult\("proximity", msgP0, \{ count: 0, maxDistanceM: maxD, radiusM: maxD \}\);\s*var proxSummaryGeom0 = proxPreview32643 \|\| buildFallbackAnchorBuffer32643\(qg, maxD\);\s*if \(proxSummaryGeom0\) \{\s*publishBufferCommunitySummaryInBackground\(proxNoHitReport, proxSummaryGeom0, null\);\s*\}/;
  var proxNoHitPublishReplacement = [
    'var proxAnchor0 = (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") ? bufferMarkPoint32643 : null;',
    "      var proxSummaryGeom0 = proxPreview32643 || buildFallbackAnchorBuffer32643(qg, maxD);",
    "      publishAnalysisToolResultWithPlaceContext(\"proximity\", msgP0, { count: 0, maxDistanceM: maxD, radiusM: maxD }, proxAnchor0, proxSummaryGeom0, maxD).then(function (proxNoHitReport) {",
    "        if (proxSummaryGeom0 && proxNoHitReport) {",
    "          publishBufferCommunitySummaryInBackground(proxNoHitReport, proxSummaryGeom0, null);",
    "        }",
    "      });",
  ].join("\n");
  if (proxNoHitPublishPattern.test(out)) {
    out = out.replace(proxNoHitPublishPattern, proxNoHitPublishReplacement);
  } else {
    console.warn("[msme runtime patch] proximity no-hit place context patch not applied.");
  }

  var closestPublishPattern =
    /publishAnalysisToolResult\("closest", msg, \{\s*count: communitySummary \? communitySummary\.totalCount : 0,\s*radiusM: radius,\s*communitySummary: communitySummary,\s*summaryGeometryJson: summaryGeom32643 && summaryGeom32643\.toJSON \? summaryGeom32643\.toJSON\(\) : null,\s*queryGeometryJson: summaryGeom32643 && summaryGeom32643\.toJSON \? summaryGeom32643\.toJSON\(\) : null\s*\}\);\s*if \(communitySummary\) \{\s*setStatus\("Closest point analysis complete\. Community panel updated\."\);\s*\} else \{\s*setStatus\("Closest point analysis complete\. Community summary unavailable\."\);\s*\}\s*return true;/;
  var closestPublishReplacement = [
    "return publishAnalysisToolResultWithPlaceContext(\"closest\", msg, {",
    "      count: communitySummary ? communitySummary.totalCount : 0,",
    "      radiusM: radius,",
    "      communitySummary: communitySummary",
    "    }, anchor32643Point, summaryGeom32643, radius).then(function () {",
    "      if (communitySummary) {",
    "        try {",
    "          communitySummary.radiusM = radius;",
    '          communitySummary.source = "closest-point";',
    "        } catch (eRadMeta) {}",
    "        showClosestResultsOnMap(anchor32643Point, summaryGeom32643, communitySummary, radius);",
    '        setStatus("Closest point analysis complete. Community panel updated.");',
    "      } else {",
    '        setStatus("Closest point analysis complete. Community summary unavailable.");',
    "      }",
    "      return true;",
    "    });",
  ].join("\n");
  if (closestPublishPattern.test(out)) {
    out = out.replace(closestPublishPattern, closestPublishReplacement);
  } else {
    console.warn("[msme runtime patch] closest publish place context patch not applied.");
  }

  var closestSummaryItemsPattern =
    /items\.forEach\(function \(item\) \{\r\n          var lat = Number\(item && item\.lat\);\r\n          var lng = Number\(item && item\.lng\);\r\n          if \(!isFinite\(lat\) \|\| !isFinite\(lng\)\) return;\r\n          var p4326 = new Point\(\{ x: lng, y: lat, spatialReference: SR4326 \}\);\r\n          var p32643 = projection\.project\(p4326, SR_METER\) \|\| null;\r\n          if \(!p32643 \|\| p32643\.type !== "point"\) return;\r\n          var dM = geometryEngine\.distance\(anchorPoint32643, p32643, "meters"\);\r\n          if \(!isFinite\(dM\)\) return;\r\n          if \(nearestItem == null \|\| nearestDistM == null \|\| dM < nearestDistM\) \{\r\n            nearestItem = \{\r\n              id: item\.id,\r\n              name: item\.name,\r\n              lat: item\.lat,\r\n              lng: item\.lng,\r\n              properties: item\.properties \|\| \{\}\r\n            \};\r\n            nearestDistM = dM;\r\n          \}\r\n        \}\);\r\n        var nearestList = nearestItem \? \[nearestItem\] : \[\];\r\n        var rawCount = Number\(data && data\.count\);\r\n        return \{\r\n          key: spec\.key,\r\n          label: spec\.label,\r\n          count: nearestItem \? 1 : 0,\r\n          rawCount: isFinite\(rawCount\) \? rawCount : 0,\r\n          items: nearestList,\r\n          nearestItem: nearestItem,\r\n          nearestDistanceM: nearestDistM != null \? Math\.round\(nearestDistM\) : null,\r\n          available: true/;
  var closestSummaryItemsReplacement = [
    "        var nearestItem = null;",
    "        var nearestDistM = null;",
    "        items.forEach(function (item) {",
    "          var lat = Number(item && item.lat);",
    "          var lng = Number(item && item.lng);",
    "          if (!isFinite(lat) || !isFinite(lng)) return;",
    "          var p4326 = new Point({ x: lng, y: lat, spatialReference: SR4326 });",
    "          var p32643 = projection.project(p4326, SR_METER) || null;",
    '          if (!p32643 || p32643.type !== "point") return;',
    "          try {",
    "            if (!geometryEngine.intersects(g32643, p32643)) return;",
    "          } catch (eInt0) {}",
    '          var dM = geometryEngine.distance(anchorPoint32643, p32643, "meters");',
    "          if (!isFinite(dM)) return;",
    "          if (nearestItem == null || nearestDistM == null || dM < nearestDistM) {",
    "            nearestItem = {",
    "              id: item.id,",
    "              name: item.name,",
    "              lat: item.lat,",
    "              lng: item.lng,",
    "              properties: item.properties || {}",
    "            };",
    "            nearestDistM = dM;",
    "          }",
    "        });",
    "        var nearestList = nearestItem ? [nearestItem] : [];",
    "        var rawCount = Number(data && data.count);",
    "        return {",
    "          key: spec.key,",
    "          label: spec.label,",
    "          count: nearestItem ? 1 : 0,",
    "          rawCount: isFinite(rawCount) ? rawCount : 0,",
    "          items: nearestList,",
    "          nearestItem: nearestItem,",
    "          nearestDistanceM: nearestDistM != null ? Math.round(nearestDistM) : null,",
    "          available: true",
  ].join("\n");
  if (closestSummaryItemsPattern.test(out)) {
    out = out.replace(closestSummaryItemsPattern, closestSummaryItemsReplacement);
  } else {
    console.warn("[msme runtime patch] closest summary all-items patch not applied.");
  }

  var closestMapHelpersPattern = /function runClosestFromPickedPoint\(anchor32643Point, radiusM\) \{/;
  var closestMapHelpersReplacement = [
    "function collectClosestMapFocusItems(communitySummary) {",
    "  var combined = [];",
    "  if (!communitySummary || !Array.isArray(communitySummary.categories)) return combined;",
    "  communitySummary.categories.forEach(function (row) {",
    "    var catKey = String(row && row.key ? row.key : \"\").toLowerCase();",
    "    var nearest = row && row.nearestItem ? row.nearestItem : null;",
    "    if (!nearest) {",
    "      var rowItems = row && Array.isArray(row.items) ? row.items : [];",
    "      nearest = rowItems.length ? rowItems[0] : null;",
    "    }",
    "    if (!nearest) return;",
    "    var lat = Number(nearest && nearest.lat);",
    "    var lng = Number(nearest && nearest.lng);",
    "    if (!isFinite(lat) || !isFinite(lng)) return;",
    "    var name = String(",
    "      (nearest && (nearest.name || nearest.label)) ||",
    "        (row && row.label ? row.label : catKey)",
    "    );",
    "    combined.push({ name: name, lat: lat, lng: lng, category: catKey, item: nearest });",
    "  });",
    "  return combined;",
    "}",
    "",
    "function showClosestResultsOnMap(anchor32643Point, summaryGeom32643, communitySummary, radiusM) {",
    "  if (!anchor32643Point || !summaryGeom32643) return;",
    "  projection.load().then(function () {",
    "    try {",
    "      if (identifyLayer && summaryGeom32643) {",
    "        var bufWeb = projection.project(summaryGeom32643, SR_WEB);",
    "        if (bufWeb) {",
    "          identifyLayer.add(new Graphic({",
    "            geometry: bufWeb,",
    "            symbol: symCadNearBuffer,",
    '            attributes: { type: "closest-buffer-overlay", radiusM: radiusM }',
    "          }));",
    "        }",
    "      }",
    "    } catch (eBuf0) {",
    '      console.warn("[closest map buffer]", eBuf0);',
    "    }",
    "    var focusItems = collectClosestMapFocusItems(communitySummary);",
    "    if (!focusItems.length) return;",
    '    if (typeof window !== "undefined" && window.dispatchEvent) {',
    '      window.dispatchEvent(new CustomEvent("msme-gis-focus-community-category", {',
    "        detail: {",
    '          category: "multi",',
    '          label: "Closest in buffer",',
    "          items: focusItems,",
    "          total: focusItems.length,",
    "          showAllRoutes: true,",
    "        },",
    "      }));",
    '      window.dispatchEvent(new CustomEvent("msme-community-panel-open"));',
    "    }",
    "  }).catch(function (eMap0) {",
    '    console.warn("[closest map show]", eMap0);',
    "  });",
    "}",
    "",
    "function runClosestFromPickedPoint(anchor32643Point, radiusM) {",
  ].join("\n");
  if (closestMapHelpersPattern.test(out)) {
    out = out.replace(closestMapHelpersPattern, closestMapHelpersReplacement);
  } else {
    console.warn("[msme runtime patch] closest map helpers patch not applied.");
  }

  var showAllPoiMaxRenderPattern = /var maxRender = 80;\r?\n  var limit = Math\.min\(allItems\.length, maxRender\);/;
  var showAllPoiMaxRenderReplacement = [
    "var maxRender = (detail && detail.showAllRoutes)",
    "    ? Math.min(600, Math.max(80, allItems.length))",
    "    : 80;",
    "  var limit = Math.min(allItems.length, maxRender);",
  ].join("\n");
  if (showAllPoiMaxRenderPattern.test(out)) {
    out = out.replace(showAllPoiMaxRenderPattern, showAllPoiMaxRenderReplacement);
  } else {
    console.warn("[msme runtime patch] show-all POI maxRender patch not applied.");
  }

  var showAllPoiRoadGraphPattern =
    /return drawOsrmRoutesBatch\(validItems\)\.then\(function \(osrmState\) \{\r?\n    if \(!osrmState \|\| !osrmState\.unresolved \|\| !osrmState\.unresolved\.length\) \{\r?\n      return finalizeGraphics\(\{ routed: \(osrmState && osrmState\.routed\) \|\| 0, fallback: 0 \}\);\r?\n    \}\r?\n    return queryLayer\(TRANS_MS, LAYER_ROADS_LINE, Object\.assign\(\{/;
  var showAllPoiRoadGraphReplacement = [
    "function queryRoadGraphAndDrawAllPois(itemsForRoute, routedSeed) {",
    "    return queryLayer(TRANS_MS, LAYER_ROADS_LINE, Object.assign({",
    '      where: "1=1",',
    "      returnGeometry: true,",
    '      outFields: "OBJECTID",',
    "      resultRecordCount: 2200",
    "    }, geometryToQueryParams(routeQueryExtent))).then(function (data) {",
    "      var roads = (data && data.features) || [];",
    "      if (!roads.length) {",
    "        return finalizeGraphics({",
    "          routed: routedSeed || 0,",
    "          fallback: (detail && detail.showAllRoutes) ? 0 : drawStraightFallbackForAll(itemsForRoute)",
    "        });",
    "      }",
    "      var graph = buildRoadGraph(roads, 8);",
    "      if (!graph || !graph.keys || !graph.keys.length) {",
    "        return finalizeGraphics({",
    "          routed: routedSeed || 0,",
    "          fallback: (detail && detail.showAllRoutes) ? 0 : drawStraightFallbackForAll(itemsForRoute)",
    "        });",
    "      }",
    "      return drawFromRoadGraph(graph, itemsForRoute, routedSeed || 0);",
    "    }).catch(function () {",
    "      return finalizeGraphics({",
    "        routed: routedSeed || 0,",
    "        fallback: (detail && detail.showAllRoutes) ? 0 : drawStraightFallbackForAll(itemsForRoute)",
    "      });",
    "    });",
    "  }",
    "",
    "  if (detail && detail.showAllRoutes && validItems.length > 0) {",
    '    setStatus("Drawing road-following routes for " + validItems.length + " POIs...");',
    "    return drawOsrmRoutesBatch(validItems).then(function (osrmStateAll) {",
    "      var routedAll = (osrmStateAll && osrmStateAll.routed) || 0;",
    "      var unresolvedAll = (osrmStateAll && osrmStateAll.unresolved) ? osrmStateAll.unresolved : [];",
    "      if (!unresolvedAll.length) return finalizeGraphics({ routed: routedAll, fallback: 0 });",
    "      return queryRoadGraphAndDrawAllPois(unresolvedAll, routedAll);",
    "    }).then(function () {",
    "      return doneZoom.then(function () { return true; });",
    "    });",
    "  }",
    "",
    "  return drawOsrmRoutesBatch(validItems).then(function (osrmState) {",
    "    if (!osrmState || !osrmState.unresolved || !osrmState.unresolved.length) {",
    "      return finalizeGraphics({ routed: (osrmState && osrmState.routed) || 0, fallback: 0 });",
    "    }",
    "    return queryLayer(TRANS_MS, LAYER_ROADS_LINE, Object.assign({",
  ].join("\n");
  if (showAllPoiRoadGraphPattern.test(out)) {
    out = out.replace(showAllPoiRoadGraphPattern, showAllPoiRoadGraphReplacement);
  } else {
    console.warn("[msme runtime patch] show-all POI road graph patch not applied.");
  }

  var mapSelectionPublishPattern =
    /publishMapSelectionReportSnapshot\(\{\s*generatedAt: new Date\(\)\.toISOString\(\),\s*reportKind: "map-selection",\s*selectionSource: selectionSource \|\| "map-click",\s*accumulate: mapSelectionAccumulateMode,\s*clicks: clicksPayload,\s*lat: lat,\s*lon: lon,\s*radiusM: radiusM,\s*atClickRows: atClickRows,\s*nearbyRows: nearbyRows,\s*communitySummary: null,\s*domContext: \{\}\s*\}\);/;
  var mapSelectionPublishReplacement = [
    "publishMapSelectionReportSnapshot({",
    "      generatedAt: new Date().toISOString(),",
    '      reportKind: "map-selection",',
    '      selectionSource: selectionSource || "map-click",',
    "      accumulate: mapSelectionAccumulateMode,",
    "      clicks: clicksPayload,",
    "      lat: lat,",
    "      lon: lon,",
    "      radiusM: radiusM,",
    "      atClickRows: atClickRows,",
    "      nearbyRows: nearbyRows,",
    "      communitySummary: null,",
    "      domContext: {}",
    "    });",
    "    try {",
    '      if (typeof window !== "undefined" && window.dispatchEvent) {',
    '        window.dispatchEvent(new CustomEvent("msme-community-panel-open"));',
    "      }",
    "    } catch (eMapOpen) {}",
  ].join("\n");
  if (mapSelectionPublishPattern.test(out)) {
    out = out.replace(mapSelectionPublishPattern, mapSelectionPublishReplacement);
  } else {
    console.warn("[msme runtime patch] map selection panel open patch not applied.");
  }

  var identifyPopupPattern =
    /var popupHtml = buildSimpleIdentifyPopupHtml\(lat,\s*lon,\s*popName,\s*popDist,\s*gisPh\((?:"mapPopupTitle"|\\\"mapPopupTitle\\\")\)\);\s*if \(selectionSource !== "map-click" && view\.popup && mapPoint\)\s*\{\s*view\.(?:openPopup|popup\.open)\(\{\s*title:\s*(?:""|\\\"\\\"),\s*content:\s*popupHtml,\s*location:\s*mapPoint\s*\}\);\s*\}/;
  var identifyPopupReplacement =
    'if (view && view.popup && mapPoint) {\n        openIdentifyMapPopup(view, mapPoint, lat, lon, popName, popDist, flat);\n      }';
  if (identifyPopupPattern.test(out)) {
    out = out.replace(identifyPopupPattern, identifyPopupReplacement);
  } else {
    console.warn("[msme runtime patch] identify popup place-details patch not applied.");
  }

  // Performance: delay optional operational layer warmup to reduce initial load time.
  // (These are the hidden layers like env/inv/util/cad etc. They can be loaded after first paint.)
  var optionalWarmupPattern =
    /ensureOptionalOperationalLayers\(\)\.catch\(function \(err\) \{\s*console\.warn\(\"\\[layer preset\\] optional layer warmup failed\", err\);\s*\}\);/;
  var optionalWarmupReplacement = [
    "window.setTimeout(function () {",
    "  try {",
    "    ensureOptionalOperationalLayers().catch(function (err) {",
    "      console.warn(\"[layer preset] optional layer warmup failed\", err);",
    "    });",
    "  } catch (e0) {}",
    "}, 6500);",
  ].join("\n");
  if (optionalWarmupPattern.test(out)) {
    out = out.replace(optionalWarmupPattern, optionalWarmupReplacement);
  }

  var quickProxPickPattern =
    /\} else if \(shouldProxRun\) \{\s*var curProxDist = parseInt\(\(document\.getElementById\("proxDist"\) \|\| \{\}\)\.value, 10\);\s*if \(!isFinite\(curProxDist\) \|\| curProxDist <= 0\) curProxDist = 2000;\s*setStatus\("Point set\. Running Proximity analysis \(" \+ curProxDist \+ " m\)\.\.\."\);\s*var proxBtn = document\.getElementById\("runProximity"\);\s*if \(proxBtn\) proxBtn\.click\(\);\s*\}/;
  var quickProxPickReplacement = [
    "} else if (shouldProxRun) {",
    "        var curProxDist = readProximityDistanceMetersFromUi();",
    "        if (!isFinite(curProxDist) || curProxDist <= 0) curProxDist = 2000;",
    "        setProximityDistanceMeters(curProxDist);",
    "        setBufferDistanceMeters(curProxDist);",
    '        var bufDistEl = document.getElementById("bufDist");',
    '        if (bufDistEl) bufDistEl.value = String(curProxDist);',
    '        if (typeof window !== "undefined") window.__msmeGisActiveAnalysisTool = "proximity";',
    '        setStatus("Point set. Running Proximity buffer (" + curProxDist + " m)...");',
    '        var runBtn = document.getElementById("runBuffer");',
    "        if (runBtn) runBtn.click();",
    "      }",
  ].join("\n");
  if (quickProxPickPattern.test(out)) {
    out = out.replace(quickProxPickPattern, quickProxPickReplacement);
  } else {
    console.warn("[msme runtime patch] quick proximity uses buffer patch not applied.");
  }

  var communityShownCountPattern =
    /var shownCount = isFinite\(plotted\) \? plotted : \(isFinite\(raw\) \? raw : 0\);/g;
  if (communityShownCountPattern.test(out)) {
    communityShownCountPattern.lastIndex = 0;
    out = out.replace(
      communityShownCountPattern,
      "var shownCount = Math.max(isFinite(plotted) ? plotted : 0, isFinite(raw) ? raw : 0);",
    );
  } else {
    console.warn("[msme runtime patch] community shownCount patch not applied.");
  }

  var mapClickRadiusPattern =
    /var radiusM = 3000;\s*try \{\s*radiusM = readCadNearRadiusMeters\(\);\s*\} catch \(e2\) \{\}/;
  var mapClickRadiusReplacement = [
    "var radiusM = 2000;",
    "  try {",
    "    var pickedRadius = readCadNearRadiusMeters();",
    "    if (isFinite(pickedRadius) && pickedRadius > 0) radiusM = Math.round(pickedRadius);",
    "  } catch (e2) {}",
  ].join("\n");
  if (mapClickRadiusPattern.test(out)) {
    out = out.replace(mapClickRadiusPattern, mapClickRadiusReplacement);
  } else {
    console.warn("[msme runtime patch] map-click community radius patch not applied.");
  }

  var mapPointSummaryPublishPattern =
    /publishMapSelectionReportSnapshot\(\{\s*generatedAt: new Date\(\)\.toISOString\(\),\s*reportKind: "map-selection",\s*selectionSource: summaryMeta && summaryMeta\.selectionSource \? summaryMeta\.selectionSource : "map-click",\s*accumulate: mapSelectionAccumulateMode,\s*clicks: clicksPayload,\s*lat: summaryMeta && summaryMeta\.lat != null \? summaryMeta\.lat : null,\s*lon: summaryMeta && summaryMeta\.lon != null \? summaryMeta\.lon : null,\s*radiusM: radius,\s*atClickRows: summaryMeta && summaryMeta\.atClickRows \? summaryMeta\.atClickRows : \[\],\s*nearbyRows: summaryMeta && summaryMeta\.nearbyRows \? summaryMeta\.nearbyRows : \[\],\s*communitySummary: communitySummary,\s*domContext: \{\}\s*\}\);/;
  var mapPointSummaryPublishReplacement = [
    "var mapSelPayload = {",
    "      generatedAt: new Date().toISOString(),",
    '      reportKind: "map-selection",',
    '      selectionSource: summaryMeta && summaryMeta.selectionSource ? summaryMeta.selectionSource : "map-click",',
    "      accumulate: mapSelectionAccumulateMode,",
    "      clicks: clicksPayload,",
    "      lat: summaryMeta && summaryMeta.lat != null ? summaryMeta.lat : null,",
    "      lon: summaryMeta && summaryMeta.lon != null ? summaryMeta.lon : null,",
    "      radiusM: radius,",
    "      atClickRows: summaryMeta && summaryMeta.atClickRows ? summaryMeta.atClickRows : [],",
    "      nearbyRows: summaryMeta && summaryMeta.nearbyRows ? summaryMeta.nearbyRows : [],",
    "      communitySummary: communitySummary,",
    "      domContext: {}",
    "    };",
    "    publishMapSelectionReportSnapshot(mapSelPayload);",
    "    try {",
    '      if (typeof window !== "undefined" && window.dispatchEvent) {',
    '        window.dispatchEvent(new CustomEvent("msme-community-panel-open"));',
    "      }",
    "    } catch (eMapSumOpen0) {}",
    "    enrichReportSnapshotWithPlaceContext(mapSelPayload, anchor32643Point, summaryGeom).then(function (finalMapSel) {",
    "      if (finalMapSel) publishMapSelectionReportSnapshot(finalMapSel);",
    "    }).catch(function (eMapSumEnrich) {",
    '      console.warn("[map summary] place enrich failed", eMapSumEnrich);',
    "    });",
  ].join("\n");
  if (mapPointSummaryPublishPattern.test(out)) {
    out = out.replace(mapPointSummaryPublishPattern, mapPointSummaryPublishReplacement);
  } else {
    console.warn("[msme runtime patch] map point summary publish patch not applied.");
  }

  var mapClickPinSymHelpers = [
    "var symMapClickPin = new SimpleMarkerSymbol({",
    '  style: "path",',
    '  path: "' + MAP_PIN_PATH_LEGACY + '",',
    "  color: [226, 35, 26, 0.98],",
    "  size: 22,",
    '  outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1.25 })',
    "});",
    "",
    "function clearAnalysisToolMapGraphics() {",
    "  try { clearResults(); } catch (eClr0) {}",
    "  try { if (identifyLayer) identifyLayer.removeAll(); } catch (eClr1) {}",
    "  try { if (connectorLayer) connectorLayer.removeAll(); } catch (eClr2) {}",
    "  try { clearConnectorGraphics(); } catch (eClr3) {}",
    "  try { clearCommunityZoomGraphic(); } catch (eClr4) {}",
    "  try { clearBufferAnchorMarker(); } catch (eClr5) {}",
    "  try {",
    "    closestPointPickModeActive = false;",
    "    quickBufferAutoRunAfterAnchorPick = false;",
    "    quickProximityAutoRunAfterAnchorPick = false;",
    '    if (typeof window !== "undefined") window.__msmeGisActiveAnalysisTool = null;',
    "  } catch (eClr6) {}",
    "}",
    "",
    "function clearMapClickPlaceGraphics() {",
    "  try {",
    "    if (view && view.popup) {",
    "      try { if (view.popup.visible) view.popup.close(); } catch (ePop0) {}",
    "    }",
    "  } catch (ePop1) {}",
    "  try {",
    "    if (identifyLayer && identifyLayer.graphics) {",
    "      var pinGraphics = [];",
    "      identifyLayer.graphics.forEach(function (g) {",
    "        var t = g && g.attributes && g.attributes.type;",
    '        if (t === "map-click-pin" || t === "map-click-radius") pinGraphics.push(g);',
    "      });",
    "      if (pinGraphics.length) identifyLayer.removeMany(pinGraphics);",
    "    }",
    "  } catch (ePinClr0) {}",
    "  try { if (connectorLayer) connectorLayer.removeAll(); } catch (ePinClr1) {}",
    "  try { clearConnectorGraphics(); } catch (ePinClr2) {}",
    "  try {",
    "    if (!mapSelectionAccumulateMode) mapIdentifyClickSessions = [];",
    "  } catch (ePinClr3) {}",
    "}",
    "",
    "function setMapClickSelectionGraphics(mapPoint, anchor32643, radiusM, selectionSource) {",
    '  if (String(selectionSource || "") !== "map-click") return;',
    "  if (!identifyLayer || !anchor32643) return;",
    "  var rad = Number(radiusM);",
    "  if (!isFinite(rad) || rad <= 0) rad = 2000;",
    "  try {",
    "    var buf32643 = geometryEngine.buffer(anchor32643, rad, \"meters\");",
    "    if (buf32643) {",
    "      var bufWeb = projection.project(buf32643, SR_WEB);",
    "      if (bufWeb) {",
    "        identifyLayer.add(new Graphic({",
    "          geometry: bufWeb,",
    "          symbol: symCadNearBuffer,",
    '          attributes: { type: "map-click-radius", radiusM: rad }',
    "        }));",
    "      }",
    "    }",
    "  } catch (eRad0) {",
    '    console.warn("[map click radius]", eRad0);',
    "  }",
    "  try {",
    "    var pinWeb = null;",
    '    if (mapPoint && mapPoint.type === "point") {',
    "      pinWeb =",
    "        mapPoint.spatialReference && Number(mapPoint.spatialReference.wkid) === 3857",
    "          ? mapPoint",
    "          : projection.project(mapPoint, SR_WEB);",
    "    }",
    "    if (!pinWeb) pinWeb = projection.project(anchor32643, SR_WEB);",
    "    if (pinWeb) {",
    "      identifyLayer.add(new Graphic({",
    "        geometry: pinWeb,",
    "        symbol: symMapClickPin,",
    '        attributes: { type: "map-click-pin" }',
    "      }));",
    "    }",
    "  } catch (ePin0) {",
    '    console.warn("[map click pin]", ePin0);',
    "  }",
    "}",
    "",
  ].join("\n");
  var mapClickPinSymPattern =
    /var communityZoomLabelGraphic = null;\r\n\r\nfunction clearResults\(\) \{ resultsLayer\.removeAll\(\); \}/;
  var mapClickPinSymReplacement = [
    "var communityZoomLabelGraphic = null;",
    mapClickPinSymHelpers,
    "function clearResults() { resultsLayer.removeAll(); }",
  ].join("\n");
  var mapClickPinSymAfterConstituencyPattern =
    /var communityZoomLabelGraphic = null;\r\n\r\nvar constituencyVillageLabelGraphics = \[\];/;
  var mapClickPinSymAfterConstituencyReplacement = [
    "var communityZoomLabelGraphic = null;",
    mapClickPinSymHelpers,
    "var constituencyVillageLabelGraphics = [];",
  ].join("\n");
  if (mapClickPinSymPattern.test(out)) {
    out = out.replace(mapClickPinSymPattern, mapClickPinSymReplacement);
  } else if (mapClickPinSymAfterConstituencyPattern.test(out)) {
    out = out.replace(
      mapClickPinSymAfterConstituencyPattern,
      mapClickPinSymAfterConstituencyReplacement,
    );
  } else {
    console.warn("[msme runtime patch] map click pin symbol patch not applied.");
  }

  var bufferFillSymbolsPattern =
    /var symBuffer = new SimpleFillSymbol\(\{\s*color: \[26, 115, 232, 0\.2\],\s*outline: new SimpleLineSymbol\(\{ color: \[26, 115, 232, 0\.85\], width: 1 \}\)\s*\}\);\s*var symVillage =[\s\S]*?var symCadNearBuffer = new SimpleFillSymbol\(\{\s*color: \[33, 150, 243, 0\.18\],\s*outline: new SimpleLineSymbol\(\{ color: \[13, 71, 161, 1\], width: 3 \}\)\s*\}\);/;
  var bufferFillSymbolsReplacement = [
    "var symBuffer = new SimpleFillSymbol({",
    "  color: [26, 115, 232, 0],",
    "  outline: new SimpleLineSymbol({ color: [26, 115, 232, 0.85], width: 1 })",
    "});",
    "var symVidhanSabha = new SimpleFillSymbol({",
    "  color: [13, 71, 161, 0.42],",
    "  outline: new SimpleLineSymbol({ color: [11, 42, 84, 1], width: 2 })",
    "});",
    "var symVillage = new SimpleFillSymbol({",
    "  color: [52, 168, 83, 0.35],",
    "  outline: new SimpleLineSymbol({ color: [30, 142, 62, 1], width: 1 })",
    "});",
    "var symPoint = new SimpleMarkerSymbol({",
    '  style: "circle", color: [234, 67, 53, 0.95], size: 9,',
    '  outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1 })',
    "});",
    "var symSuitable = new SimpleFillSymbol({",
    "  color: [52, 168, 83, 0.45],",
    "  outline: new SimpleLineSymbol({ color: [30, 142, 62, 1.5], width: 1.5 })",
    "});",
    "var symLineHit = new SimpleLineSymbol({ color: [251, 140, 0, 1], width: 2 });",
    "var symCadNearBuffer = new SimpleFillSymbol({",
    "  color: [33, 150, 243, 0],",
    "  outline: new SimpleLineSymbol({ color: [13, 71, 161, 1], width: 3 })",
    "});",
  ].join("\n");
  if (bufferFillSymbolsPattern.test(out)) {
    out = out.replace(bufferFillSymbolsPattern, bufferFillSymbolsReplacement);
  } else {
    console.warn("[msme runtime patch] buffer fill transparency patch not applied.");
  }

  var symPointPinPattern =
    /var symPoint = new SimpleMarkerSymbol\(\{\s*style: "circle", color: \[234, 67, 53, 0\.95\], size: 9,\s*outline: new SimpleLineSymbol\(\{ color: \[255, 255, 255, 1\], width: 1 \}\)\s*\}\);/;
  var symPointPinReplacement = [
    "var symPoint = new SimpleMarkerSymbol({",
    '  style: "path",',
    '  path: "' + MAP_PIN_PATH_LEGACY + '",',
    "  color: [226, 35, 26, 0.98],",
    "  size: 16,",
    '  outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1.25 })',
    "});",
  ].join("\n");
  if (symPointPinPattern.test(out)) {
    out = out.replace(symPointPinPattern, symPointPinReplacement);
  } else {
    console.warn("[msme runtime patch] symPoint red pin patch not applied.");
  }

  var mapClickPinCallPattern =
    /  \} catch \(e2\) \{\}\s*\r?\n\r?\n  return queryNearbyRowsFromPoint\(anchor32643, radiusM\)\.then/;
  var mapClickPinCallReplacement = [
    "  } catch (e2) {}",
    "",
    "  setMapClickSelectionGraphics(mapPoint, anchor32643, radiusM, selectionSource);",
    "",
    "  return queryNearbyRowsFromPoint(anchor32643, radiusM).then",
  ].join("\n");
  if (mapClickPinCallPattern.test(out)) {
    out = out.replace(mapClickPinCallPattern, mapClickPinCallReplacement);
  } else {
    console.warn("[msme runtime patch] map click pin draw patch not applied.");
  }

  var mapClickInstantPinPattern =
    /var anchor32643 = projection\.project\(mapPoint, SR_METER\);\s*lastIdentifyAnchor32643 = anchor32643;\s*return Promise\.all\(IDENTIFY_URLS\.map/;
  var mapClickInstantPinReplacement = [
    '    if (typeof window.__msmeShowGisDataLoader === "function") { try { window.__msmeShowGisDataLoader(); } catch (eLdMap0) {} }',
    "var anchor32643 = projection.project(mapPoint, SR_METER);",
    "    lastIdentifyAnchor32643 = anchor32643;",
    "    var mapClickRadiusM = 2000;",
    "    try {",
    "      var pickedMapRad = readCadNearRadiusMeters();",
    "      if (isFinite(pickedMapRad) && pickedMapRad > 0) mapClickRadiusM = Math.round(pickedMapRad);",
    "    } catch (eMapRad0) {}",
    '    setMapClickSelectionGraphics(mapPoint, anchor32643, mapClickRadiusM, "map-click");',
    "    return Promise.all(IDENTIFY_URLS.map",
  ].join("\n");
  if (mapClickInstantPinPattern.test(out)) {
    out = out.replace(mapClickInstantPinPattern, mapClickInstantPinReplacement);
  } else {
    console.warn("[msme runtime patch] map click instant pin patch not applied.");
  }

  var mapClickPlaceOnlyFnPattern = /function finalizeIdentifyResults\(anchor32643, mapPoint, flat, selectionSource\) \{/;
  var mapClickPlaceOnlyFnReplacement = [
    "function finishMapClickPlaceResults(anchor32643, mapPoint, flat, lat, lon, radiusM) {",
    "  clearAnalysisToolMapGraphics();",
    "  setMapClickSelectionGraphics(mapPoint, anchor32643, radiusM, \"map-click\");",
    "  var primaryNb = flat.filter(function (r) { return !isBoundaryLayerName(r.layerName); });",
    "  var popName = \"Selected location\";",
    "  var popDist = null;",
    "  if (primaryNb.length) {",
    "    var pr = primaryNb[0];",
    "    popName = pr.layerName || popName;",
    "    var gjp = pr.feature && pr.feature.geometry;",
    "    var gp = gjp ? geomFromJSON(gjp) : null;",
    "    if (gp && geometryIsUsable(gp)) {",
    "      coerceMissingSpatialReference(gp, SR_WEB);",
    "      var gp326 = toEngineSR(gp);",
    "      popDist = distanceFromPointToGeometry(anchor32643, gp326);",
    "      if (popDist != null && popDist > 5e6) popDist = null;",
    "    }",
    "  }",
    "  if (view && view.popup && mapPoint) {",
    "    openIdentifyMapPopup(view, mapPoint, lat, lon, popName, popDist, flat);",
    "  }",
    "  mapIdentifyClickSessions = [{",
    "    flat: flat,",
    "    anchor32643: anchor32643,",
    "    mapPoint: mapPoint,",
    "    lat: lat,",
    "    lon: lon,",
    "    radiusM: radiusM,",
    "    atClickRows: [],",
    "    nearbyRows: [],",
    "    communitySummary: null",
    "  }];",
    "  var placePayload = {",
    "    generatedAt: new Date().toISOString(),",
    "    reportKind: \"map-selection\",",
    "    selectionSource: \"map-click\",",
    "    placeOnly: true,",
    "    accumulate: false,",
    "    lat: lat,",
    "    lon: lon,",
    "    radiusM: radiusM,",
    "    atClickRows: [],",
    "    nearbyRows: [],",
    "    clicks: [{ clickIndex: 1, lat: lat, lon: lon, radiusM: radiusM }],",
    "    communitySummary: null,",
    "    domContext: {}",
    "  };",
    "  return enrichReportSnapshotWithPlaceContext(placePayload, anchor32643, null).then(function (finalSnap) {",
    "    function publishMapClickSnap(snap) {",
    "      publishAnalysisReportSnapshot(null);",
    "      publishMapSelectionReportSnapshot(snap);",
    "      try {",
    "        if (typeof window !== \"undefined\" && window.dispatchEvent) {",
    "          window.dispatchEvent(new CustomEvent(\"msme-community-panel-open\"));",
    "        }",
    "      } catch (eMapOpen) {}",
    "      setStatus(\"Location: \" + lat.toFixed(5) + \"°, \" + lon.toFixed(5) + \"°\");",
    "      return snap;",
    "    }",
    "    if (typeof window.msmeGisQueryAssemblyDetailsByPointWgs84 === \"function\") {",
    "      return window.msmeGisQueryAssemblyDetailsByPointWgs84({ lat: lat, lon: lon }).then(function (assemblyDetails) {",
    "        if (assemblyDetails) {",
    "          finalSnap.assemblyDetails = assemblyDetails;",
    "          if (!finalSnap.domContext) finalSnap.domContext = {};",
    "          finalSnap.domContext.assemblyDetails = assemblyDetails;",
    "        }",
    "        return publishMapClickSnap(finalSnap);",
    "      }).catch(function () {",
    "        return publishMapClickSnap(finalSnap);",
    "      });",
    "    }",
    "    return publishMapClickSnap(finalSnap);",
    "  });",
    "}",
    "",
    "function finalizeIdentifyResults(anchor32643, mapPoint, flat, selectionSource) {",
  ].join("\n");
  if (mapClickPlaceOnlyFnPattern.test(out)) {
    out = out.replace(mapClickPlaceOnlyFnPattern, mapClickPlaceOnlyFnReplacement);
  } else {
    console.warn("[msme runtime patch] map click place-only helper patch not applied.");
  }

  var mapClickPlaceOnlyEarlyPattern =
    /} else if \(selectionSource === \"map-click\" && !mapSelectionAccumulateMode\) \{\s*mapIdentifyClickSessions = \[\];\s*\}\s*\r?\n\r?\n  var cadHits = flat\.filter/;
  var mapClickPlaceOnlyEarlyReplacement = [
    "} else if (selectionSource === \"map-click\" && !mapSelectionAccumulateMode) {",
    "    mapIdentifyClickSessions = [];",
    "  }",
    "",
    "  if (selectionSource === \"map-click\" && !mapSelectionAccumulateMode && !selectParcelToolActive) {",
    "    var llMap = projection.project(mapPoint, SR4326);",
    "    var latMap = llMap.y;",
    "    var lonMap = llMap.x;",
    "    var radiusMap = 2000;",
    "    try {",
    "      var pickedMapR = readCadNearRadiusMeters();",
    "      if (isFinite(pickedMapR) && pickedMapR > 0) radiusMap = Math.round(pickedMapR);",
    "    } catch (eMapR0) {}",
    "    return finishMapClickPlaceResults(anchor32643, mapPoint, flat, latMap, lonMap, radiusMap);",
    "  }",
    "",
    "  var cadHits = flat.filter",
  ].join("\n");
  if (mapClickPlaceOnlyEarlyPattern.test(out)) {
    out = out.replace(mapClickPlaceOnlyEarlyPattern, mapClickPlaceOnlyEarlyReplacement);
  } else {
    console.warn("[msme runtime patch] map click place-only early return patch not applied.");
  }

  var mapClickClearBufferPattern =
    /if \(!mapSelectionAccumulateMode\) \{\s*identifyLayer\.removeAll\(\);\s*lastCadParcel32643 = null;\s*cadParcelLayer\.removeAll\(\);\s*mapIdentifyClickSessions = \[\];\s*\}/;
  var mapClickClearBufferReplacement = [
    "clearAnalysisToolMapGraphics();",
    "  if (!mapSelectionAccumulateMode) {",
    "    lastCadParcel32643 = null;",
    "    cadParcelLayer.removeAll();",
    "    mapIdentifyClickSessions = [];",
    "  }",
  ].join("\n");
  if (mapClickClearBufferPattern.test(out)) {
    out = out.replace(mapClickClearBufferPattern, mapClickClearBufferReplacement);
  } else {
    console.warn("[msme runtime patch] map click clear analysis buffers patch not applied.");
  }

  var bufferPickClearPinPattern =
    /if \(bufferMarkModeActive\) \{\s*projection\.load\(\)\.then\(function \(\) \{\s*bufferMarkPoint32643 = projection\.project\(event\.mapPoint, SR_METER\);/;
  var bufferPickClearPinReplacement = [
    "if (bufferMarkModeActive) {",
    "    projection.load().then(function () {",
    "      clearMapClickPlaceGraphics();",
    "      bufferMarkPoint32643 = projection.project(event.mapPoint, SR_METER);",
  ].join("\n");
  if (bufferPickClearPinPattern.test(out)) {
    out = out.replace(bufferPickClearPinPattern, bufferPickClearPinReplacement);
  } else {
    console.warn("[msme runtime patch] buffer pick clear pinpoint patch not applied.");
  }

  var closestRunClearPinPattern =
    /function runClosestFromPickedPoint\(anchor32643Point, radiusM\) \{\s*var radius = Number\(radiusM\);/;
  var closestRunClearPinReplacement = [
    "function runClosestFromPickedPoint(anchor32643Point, radiusM) {",
    "  clearMapClickPlaceGraphics();",
    "  var radius = Number(radiusM);",
  ].join("\n");
  if (closestRunClearPinPattern.test(out)) {
    out = out.replace(closestRunClearPinPattern, closestRunClearPinReplacement);
  } else {
    console.warn("[msme runtime patch] closest run clear pinpoint patch not applied.");
  }

  var runBufferClearPinPattern =
    /msmeBind\("runBuffer", "click", function \(\) \{\s*clearResults\(\);/;
  var runBufferClearPinReplacement = [
    'msmeBind("runBuffer", "click", function () {',
    "  clearMapClickPlaceGraphics();",
    "  clearResults();",
  ].join("\n");
  if (runBufferClearPinPattern.test(out)) {
    out = out.replace(runBufferClearPinPattern, runBufferClearPinReplacement);
  } else {
    console.warn("[msme runtime patch] runBuffer clear pinpoint patch not applied.");
  }

  var runProximityClearPinPattern =
    /msmeBind\("runProximity", "click", function \(\) \{\s*clearResults\(\);/;
  var runProximityClearPinReplacement = [
    'msmeBind("runProximity", "click", function () {',
    "  clearMapClickPlaceGraphics();",
    "  clearResults();",
  ].join("\n");
  if (runProximityClearPinPattern.test(out)) {
    out = out.replace(runProximityClearPinPattern, runProximityClearPinReplacement);
  } else {
    console.warn("[msme runtime patch] runProximity clear pinpoint patch not applied.");
  }

  return out;
}

// Eval parses code as a script; import.meta is invalid there, so rewrite to a safe alias first.
const __legacySource = patchLegacySource([c1, c2, c3].join("").replace(/import\.meta/g, "__msmeImportMeta"));

// Keep all legacy runtime dependencies on globalThis so eval'd code can resolve
// stable names even after bundler minification renames local bindings.
const __legacyEvalDeps = {
  "Map": Map,
  "MapView": MapView,
  "MapImageLayer": MapImageLayer,
  "FeatureLayer": FeatureLayer,
  "identify": identify,
  "IdentifyParameters": IdentifyParameters,
  "geometryEngine": geometryEngine,
  "jsonUtils": jsonUtils,
  "projection": projection,
  "SpatialReference": SpatialReference,
  "GraphicsLayer": GraphicsLayer,
  "Graphic": Graphic,
  "IdentityManager": IdentityManager,
  "esriConfig": esriConfig,
  "SimpleFillSymbol": SimpleFillSymbol,
  "SimpleLineSymbol": SimpleLineSymbol,
  "SimpleMarkerSymbol": SimpleMarkerSymbol,
  "TextSymbol": TextSymbol,
  "LayerList": LayerList,
  "Legend": Legend,
  "Home": Home,
  "ScaleBar": ScaleBar,
  "BasemapGallery": BasemapGallery,
  "Expand": Expand,
  "solve": solve,
  "RouteParameters": RouteParameters,
  "FeatureSet": FeatureSet,
  "Point": Point,
  "Polygon": Polygon,
  "Polyline": Polyline,
  "Extent": Extent,
  "jsPDF": jsPDF,
  "SketchViewModel": SketchViewModel,
  "SR_METER": SR_METER,
  "SR_WEB": SR_WEB,
  "SR4326": SR4326,
  "defaultStudyExtent32643": defaultStudyExtent32643,
  "BASE_MS": BASE_MS,
  "ADMIN_MS": ADMIN_MS,
  "ENV_MS": ENV_MS,
  "INV_MS": INV_MS,
  "SOC_MS": SOC_MS,
  "TRANS_MS": TRANS_MS,
  "UTIL_MS": UTIL_MS,
  "CAD_MS": CAD_MS,
  "CON_MS": CON_MS,
  "IDENTIFY_URLS": IDENTIFY_URLS,
  "LAYER_DISTRICT": LAYER_DISTRICT,
  "LAYER_TEHSIL": LAYER_TEHSIL,
  "LAYER_VILLAGE": LAYER_VILLAGE,
  "LAYER_ROADS_LINE": LAYER_ROADS_LINE,
  "LAYER_FOREST": LAYER_FOREST,
  "LAYER_INVESTMENT": LAYER_INVESTMENT,
  "LAYER_WATER": LAYER_WATER,
  "LAYER_CON_ASSEMBLY": LAYER_CON_ASSEMBLY,
  "LAYER_CON_PARLIAMENT": LAYER_CON_PARLIAMENT,
  "HR_DISTRICT_LONLAT": HR_DISTRICT_LONLAT,
  "normalizeDistrictCodeKey": normalizeDistrictCodeKey,
  "themeKeyFromUrl": themeKeyFromUrl,
  "POI_LAYERS": POI_LAYERS,
  "INT_LAYERS": INT_LAYERS,
  "UTIL_LINES": UTIL_LINES,
  "approxModeFromAdminLayerId": approxModeFromAdminLayerId,
  "queryLayer": queryLayer,
  "requestArcGisJson": requestArcGisJson,
  "getToken": getToken,
  "handleGisUnauthorized": handleGisUnauthorized,
  "geomFromJSON": geomFromJSON,
  "wkidValue": wkidValue,
  "normalizeSpatialReference": normalizeSpatialReference,
  "isWebMercatorWkid": isWebMercatorWkid,
  "coerceMissingSpatialReference": coerceMissingSpatialReference,
  "haversineMeters": haversineMeters,
  "ensureSR32643": ensureSR32643,
  "toEngineSR": toEngineSR,
  "geometryToQueryParams": geometryToQueryParams,
  "sqlQuote": sqlQuote,
  "geometryIsUsable": geometryIsUsable,
  "extentLooksEmpty": extentLooksEmpty,
  "normalizeDistrictKey": normalizeDistrictKey,
  "geodesicDistanceMetersFallback": geodesicDistanceMetersFallback,
  "distanceFromPointToGeometry": distanceFromPointToGeometry,
  "getGeometryCentroid": getGeometryCentroid,
  "queryAdministrativeGeometryForZoom": queryAdministrativeGeometryForZoom,
  "zoomToAdminFeatureExtent": zoomToAdminFeatureExtent,
  "mergeNearbyLayerLists": mergeNearbyLayerLists,
  "isGateway502Error": isGateway502Error,
  "alertNoDataExternal": alertNoDataExternal,
  "readAoiVillageBufferMeters": readAoiVillageBufferMeters,
  "syncAoiVillageBufferState": syncAoiVillageBufferState,
  "msmeBind": msmeBind,
  "fixGeometrySR": fixGeometrySR,
  "readCadNearRadiusMeters": readCadNearRadiusMeters,
  "isAdministrativeAoiTabActive": isAdministrativeAoiTabActive,
  "optionTextByValue": optionTextByValue,
  "constituencyRowsFromFeatures": constituencyRowsFromFeatures,
  "formatDistanceLabel": formatDistanceLabel,
  "setBufferDistanceMeters": setBufferDistanceMeters,
  "setProximityDistanceMeters": setProximityDistanceMeters,
  "setBufferQueryRadiusMeters": setBufferQueryRadiusMeters,
  "readBufferPickDistanceMetersFromUi": readBufferPickDistanceMetersFromUi,
  "readProximityDistanceMetersFromUi": readProximityDistanceMetersFromUi,
  "readClosestDistanceMetersFromUi": readClosestDistanceMetersFromUi,
  "deriveCommunityZoomLabel": deriveCommunityZoomLabel,
  "resolveCommunityZoomPoint4326": resolveCommunityZoomPoint4326,
  "readLandReportDomContext": readLandReportDomContext,
  "publishAoiLandReportSnapshot": publishAoiLandReportSnapshot,
  "publishMapSelectionReportSnapshot": publishMapSelectionReportSnapshot,
  "publishAnalysisReportSnapshot": publishAnalysisReportSnapshot,
  "publishAnalysisToolResult": publishAnalysisToolResult,
  "getAoiLandReportSnapshot": getAoiLandReportSnapshot,
  "getMapSelectionReportSnapshot": getMapSelectionReportSnapshot,
  "getAnalysisReportSnapshot": getAnalysisReportSnapshot,
  "getSelectedAoiLabel": getSelectedAoiLabel,
  "openAoiRoutePanel": openAoiRoutePanel,
  "closeAoiRoutePanel": closeAoiRoutePanel,
  "renderAoiRoutePanel": renderAoiRoutePanel,
  "formatIsoForPdf": formatIsoForPdf,
  "addPdfLine": addPdfLine,
  "chunkArray": chunkArray,
  "isMainRoadFeature": isMainRoadFeature,
  "featureOid": featureOid,
  "extractCommunityPlaceNameFromAttributes": extractCommunityPlaceNameFromAttributes,
  "parseCoordTextPair": parseCoordTextPair,
  "normalizeEsriCoordNode": normalizeEsriCoordNode,
  "normalizeEsriGeometryJson": normalizeEsriGeometryJson,
  "SCHOOL_LAYER_DEFS": SCHOOL_LAYER_DEFS,
  "COMMUNITY_SUMMARY_LAYER_SPECS": COMMUNITY_SUMMARY_LAYER_SPECS,
  "normalizeDistrictName": normalizeDistrictName,
  "HSVP_DISTRICT_ALIASES": HSVP_DISTRICT_ALIASES,
  "getHsvpDistrictNameByCode": getHsvpDistrictNameByCode,
  "hsvpPlotOid": hsvpPlotOid,
  "hsvpPlotNo": hsvpPlotNo,
  "hsvpPlotName": hsvpPlotName,
  "hsvpSectorAreaLabel": hsvpSectorAreaLabel,
  "hsvpSectorKey": hsvpSectorKey,
  "isBoundaryLayerName": isBoundaryLayerName,
  "pickSmallestPolygonFromIdentifyFlat": pickSmallestPolygonFromIdentifyFlat,
  "pickPrimaryIdentifyHitsForMap": pickPrimaryIdentifyHitsForMap,
  "identifyResultDedupeKey": identifyResultDedupeKey,
  "pickIdentifyHitsForHighlight": pickIdentifyHitsForHighlight,
  "escapeHtml": escapeHtml,
  "buildSimpleIdentifyPopupHtml": buildSimpleIdentifyPopupHtml,
  "computeUnionGeometryFromFlats": computeUnionGeometryFromFlats,
  "extractPlaceDetailsFromIdentifyFlat": extractPlaceDetailsFromIdentifyFlat,
  "mergePlaceDetails": mergePlaceDetails,
  "queryPlaceDetailsByPointWgs84": queryPlaceDetailsByPointWgs84,
  "gisPh": gisPh,
  "setRefreshGisPlaceholderLabelsImpl": setRefreshGisPlaceholderLabelsImpl,
  "applyMsmeGisUiStrings": applyMsmeGisUiStrings,
  "getEsriRouteSolveUrl": getEsriRouteSolveUrl,
  "hasArcGisRoutingApiKey": hasArcGisRoutingApiKey,
  "routeServiceNeedsApiKey": routeServiceNeedsApiKey,
  "isRoutingAuthError": isRoutingAuthError,
  "isValidWgsLatLon": isValidWgsLatLon,
  "coerceLocationToWgs": coerceLocationToWgs,
  "planarDistanceMeters": planarDistanceMeters,
  "buildRoadGraph": buildRoadGraph,
  "findNearestGraphNode": findNearestGraphNode,
  "shortestPathRoadGraph": shortestPathRoadGraph,
  "compactPathCoords": compactPathCoords,
  "buildRoutePinDataUrl": buildRoutePinDataUrl,
  "shortRouteLabelText": shortRouteLabelText,
  "HSACGGM_MAP_SERVICE_URLS": HSACGGM_MAP_SERVICE_URLS,
  "analysisPlaceContextSnippet": analysisPlaceContextSnippet,
  "queryAssemblyDetailsByPointWgs84": queryAssemblyDetailsByPointWgs84,
  "__msmeImportMeta": __msmeImportMeta,
};

if (typeof globalThis !== "undefined") {
  globalThis.__msmeLegacyEvalDeps = __legacyEvalDeps;
}

const __legacyEvalPrelude = [
  "const __legacyDeps = globalThis.__msmeLegacyEvalDeps || {};",
  ...Object.keys(__legacyEvalDeps).map((name) => `const ${name} = __legacyDeps[${JSON.stringify(name)}];`),
].join("\n");

const __legacyExports = eval(
  "(() => {\n" +
    __legacyEvalPrelude +
    "\n" +
    __legacySource +
    "\nreturn { initMsmeWebGis, applyMsmeGisUiStrings };\n})()"
);

const __legacyInitMsmeWebGis = __legacyExports.initMsmeWebGis;
export { applyMsmeGisUiStrings };

function ensureArcGisProxyAuthInterceptor() {
  if (typeof window === "undefined") return;
  if (window.__msmeArcGisProxyAuthInstalled) return;
  if (!esriConfig?.request?.interceptors) return;

  const authFailed = () => {
    handleGisUnauthorized();
  };

  const isUnauthorizedError = (error) => {
    if (!error) return false;
    const status =
      Number(error?.details?.httpStatus) ||
      Number(error?.response?.status) ||
      Number(error?.httpStatus) ||
      0;
    if (status === 401 || status === 403) return true;
    const text = String(error?.message || "").toLowerCase();
    return text.includes("401") || text.includes("403") || text.includes("unauthorized");
  };

  esriConfig.request.interceptors.push({
    urls: /\/mapserver\/service\//i,
    before(params) {
      const token = getToken();
      params.requestOptions = params.requestOptions || {};
      // We use backend JWT auth for proxy URLs; avoid ArcGIS IdentityManager prompts/noise.
      params.requestOptions.authMode = "anonymous";
      if (!token) return;
      params.requestOptions.headers = {
        ...(params.requestOptions.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    },
    error(error) {
      if (isUnauthorizedError(error) && getToken()) {
        authFailed();
      }
      throw error;
    },
  });

  window.__msmeArcGisProxyAuthInstalled = true;
}

function installAssemblyLookupBridge() {
  if (typeof window === "undefined") return;
  if (window.__msmeAssemblyLookupBridgeInstalled) return;
  window.__msmeAssemblyLookupBridgeInstalled = true;
  window.msmeGisQueryAssemblyDetailsByPointWgs84 = queryAssemblyDetailsByPointWgs84;
  window.msmeGisQueryPlaceDetailsByPointWgs84 = queryPlaceDetailsByPointWgs84;
}

export const initMsmeWebGis = (...args) => {
  ensureArcGisProxyAuthInterceptor();
  installAssemblyLookupBridge();
  if (typeof window !== "undefined") {
    import("./gisLoadingBridge.js").then((mod) => {
      if (typeof mod.installGisLoadingBridge === "function") mod.installGisLoadingBridge();
    });
  }
  installIdentifyPopupLayoutHook();
  if (typeof window !== "undefined") {
    window.configureMsmeMapPopupUi = configureMsmeMapPopupUi;
    window.repositionIdentifyPopup = repositionIdentifyPopup;
  }
  installMapPopupUiSetup();
  const legacyResult = __legacyInitMsmeWebGis(...args);
  if (typeof window !== "undefined") {
    (function scheduleCadastralLayerOpen(attempt) {
      if (attempt > 24) return;
      if (typeof window.msmeGisOpenCadastralLayer === "function" && window.msmeGisOpenCadastralLayer(false)) {
        return;
      }
      window.setTimeout(function () {
        scheduleCadastralLayerOpen(attempt + 1);
      }, 500);
    })(0);
  }
  return legacyResult;
};

if (typeof window !== "undefined") {
  installAssemblyLookupBridge();
}

const TRACK_TOOL_BUTTON_ID = "btnTrackPickPoint";
const TRACK_TOOL_LAYER_ID = LAYER_ROADS_LINE; // Transportation_Infrastructure -> Roads (Line)
const TRACK_TOOL_BUFFER_METERS = 500;
const TRACK_TOOL_PICK_SNAP_METERS = 1500;
const TRACK_TOOL_TARGET_WHERE =
  "(" +
  "UPPER(rd_name) LIKE '%NH-44%' OR UPPER(rd_name) LIKE '%NH 44%' OR UPPER(rd_name) LIKE '%NH44%' OR " +
  "UPPER(r_temp_id) LIKE '%NH-44%' OR UPPER(r_temp_id) LIKE '%NH 44%' OR UPPER(r_temp_id) LIKE '%NH44%'" +
  ")";

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
    state.buttonEl.textContent = "NH-44 Select (500m)";
    state.buttonEl.setAttribute("aria-pressed", "false");
    state.buttonEl.title = "Click on NH-44 line to create both-side buffer";
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
    var side = normalizeTrackBufferMeters(widthM);
    if (!isFinite(side) || side <= 0) side = TRACK_TOOL_BUFFER_METERS;
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
      title: "NH-44 buffer results",
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

  function isNh44RoadFeature(attrs) {
    var a = attrs || {};
    var name = String(a.rd_name || "").toUpperCase();
    var rid = String(a.r_temp_id || "").toUpperCase();
    if (name.indexOf("NH-44") >= 0 || name.indexOf("NH 44") >= 0 || name.indexOf("NH44") >= 0) return true;
    if (rid.indexOf("NH-44") >= 0 || rid.indexOf("NH 44") >= 0 || rid.indexOf("NH44") >= 0) return true;
    return false;
  }

  function collectUsableRailPolylinesFromFeatures(features) {
    var out = [];
    (features || []).forEach(function (f) {
      var g32643 = featureGeometryToEngine(f && f.geometry);
      if (!isUsableRailPolyline(g32643)) return;
      out.push(g32643);
    });
    return out;
  }

  function railLinesLikelyConnected(lineA, lineB, toleranceM) {
    if (!isUsableRailPolyline(lineA) || !isUsableRailPolyline(lineB)) return false;
    try {
      if (geometryEngine.intersects(lineA, lineB)) return true;
    } catch (e0) {}
    try {
      if (geometryEngine.touches(lineA, lineB)) return true;
    } catch (e1) {}
    var dM = NaN;
    try {
      dM = geometryEngine.distance(lineA, lineB, "meters");
    } catch (e2) {
      dM = NaN;
    }
    return isFinite(dM) && dM <= toleranceM;
  }

  function buildConnectedRailLinesForBuffer(seedRailLine32643, candidateFeatures, sideBufferMeters) {
    var seed = isUsableRailPolyline(seedRailLine32643) ? seedRailLine32643 : null;
    if (!seed) return [];
    var lines = collectUsableRailPolylinesFromFeatures(candidateFeatures);
    if (lines.length > 260) {
      var maxKeep = 260;
      var nearSeed = lines
        .map(function (ln) {
          var dM = Infinity;
          try {
            dM = geometryEngine.distance(seed, ln, "meters");
          } catch (e0) {
            dM = Infinity;
          }
          return { g: ln, d: isFinite(dM) ? dM : Infinity };
        })
        .sort(function (a, b) {
          return a.d - b.d;
        })
        .slice(0, maxKeep)
        .map(function (it) {
          return it.g;
        });
      lines = nearSeed.length ? nearSeed : lines.slice(0, maxKeep);
    }
    var all = [seed];
    lines.forEach(function (ln) {
      if (!ln) return;
      all.push(ln);
    });
    if (all.length <= 1) return [seed];

    var tolM = Math.max(12, Math.min(140, Math.round(Number(sideBufferMeters || 0) * 0.35) || 24));
    var visited = {};
    var queue = [0];
    visited[0] = true;

    while (queue.length) {
      var cur = queue.shift();
      var base = all[cur];
      for (var i = 1; i < all.length; i++) {
        if (visited[i]) continue;
        if (!railLinesLikelyConnected(base, all[i], tolM)) continue;
        visited[i] = true;
        queue.push(i);
      }
    }

    var result = [];
    Object.keys(visited).forEach(function (k) {
      var idx = parseInt(k, 10);
      if (!isFinite(idx) || idx < 0 || idx >= all.length) return;
      var g = all[idx];
      if (isUsableRailPolyline(g)) result.push(g);
    });
    return result.length ? result : [seed];
  }

  function resolveRailLineForBuffer(anchor32643, railLine32643, bufferMeters) {
    if (!isUsableRailPolyline(railLine32643)) return railLine32643;
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
    var bestNh44 = null;
    var bestNh44Dist = Infinity;
    var bestAny = null;
    var bestAnyDist = Infinity;
    (railFeatures || []).forEach(function (f) {
      var attrs = f && f.attributes ? f.attributes : {};
      var g32643 = featureGeometryToEngine(f && f.geometry);
      if (!isUsableRailPolyline(g32643)) return;
      var dM = distanceFromPointToGeometry(anchor32643, g32643);
      if (!isFinite(dM) || dM < 0) return;
      if (dM < bestAnyDist) {
        bestAnyDist = dM;
        bestAny = {
          feature: f,
          geometry: g32643,
          snapDistanceM: dM,
        };
      }
      if (isNh44RoadFeature(attrs) && dM < bestNh44Dist) {
        bestNh44Dist = dM;
        bestNh44 = {
          feature: f,
          geometry: g32643,
          snapDistanceM: dM,
        };
      }
    });
    return bestNh44 || bestAny;
  }

  function addTrackResultGraphics(
    view,
    anchor32643,
    lineBuffer32643,
    selectedRailInput32643,
    snapDistanceM,
    bufferWidthMeters,
    sideBufferMeters,
  ) {
    var layer = ensureGraphicsLayer(view);
    if (!layer) return;

    layer.removeAll();

    var bufferWeb = projection.project(lineBuffer32643, SR_WEB) || lineBuffer32643 || null;
    var selectedRailWebList = [];
    if (Array.isArray(selectedRailInput32643)) {
      selectedRailInput32643.forEach(function (g0) {
        if (!isUsableRailPolyline(g0)) return;
        var gw0 = projection.project(g0, SR_WEB) || g0 || null;
        if (gw0) selectedRailWebList.push(gw0);
      });
    } else if (isUsableRailPolyline(selectedRailInput32643)) {
      var gw1 = projection.project(selectedRailInput32643, SR_WEB) || selectedRailInput32643 || null;
      if (gw1) selectedRailWebList.push(gw1);
    }
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
    selectedRailWebList.forEach(function (selectedRailWeb) {
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
    });
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
    var totalWidthMeters = Math.max(1, Math.round(sideBufferMeters * 2));
    setStatus(
      "NH-44 buffer ready: selected road segment, " +
        sideBufferMeters +
        " m parallel each side on full selected line (total " +
        totalWidthMeters +
        " m)." +
        snapText,
    );
  }

  function runTrackNetworkBufferForAll(view, distanceM) {
    if (state.running) {
      setStatus("NH-44: buffer generation already in progress...");
      return Promise.resolve(false);
    }
    var bufferMeters = normalizeTrackBufferMeters(distanceM);
    state.running = true;
    return projection
      .load()
      .then(function () {
        if (!view || view.destroyed) return null;
        clearLegacyTrackConflicts();
        setStatus("NH-44: loading road network...");
        return queryLayer(TRANS_MS, TRACK_TOOL_LAYER_ID, {
          where: TRACK_TOOL_TARGET_WHERE,
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
              setStatus("NH-44: road line data not available for buffer.");
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
              setStatus("NH-44: buffer create nahi hua.");
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
              "NH-44 network buffer ready: " +
                lineGeoms.length +
                " road segment(s), both side " +
                bufferMeters +
                " m buffer.",
            );
            try {
              if (typeof window !== "undefined" && typeof window.msmeGisRunCommunitySummaryForGeometry === "function") {
                window.msmeGisRunCommunitySummaryForGeometry(fullBuffer32643, {
                  radiusM: bufferMeters,
                  selectionSource: "nh44-network",
                  roadSource: "nh44-road-network",
                  summary:
                    "NH-44 network buffer ready: " +
                    lineGeoms.length +
                    " road segment(s), both side " +
                    bufferMeters +
                    " m buffer.",
                });
              }
            } catch (eSummary0) {}
            return true;
          })
          .catch(function (err) {
            console.warn("[track network buffer] NH-44 query failed", err);
            setStatus("NH-44: network query failed.");
            return null;
          });
      })
      .catch(function (err0) {
        console.warn("[track network buffer] projection failed", err0);
        setStatus("NH-44: map projection unavailable.");
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
          setStatus("NH-44: selected point is invalid.");
          return null;
        }
        var pickZone32643 = geometryEngine.buffer(anchor32643, TRACK_TOOL_PICK_SNAP_METERS, "meters");
        if (!pickZone32643) {
          setStatus("NH-44: could not create selection zone.");
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
            if (nearest && nearest.geometry) return { nearest: nearest, candidateFeatures: features || [] };
            return queryLayer(TRANS_MS, TRACK_TOOL_LAYER_ID, {
              where: "1=1",
              outFields: "objectid,rd_name,r_temp_id,road_catog",
              returnGeometry: true,
              resultRecordCount: 2000,
            })
              .then(function (allData) {
                var allFeatures = allData && Array.isArray(allData.features) ? allData.features : [];
                return {
                  nearest: pickNearestRailFeature(anchor32643, allFeatures),
                  candidateFeatures: allFeatures,
                };
              })
              .catch(function () {
                return null;
              });
          })
          .then(function (resolvedPack) {
            var nearestResolved = resolvedPack && resolvedPack.nearest ? resolvedPack.nearest : null;
            var candidateFeatures = resolvedPack && Array.isArray(resolvedPack.candidateFeatures)
              ? resolvedPack.candidateFeatures
              : [];
            if (!nearestResolved || !nearestResolved.geometry) {
              setStatus("NH-44 trace nahi mila. NH-44 line ke paas click karein.");
              return null;
            }
            var sourceRailLine32643 = resolveRailLineForBuffer(anchor32643, nearestResolved.geometry, sideBufferMeters);
            if (!isUsableRailPolyline(sourceRailLine32643)) {
              setStatus("NH-44: selected trace par valid line segment nahi mila.");
              return null;
            }
            var selectedRailLines32643 = buildConnectedRailLinesForBuffer(
              sourceRailLine32643,
              candidateFeatures,
              sideBufferMeters,
            );
            if (!selectedRailLines32643.length) selectedRailLines32643 = [sourceRailLine32643];
            var lineBuffer32643 = buildRailBufferFromLines(selectedRailLines32643, sideBufferMeters);
            if (!lineBuffer32643 || !geometryIsUsable(lineBuffer32643)) {
              setStatus("NH-44: selected trace par buffer create nahi hua.");
              return null;
            }
            addTrackResultGraphics(
              view,
              anchor32643,
              lineBuffer32643,
              selectedRailLines32643,
              nearestResolved.snapDistanceM,
              bufferWidthMeters,
              sideBufferMeters,
            );
            try {
              if (typeof window !== "undefined" && typeof window.msmeGisRunCommunitySummaryForGeometry === "function") {
                window.msmeGisRunCommunitySummaryForGeometry(lineBuffer32643, {
                  radiusM: sideBufferMeters,
                  selectionSource: "nh44-pick",
                  roadSource: "nh44-road",
                  summary:
                    "NH-44 buffer ready: selected road segment, " +
                    sideBufferMeters +
                    " m each side.",
                });
              }
            } catch (eSummary1) {}
            return true;
          })
          .catch(function (err) {
            console.warn("[track buffer] NH-44 query failed", err);
            setStatus("NH-44 query failed.");
          });
      })
      .catch(function (err0) {
        console.warn("[track buffer] projection failed", err0);
        setStatus("NH-44: map projection unavailable.");
      });
  }

  function startPickMode(view, distanceM) {
    var bufferWidthMeters = normalizeTrackBufferMeters(distanceM);
    if (!view || view.destroyed) return;
    clearLegacyTrackConflicts();
    stopPickMode();
    state.pickMode = true;
    if (state.buttonEl) {
      state.buttonEl.textContent = "NH-44: Select on map";
      state.buttonEl.setAttribute("aria-pressed", "true");
      state.buttonEl.title = "Click on map near NH-44 road line";
    }
    setPickCursor(view);
    setStatus(
      "NH-44 mode on: click NH-44 road line to create " +
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
    state.buttonEl.textContent = "NH-44 Select (500m)";
    state.buttonEl.title = "Click and pick NH-44 line for both-side buffer";
    state.buttonEl.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      var view = window.__msmeGisMapView;
      if (!view || view.destroyed) {
        setStatus("NH-44 tool unavailable: map not ready.");
        return;
      }
      startPickMode(view, TRACK_TOOL_BUFFER_METERS);
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
      setStatus("NH-44 tool unavailable: map not ready.");
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

function installMeasurementLineTool() {
  if (typeof window === "undefined") return;
  if (window.__msmeMeasurementLineToolInstalled) return;
  window.__msmeMeasurementLineToolInstalled = true;

  var state = {
    viewRef: null,
    graphicsLayer: null,
    sketchVM: null,
    createHandle: null,
    drawing: false,
    prevCursor: "",
  };

  function publishLineDistance(meters) {
    var m = Number(meters);
    var detail = {
      meters: Number.isFinite(m) && m >= 0 ? m : null,
      km: Number.isFinite(m) && m >= 0 ? m / 1000 : null,
    };
    try {
      window.dispatchEvent(new CustomEvent("msme-measurement-line-distance", { detail: detail }));
    } catch (e0) {}
  }

  function setStatus(msg) {
    var statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = String(msg || "");
  }

  function ensureGraphicsLayer(view) {
    if (!view || !view.map) return null;
    if (state.graphicsLayer && !state.graphicsLayer.destroyed) {
      if (!view.map.layers.includes(state.graphicsLayer)) {
        try {
          view.map.add(state.graphicsLayer);
        } catch (e0) {}
      }
      return state.graphicsLayer;
    }
    state.graphicsLayer = new GraphicsLayer({
      id: "__msmeMeasurementLineLayer",
      title: "Measurement line",
      listMode: "hide",
    });
    try {
      view.map.add(state.graphicsLayer);
    } catch (e1) {}
    return state.graphicsLayer;
  }

  function computeLineLengthMeters(geom) {
    if (!geom || geom.type !== "polyline") return null;
    var g4326 = null;
    try {
      g4326 = projection.project(geom, SR4326);
    } catch (e0) {
      g4326 = null;
    }
    if (g4326) {
      var km = geometryEngine.geodesicLength(g4326, "kilometers");
      if (Number.isFinite(km) && km >= 0) return km * 1000;
    }
    try {
      var g326 = toEngineSR(geom);
      if (g326) {
        var planar = geometryEngine.planarLength(g326, "meters");
        if (Number.isFinite(planar) && planar >= 0) return planar;
      }
    } catch (e1) {}
    return null;
  }

  function measureGraphicGeometry(geom) {
    if (!geom) return;
    projection.load().then(function () {
      var meters = computeLineLengthMeters(geom);
      publishLineDistance(meters);
      if (Number.isFinite(meters) && meters >= 0) {
        setStatus(
          "Line distance: " +
            (meters >= 1000
              ? (meters / 1000).toFixed(2) + " km"
              : Math.round(meters) + " m"),
        );
      }
    });
  }

  function ensureSketch(view) {
    var layer = ensureGraphicsLayer(view);
    if (!layer || !view) return null;
    if (state.sketchVM && !state.sketchVM.destroyed) return state.sketchVM;

    state.sketchVM = new SketchViewModel({
      view: view,
      layer: layer,
      polylineSymbol: new SimpleLineSymbol({
        color: [0, 109, 91, 1],
        width: 3,
        style: "solid",
      }),
    });

    if (state.createHandle) {
      try {
        state.createHandle.remove();
      } catch (e0) {}
    }

    state.createHandle = state.sketchVM.on("create", function (ev) {
      if (!ev || !ev.graphic) return;
      if (ev.state === "active" && ev.graphic.geometry) {
        measureGraphicGeometry(ev.graphic.geometry);
        return;
      }
      if (ev.state !== "complete") return;
      state.drawing = false;
      try {
        if (view && view.container) view.container.style.cursor = state.prevCursor || "";
      } catch (e1) {}
      measureGraphicGeometry(ev.graphic.geometry);
    });

    return state.sketchVM;
  }

  function stopDrawing() {
    state.drawing = false;
    if (state.sketchVM) {
      try {
        state.sketchVM.cancel();
      } catch (e0) {}
    }
    var view = window.__msmeGisMapView;
    if (view && view.container) {
      try {
        view.container.style.cursor = state.prevCursor || "";
      } catch (e1) {}
    }
  }

  window.msmeGisStartMeasurementLineDraw = function () {
    var view = window.__msmeGisMapView;
    if (!view || view.destroyed) {
      setStatus("Measurement line: map not ready.");
      return false;
    }
    var sketch = ensureSketch(view);
    if (!sketch) return false;
    stopDrawing();
    if (state.graphicsLayer) {
      try {
        state.graphicsLayer.removeAll();
      } catch (e0) {}
    }
    publishLineDistance(null);
    state.prevCursor = (view.container && view.container.style.cursor) || "";
    if (view.container) view.container.style.cursor = "crosshair";
    state.drawing = true;
    sketch.create("polyline");
    setStatus("Measurement: click map points, double-click to finish line.");
    return true;
  };

  window.msmeGisStopMeasurementLineDraw = function () {
    stopDrawing();
    return true;
  };

  window.msmeGisClearMeasurementLine = function () {
    stopDrawing();
    if (state.graphicsLayer) {
      try {
        state.graphicsLayer.removeAll();
      } catch (e0) {}
    }
    publishLineDistance(null);
    setStatus("");
    return true;
  };

  function syncViewRef() {
    var view = window.__msmeGisMapView;
    if (state.viewRef === view) return;
    state.viewRef = view || null;
    stopDrawing();
    if (view) ensureGraphicsLayer(view);
  }

  window.setInterval(syncViewRef, 800);
}

function installCadastralLayerAutoOpen() {
  if (typeof window === "undefined") return;
  if (window.__msmeCadastralLayerAutoOpenInstalled) return;
  window.__msmeCadastralLayerAutoOpenInstalled = true;

  function normalizeServiceUrl(value) {
    return String(value || "")
      .trim()
      .replace(/[?#].*$/, "")
      .replace(/\/+$/, "")
      .toLowerCase();
  }

  var cadBaseUrl = normalizeServiceUrl(CAD_MS);

  function setVisibleForSublayers(sublayers) {
    if (!sublayers || typeof sublayers.forEach !== "function") return;
    sublayers.forEach(function (sub) {
      try {
        sub.visible = true;
      } catch (e0) {}
      if (sub && sub.sublayers) setVisibleForSublayers(sub.sublayers);
    });
  }

  function findCadastralLayer(map) {
    if (!map || !map.layers || typeof map.layers.forEach !== "function") return null;
    var found = null;
    map.layers.forEach(function (lyr) {
      if (found) return;
      var id0 = String((lyr && lyr.id) || "");
      var title0 = String((lyr && lyr.title) || "");
      var url0 = normalizeServiceUrl((lyr && lyr.url) || "");
      var urlMatchesCad =
        !!cadBaseUrl &&
        (url0 === cadBaseUrl ||
          url0.indexOf(cadBaseUrl + "/") === 0 ||
          cadBaseUrl.indexOf(url0 + "/") === 0);
      var isCad =
        /cad/i.test(id0) ||
        /cadastral/i.test(title0) ||
        /haryana[_\s-]*cadastral/i.test(url0) ||
        /msme_cadastral/i.test(url0) ||
        urlMatchesCad;
      if (isCad) found = lyr;
    });
    return found;
  }

  function openCadPanelTab() {
    if (window.__msmeCadUiOpenedOnce) return true;
    var openNavBtn = document.getElementById("btnOpenNav");
    var aoiPanel = document.getElementById("aoiPanel");
    if (openNavBtn && aoiPanel && aoiPanel.classList.contains("collapsed")) {
      try {
        openNavBtn.click();
      } catch (e0) {}
    }
    var tabCad = document.getElementById("tabCad");
    if (tabCad && typeof tabCad.click === "function") {
      try {
        tabCad.click();
        window.__msmeCadUiOpenedOnce = true;
        return true;
      } catch (e1) {}
    }
    return false;
  }

  function ensureLayersPanelOpen() {
    var panel = document.getElementById("toolsPanel");
    var btn = document.getElementById("btnTogglePanel");
    if (!panel || !btn || typeof btn.click !== "function") return false;
    if (panel.classList.contains("collapsed")) {
      try {
        btn.click();
      } catch (e0) {}
    }
    return !panel.classList.contains("collapsed");
  }

  function ensureCadastralLayerListVisible() {
    var root = document.getElementById("layerListContainer");
    if (!root) return false;

    var items = root.querySelectorAll("calcite-list-item, .esri-layer-list__item, [role='listitem']");
    var found = false;
    var switched = false;

    items.forEach(function (item) {
      if (switched) return;
      var text = String((item && item.textContent) || "").toLowerCase();
      if (text.indexOf("cadastral") === -1 && text.indexOf("cad") === -1) return;
      found = true;

      var toggle = item.querySelector(
        ".esri-layer-list__visibility-toggle, calcite-action[icon='view-hide'], calcite-action[icon='view-visible'], button[aria-pressed], [aria-label*='visibility' i], [title*='visibility' i]",
      );
      if (!toggle || typeof toggle.click !== "function") return;

      var pressed = String(toggle.getAttribute("aria-pressed") || "");
      var classText = String(toggle.className || "");
      var iconText = String(toggle.getAttribute("icon") || "");
      var offState = /view-hide|non-visible|eye-off|esri-icon-non-visible/i.test(classText + " " + iconText);

      if (pressed === "false" || offState) {
        try {
          toggle.click();
          switched = true;
        } catch (e0) {}
        return;
      }

      if (pressed === "true") switched = true;
    });

    return found && switched;
  }

  function openCadastralLayer(opts) {
    opts = opts || {};
    var openUi = !!opts.openUi;
    var view = window.__msmeGisMapView;
    if (!view || view.destroyed || !view.map) return false;
    if (openUi) ensureLayersPanelOpen();
    var cadLayer = findCadastralLayer(view.map);
    if (!cadLayer) return false;
    try {
      cadLayer.visible = true;
      cadLayer.opacity = 1;
    } catch (e1) {}

    if (openUi && typeof cadLayer.when === "function") {
      cadLayer
        .when(function () {
          try {
            if (cadLayer.sublayers) setVisibleForSublayers(cadLayer.sublayers);
          } catch (e2) {}
        })
        .catch(function () {
          return null;
        });
    }
    if (openUi) {
      openCadPanelTab();
      ensureCadastralLayerListVisible();
      window.setTimeout(ensureCadastralLayerListVisible, 300);
      window.setTimeout(ensureCadastralLayerListVisible, 900);
    }
    return true;
  }

  window.msmeGisOpenCadastralLayer = function (openUi) {
    return openCadastralLayer({ openUi: openUi !== false });
  };

}

installMeasurementLineTool();
installRailTrackBufferTool();
installCadastralLayerAutoOpen();
