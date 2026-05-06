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

// Eval parses code as a script; import.meta is invalid there, so rewrite to a safe alias first.
const __legacySource = [c1, c2, c3].join("").replace(/import\.meta/g, "__msmeImportMeta");

const __legacyExports = eval("(() => {\n" + __legacySource + "\nreturn { initMsmeWebGis, applyMsmeGisUiStrings };\n})()");

export const initMsmeWebGis = __legacyExports.initMsmeWebGis;
export { applyMsmeGisUiStrings };
