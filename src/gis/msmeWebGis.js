/* eslint-disable -- generated / legacy GIS bundle */
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
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import "@arcgis/core/assets/esri/themes/light/main.css";

import { SR_METER, SR_WEB, SR4326, defaultStudyExtent32643 } from "./msme/spatialRefs.js";
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
  HR_DISTRICT_LONLAT,
  normalizeDistrictCodeKey,
  themeKeyFromUrl,
  POI_LAYERS,
  INT_LAYERS,
  UTIL_LINES,
  approxModeFromAdminLayerId,
} from "./msme/serviceUrlsAndLayers.js";
import { queryLayer, requestArcGisJson } from "./msme/queryClient.js";
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
} from "./msme/geometryUtils.js";
import { queryAdministrativeGeometryForZoom } from "./msme/adminGeometryQuery.js";
import { zoomToAdminFeatureExtent } from "./msme/adminExtentZoom.js";
import { mergeNearbyLayerLists } from "./msme/nearbyLayers.js";
import {
  isBoundaryLayerName,
  pickSmallestPolygonFromIdentifyFlat,
  pickPrimaryIdentifyHitsForMap,
  identifyResultDedupeKey,
  pickIdentifyHitsForHighlight,
  escapeHtml,
  buildSimpleIdentifyPopupHtml,
  computeUnionGeometryFromFlats,
} from "./msme/identifyFeatureHelpers.js";

let currentLocationGraphic = null;
var lastCurrentLocationWgs = null;
var lastAoiLocationWgs = null;
var lastCadCenterWgs = null;
var lastNearestPoiWgs = null;

// var lat = position.coords.latitude;
// var lng = position.coords.longitude;
// lastCurrentLocationWgs = { lat: lat, lon: lng };
/** Dropdown / status labels for cadastral + admin selects (updated from React i18n). */
var GIS_UI_DEFAULTS = {
  district: "District",
  tehsil: "Tehsil",
  village: "Village",
  muraba: "Muraba",
  parcel: "Parcel",
  cadKhasraPlaceholder: "Select khasra (optional ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â or zoom muraba only)",
  allTehsils: "All tehsils",
  allVillages: "All villages",
  mapPopupTitle: "Features at this location",
  hsvpPlot: "Plot"
};
var __gisUi = Object.assign({}, GIS_UI_DEFAULTS);
var refreshGisPlaceholderLabelsImpl = function () {};

function gisPh(key) {
  var v = __gisUi[key];
  return v != null && v !== "" ? v : GIS_UI_DEFAULTS[key] || key;
}

/**
 * Refresh cadastral / admin / HSVP dropdown first-option labels after language change.
 * Call from React when translations update (after initMsmeWebGis).
 */
export function applyMsmeGisUiStrings(next) {
  if (next && typeof next === "object") {
    Object.assign(__gisUi, next);
  }
  try {
    refreshGisPlaceholderLabelsImpl();
  } catch (e1) {
    console.warn("[i18n] GIS labels refresh", e1);
  }
}

/**
 * Bootstraps the MSME WebGIS map and UI (ported from AMD app/main).
 * Call once after the DOM nodes from the shell exist.
 */
export function initMsmeWebGis() {
"use strict";

if (typeof window !== "undefined") {
  if (window.__msmeGisInitInProgress || window.__msmeGisInitialized) {
    return;
  }
  window.__msmeGisInitInProgress = true;
}

/** Tear down previous MapView (React Strict Mode remount / navigation) before creating a new one. */
if (typeof window !== "undefined" && typeof window.__msmeGisCleanup === "function") {
  try {
    window.__msmeGisCleanup();
  } catch (e0) {}
}
if (typeof window !== "undefined") {
  window.__msmeGisBootId = (window.__msmeGisBootId || 0) + 1;
}
var myBootId = typeof window !== "undefined" ? window.__msmeGisBootId : 1;

if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ARCGIS_API_KEY) {
  esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
}
if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ARCGIS_ROUTE_SERVICE_URL) {
  esriConfig.routeServiceUrl = import.meta.env.VITE_ARCGIS_ROUTE_SERVICE_URL;
}

function readLandReportDomContext() {
  function tx(id) {
    var el = document.getElementById(id);
    if (!el || !el.selectedOptions || !el.selectedOptions[0]) return "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â";
    return String(el.selectedOptions[0].text || "").trim() || "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â";
  }
  return {
    administrative: {
      state: tx("stateSelect"),
      district: tx("districtSelect"),
      tehsil: tx("tehsilSelect"),
      village: tx("villageSelect")
    },
    cadastral: {
      district: tx("cadDistrictSelect"),
      tehsil: tx("cadTehsilSelect"),
      village: tx("cadVillageSelect"),
      muraba: tx("cadMurabaSelect"),
      khasra: tx("cadKhasraSelect")
    },
    hsvp: {
      district: tx("hsvpDistrictSelect"),
      plot: tx("hsvpPlotSelect")
    }
  };
}

/** AOI / dropdown-driven report (admin + cad context) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â separate from map identify & analysis. */
var lastAoiLandReportSnapshot = null;
function publishAoiLandReportSnapshot(payload) {
  lastAoiLandReportSnapshot = payload;
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("msme-aoi-land-report-snapshot"));
    }
  } catch (e0) {}
}

/** Map click / sketch identify ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â separate from AOI and from analysis summaries. */
var lastMapSelectionReportSnapshot = null;
function publishMapSelectionReportSnapshot(payload) {
  lastMapSelectionReportSnapshot = payload;
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("msme-map-selection-report-snapshot"));
    }
  } catch (e0) {}
}
window.msmeGisShowCurrentLocation = function () {
  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported in this browser.");
    return;
  }

  if (!view || view.destroyed) {
    setStatus("Map is not ready yet.");
    return;
  }

  setStatus("Fetching current location...");

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      lastCurrentLocationWgs = { lat: lat, lon: lng };

      try {
        if (currentLocationGraphic) {
          view.graphics.remove(currentLocationGraphic);
        }

        currentLocationGraphic = new Graphic({
          geometry: {
            type: "point",
            longitude: lng,
            latitude: lat,
            spatialReference: { wkid: 4326 }
          },
          symbol: {
            type: "simple-marker",
            style: "circle",
            size: 11,
            color: [0, 122, 255, 0.95],
            outline: { color: [255, 255, 255, 0.95], width: 1.5 }
          },
          attributes: {
            label: "Current Location"
          },
          popupTemplate: {
            title: "Current Location",
            content: lat.toFixed(6) + ", " + lng.toFixed(6)
          }
        });

        view.graphics.add(currentLocationGraphic);

        await view.goTo(
          {
            center: [lng, lat],
            zoom: 14
          },
          { duration: 1000 }
        );

        view.popup.open({
          title: "Current Location",
          content: lat.toFixed(6) + ", " + lng.toFixed(6),
          location: {
            type: "point",
            longitude: lng,
            latitude: lat,
            spatialReference: { wkid: 4326 }
          }
        });

        setStatus("Current location loaded.");
      } catch (err) {
        console.error("Location draw error:", err);
        setStatus("Current location found, but map zoom failed.");
      }
    },
    function (error) {
      console.error("Location error:", error);

      if (error.code === 1) {
        setStatus("Location permission denied.");
      } else if (error.code === 2) {
        setStatus("Location unavailable.");
      } else if (error.code === 3) {
        setStatus("Location request timed out.");
      } else {
        setStatus("Unable to fetch current location.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

function getEsriRouteSolveUrl() {
  var base = (esriConfig.routeServiceUrl || "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World").replace(/\/$/, "");
  return base.indexOf("solve") !== -1 ? base : base + "/solve";
}

function hasArcGisRoutingApiKey() {
  return !!(esriConfig && esriConfig.apiKey);
}

function routeServiceNeedsApiKey(solveUrl) {
  var u = String(solveUrl || "").toLowerCase();
  return u.indexOf("route-api.arcgis.com") >= 0;
}

function isRoutingAuthError(err) {
  if (!err) return false;
  try {
    var d = err.details || {};
    var hs = Number(d.httpStatus || d.status || d.code);
    if (hs === 401 || hs === 403 || hs === 498 || hs === 499) return true;
  } catch (e0) {}
  var m = String((err && err.message) || "");
  return /api\s*key|token required|unauthorized|forbidden|not authorized|status:?\s*(401|403|498|499)/i.test(m);
}

function isValidWgsLatLon(lat, lon) {
  return isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

function coerceLocationToWgs(loc) {
  if (!loc) return Promise.resolve(null);
  var lat = Number(loc.lat);
  var lon = Number(loc.lon);
  if (isValidWgsLatLon(lat, lon)) return Promise.resolve({ lat: lat, lon: lon });

  return projection.load().then(function () {
    var tries = [];
    if (isFinite(lon) && isFinite(lat)) {
      tries.push(new Point({ x: lon, y: lat, spatialReference: SR_METER }));
      tries.push(new Point({ x: lat, y: lon, spatialReference: SR_METER }));
      tries.push(new Point({ x: lon, y: lat, spatialReference: SR_WEB }));
      tries.push(new Point({ x: lat, y: lon, spatialReference: SR_WEB }));
    }
    for (var i = 0; i < tries.length; i++) {
      var p = projection.project(tries[i], SR4326);
      if (!p) continue;
      if (isValidWgsLatLon(Number(p.y), Number(p.x))) {
        return { lat: Number(p.y), lon: Number(p.x) };
      }
    }
    return null;
  }).catch(function () {
    return null;
  });
}

function planarDistanceMeters(ax, ay, bx, by) {
  var dx = Number(bx) - Number(ax);
  var dy = Number(by) - Number(ay);
  return Math.sqrt(dx * dx + dy * dy);
}

function buildRoadGraph(features, mergeToleranceM) {
  var tol = Number(mergeToleranceM) > 0 ? Number(mergeToleranceM) : 8;
  var nodesByKey = {};
  var keys = [];

  function keyForXY(x, y) {
    return Math.round(x / tol) + "|" + Math.round(y / tol);
  }

  function ensureNode(key, x, y) {
    var n = nodesByKey[key];
    if (n) {
      n.xSum += x;
      n.ySum += y;
      n.count += 1;
      return n;
    }
    n = { key: key, x: x, y: y, xSum: x, ySum: y, count: 1, edges: {} };
    nodesByKey[key] = n;
    keys.push(key);
    return n;
  }

  function addEdge(k1, k2, w) {
    if (!isFinite(w) || w <= 0 || k1 === k2) return;
    var n1 = nodesByKey[k1];
    var n2 = nodesByKey[k2];
    if (!n1 || !n2) return;
    if (n1.edges[k2] == null || w < n1.edges[k2]) n1.edges[k2] = w;
    if (n2.edges[k1] == null || w < n2.edges[k1]) n2.edges[k1] = w;
  }

  (features || []).forEach(function (f) {
    var g = toEngineSR(ensureSR32643(geomFromJSON(f && f.geometry)));
    if (!g || g.type !== "polyline" || !g.paths || !g.paths.length) return;
    g.paths.forEach(function (path) {
      if (!path || path.length < 2) return;
      for (var i = 0; i < path.length - 1; i++) {
        var a = path[i];
        var b = path[i + 1];
        if (!a || !b || !isFinite(a[0]) || !isFinite(a[1]) || !isFinite(b[0]) || !isFinite(b[1])) continue;
        var kA = keyForXY(a[0], a[1]);
        var kB = keyForXY(b[0], b[1]);
        ensureNode(kA, a[0], a[1]);
        ensureNode(kB, b[0], b[1]);
        addEdge(kA, kB, planarDistanceMeters(a[0], a[1], b[0], b[1]));
      }
    });
  });

  keys.forEach(function (k) {
    var n = nodesByKey[k];
    if (!n || !n.count) return;
    n.x = n.xSum / n.count;
    n.y = n.ySum / n.count;
  });

  return { nodesByKey: nodesByKey, keys: keys };
}

function findNearestGraphNode(graph, point32643, maxSnapM) {
  if (!graph || !graph.keys || !graph.keys.length || !point32643) return null;
  var maxM = Number(maxSnapM) > 0 ? Number(maxSnapM) : 1200;
  var best = null;
  var bestD = Infinity;
  graph.keys.forEach(function (k) {
    var n = graph.nodesByKey[k];
    if (!n) return;
    var d = planarDistanceMeters(point32643.x, point32643.y, n.x, n.y);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  });
  if (!best || !isFinite(bestD) || bestD > maxM) return null;
  return { node: best, snapMeters: bestD };
}

function shortestPathRoadGraph(graph, startKey, endKey) {
  if (!graph || !startKey || !endKey || !graph.nodesByKey[startKey] || !graph.nodesByKey[endKey]) return null;
  if (startKey === endKey) {
    return { nodeKeys: [startKey], distanceM: 0 };
  }

  var keys = graph.keys || [];
  var dist = {};
  var prev = {};
  var visited = {};
  keys.forEach(function (k) { dist[k] = Infinity; });
  dist[startKey] = 0;

  while (true) {
    var cur = null;
    var bestD = Infinity;
    keys.forEach(function (k) {
      if (visited[k]) return;
      if (dist[k] < bestD) {
        bestD = dist[k];
        cur = k;
      }
    });
    if (!cur || !isFinite(bestD)) break;
    if (cur === endKey) break;
    visited[cur] = true;

    var edges = graph.nodesByKey[cur].edges || {};
    Object.keys(edges).forEach(function (nk) {
      if (visited[nk]) return;
      var alt = dist[cur] + Number(edges[nk] || Infinity);
      if (alt < dist[nk]) {
        dist[nk] = alt;
        prev[nk] = cur;
      }
    });
  }

  if (!isFinite(dist[endKey])) return null;
  var path = [];
  var walk = endKey;
  while (walk) {
    path.push(walk);
    if (walk === startKey) break;
    walk = prev[walk];
  }
  if (!path.length || path[path.length - 1] !== startKey) return null;
  path.reverse();
  return { nodeKeys: path, distanceM: dist[endKey] };
}

function compactPathCoords(pathCoords) {
  var out = [];
  (pathCoords || []).forEach(function (p) {
    if (!p || !isFinite(p[0]) || !isFinite(p[1])) return;
    if (!out.length) {
      out.push([p[0], p[1]]);
      return;
    }
    var q = out[out.length - 1];
    if (planarDistanceMeters(p[0], p[1], q[0], q[1]) > 0.2) out.push([p[0], p[1]]);
  });
  return out;
}

function buildRoutePinDataUrl(primaryHex, secondaryHex) {
  var svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='56' height='72' viewBox='0 0 56 72'>" +
    "<defs>" +
    "<linearGradient id='pinGrad' x1='0' y1='0' x2='0' y2='1'>" +
    "<stop offset='0%' stop-color='" + primaryHex + "'/>" +
    "<stop offset='100%' stop-color='" + secondaryHex + "'/>" +
    "</linearGradient>" +
    "<filter id='pinShadow' x='-50%' y='-50%' width='200%' height='200%'>" +
    "<feDropShadow dx='0' dy='2' stdDeviation='2' flood-color='rgba(0,0,0,0.35)'/>" +
    "</filter>" +
    "</defs>" +
    "<g filter='url(#pinShadow)'>" +
    "<path d='M28 3c-11.6 0-21 9.4-21 21c0 16.8 21 44.5 21 44.5S49 40.8 49 24C49 12.4 39.6 3 28 3z' fill='url(#pinGrad)' stroke='#ffffff' stroke-width='2'/>" +
    "<circle cx='28' cy='24' r='8.3' fill='#ffffff'/>" +
    "<circle cx='28' cy='24' r='4.3' fill='" + secondaryHex + "' fill-opacity='0.9'/>" +
    "</g>" +
    "</svg>";
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

var routeStartMarkerUrl = buildRoutePinDataUrl("#34d399", "#059669");
var routeEndMarkerUrl = buildRoutePinDataUrl("#fb7185", "#e11d48");

function addRouteEndpointMarkers(fromWgs, toWgs, fromLabel, toLabel, routeGeom) {
  if (!routeLineLayer || !fromWgs || !toWgs) return;

  function toWgsFromVertex(vertex, sr) {
    if (!vertex) return null;
    var x = Number(vertex[0] != null ? vertex[0] : vertex.x);
    var y = Number(vertex[1] != null ? vertex[1] : vertex.y);
    if (!isFinite(x) || !isFinite(y)) return null;
    var w = wkidValue(sr);
    if (w === 4326) {
      return isValidWgsLatLon(y, x) ? { lat: y, lon: x } : null;
    }
    try {
      var p = new Point({ x: x, y: y, spatialReference: sr || SR_WEB });
      var pWgs = projection.project(p, SR4326);
      if (pWgs && isValidWgsLatLon(Number(pWgs.y), Number(pWgs.x))) {
        return { lat: Number(pWgs.y), lon: Number(pWgs.x) };
      }
    } catch (e0) {}
    return null;
  }

  var startWgs = fromWgs;
  var endWgs = toWgs;
  try {
    if (routeGeom && routeGeom.type === "polyline" && routeGeom.paths && routeGeom.paths.length) {
      var firstPath = null;
      var lastPath = null;
      routeGeom.paths.forEach(function (p) {
        if (p && p.length) {
          if (!firstPath) firstPath = p;
          lastPath = p;
        }
      });
      if (firstPath && lastPath) {
        var routeStart = toWgsFromVertex(firstPath[0], routeGeom.spatialReference);
        var routeEnd = toWgsFromVertex(lastPath[lastPath.length - 1], routeGeom.spatialReference);
        if (routeStart) startWgs = routeStart;
        if (routeEnd) endWgs = routeEnd;
      }
    }
  } catch (e1) {}

  if (!isValidWgsLatLon(Number(startWgs.lat), Number(startWgs.lon))) return;
  if (!isValidWgsLatLon(Number(endWgs.lat), Number(endWgs.lon))) return;

  function pointGraphic(wgs, label, isStart) {
    return new Graphic({
      geometry: {
        type: "point",
        longitude: Number(wgs.lon),
        latitude: Number(wgs.lat),
        spatialReference: SR4326
      },
      symbol: {
        type: "picture-marker",
        url: isStart ? routeStartMarkerUrl : routeEndMarkerUrl,
        width: "28px",
        height: "36px",
        yoffset: "18px"
      },
      attributes: {
        routeEndpoint: isStart ? "start" : "end",
        label: label || (isStart ? "Start" : "Destination")
      },
      popupTemplate: {
        title: (label || (isStart ? "Start" : "Destination")) + (isStart ? " (Start)" : " (End)")
      }
    });
  }

  routeLineLayer.add(pointGraphic(startWgs, fromLabel, true));
  routeLineLayer.add(pointGraphic(endWgs, toLabel, false));
}

function drawOsrmFallbackRouteLine(fromWgs, toWgs, opts) {
  opts = opts || {};
  var fromLabel = opts.fromLabel || "Start";
  var toLabel = opts.toLabel || "Destination";
  var url =
    "https://router.project-osrm.org/route/v1/driving/" +
    encodeURIComponent(fromWgs.lon + "," + fromWgs.lat) + ";" +
    encodeURIComponent(toWgs.lon + "," + toWgs.lat) +
    "?overview=full&geometries=geojson&steps=true";

  return fetch(url).then(function (res) {
    if (!res || !res.ok) return null;
    return res.json();
  }).then(function (json) {
    if (!json || json.code !== "Ok" || !json.routes || !json.routes.length) return null;
    var route = json.routes[0];
    var coords = route.geometry && route.geometry.coordinates;
    if (!coords || coords.length < 2) return null;

    return projection.load().then(function () {
      var line4326 = new Polyline({
        paths: [coords.map(function (xy) { return [xy[0], xy[1]]; })],
        spatialReference: SR4326
      });
      var lineWeb = projection.project(line4326, SR_WEB);
      if (!lineWeb) return null;

      routeLineLayer.removeAll();
      routeLineLayer.add(new Graphic({
        geometry: lineWeb,
        symbol: new SimpleLineSymbol({ color: [230, 128, 36, 0.98], width: 3.5 })
      }));
      addRouteEndpointMarkers(fromWgs, toWgs, fromLabel, toLabel, lineWeb);

      var km = Number(route.distance || 0) / 1000;
      var mins = Math.max(1, Math.round(Number(route.duration || 0) / 60));
      var steps = [];
      try {
        var leg = route.legs && route.legs[0];
        if (leg && leg.steps && leg.steps.length) {
          leg.steps.slice(0, 40).forEach(function (s) {
            var man = (s && s.maneuver) || {};
            var n = String((s && s.name) || "").trim();
            var mType = String(man.type || "").trim();
            var mMod = String(man.modifier || "").trim();
            var txt = "";
            if (n) txt = "Take " + n;
            else if (mType || mMod) txt = "Continue " + [mType, mMod].filter(Boolean).join(" ");
            if (txt) steps.push(txt);
          });
        }
      } catch (e0) {}
      if (!steps.length) steps.push("Road-following route is shown on the map.");

      return view.goTo(lineWeb, { padding: getUiZoomPadding() }).catch(function () {}).then(function () {
        return {
          summary: "Approx route (via roads): " + km.toFixed(2) + " km - ~" + mins + " min",
          steps: [
            "ArcGIS driving route unavailable (API key/token missing).",
            "Showing road-following route from " + fromLabel + " to " + toLabel + "."
          ].concat(steps.slice(0, 15)),
          km: km,
          mins: mins
        };
      });
    });
  }).catch(function (e1) {
    console.warn("[routing] OSRM fallback failed", e1);
    return null;
  });
}

function drawRoadNetworkFallbackLine(fromWgs, toWgs, opts) {
  opts = opts || {};
  var fromLabel = opts.fromLabel || "Start";
  var toLabel = opts.toLabel || "Destination";
  var speedKmh = Number(opts.speedKmh) > 0 ? Number(opts.speedKmh) : 35;

  return projection.load().then(function () {
    var start4326 = new Point({ x: fromWgs.lon, y: fromWgs.lat, spatialReference: SR4326 });
    var end4326 = new Point({ x: toWgs.lon, y: toWgs.lat, spatialReference: SR4326 });
    var start32643 = projection.project(start4326, SR_METER);
    var end32643 = projection.project(end4326, SR_METER);
    if (!start32643 || !end32643) return null;

    var straightM = planarDistanceMeters(start32643.x, start32643.y, end32643.x, end32643.y);
    var padM = Math.max(800, Math.min(15000, straightM * 0.65));
    var ext = new Extent({
      xmin: Math.min(start32643.x, end32643.x) - padM,
      ymin: Math.min(start32643.y, end32643.y) - padM,
      xmax: Math.max(start32643.x, end32643.x) + padM,
      ymax: Math.max(start32643.y, end32643.y) + padM,
      spatialReference: SR_METER
    });

    return queryLayer(TRANS_MS, LAYER_ROADS_LINE, Object.assign({
      where: "1=1",
      returnGeometry: true,
      outFields: "OBJECTID",
      resultRecordCount: 1200
    }, geometryToQueryParams(ext))).then(function (data) {
      var roads = (data && data.features) || [];
      if (!roads.length) return null;

      var graph = buildRoadGraph(roads, 8);
      if (!graph.keys.length) return null;

      var maxSnapM = Math.max(900, Math.min(6000, straightM * 0.7));
      var startNode = findNearestGraphNode(graph, start32643, maxSnapM);
      var endNode = findNearestGraphNode(graph, end32643, maxSnapM);
      if (!startNode || !endNode) return null;

      var path = shortestPathRoadGraph(graph, startNode.node.key, endNode.node.key);
      if (!path || !path.nodeKeys || !path.nodeKeys.length) return null;

      var pathCoords = [[start32643.x, start32643.y]];
      path.nodeKeys.forEach(function (k) {
        var n = graph.nodesByKey[k];
        if (n) pathCoords.push([n.x, n.y]);
      });
      pathCoords.push([end32643.x, end32643.y]);
      pathCoords = compactPathCoords(pathCoords);
      if (pathCoords.length < 2) return null;

      var line32643 = new Polyline({ paths: [pathCoords], spatialReference: SR_METER });
      var lineWeb = projection.project(line32643, SR_WEB);
      if (!lineWeb) return null;

      routeLineLayer.removeAll();
      routeLineLayer.add(new Graphic({
        geometry: lineWeb,
        symbol: new SimpleLineSymbol({ color: [230, 128, 36, 0.98], width: 3 })
      }));
      addRouteEndpointMarkers(fromWgs, toWgs, fromLabel, toLabel, lineWeb);

      var routeM = path.distanceM + startNode.snapMeters + endNode.snapMeters;
      var km = routeM / 1000;
      var mins = Math.max(1, Math.round((km / speedKmh) * 60));
      return view.goTo(lineWeb, { padding: getUiZoomPadding() }).catch(function () {}).then(function () {
        return {
          summary: "Approx route (via roads): " + km.toFixed(2) + " km - ~" + mins + " min",
          steps: [
            "ArcGIS driving route unavailable (API key/token missing).",
            "Showing nearest available road-network path from " + fromLabel + " to " + toLabel + "."
          ],
          km: km,
          mins: mins
        };
      });
    }).catch(function (e0) {
      console.warn("[routing] roads fallback query/path failed", e0);
      return null;
    });
  }).catch(function (e1) {
    console.warn("[routing] roads fallback projection failed", e1);
    return null;
  });
}

function drawApproxRouteLine(fromWgs, toWgs, opts) {
  opts = opts || {};
  var fromLabel = opts.fromLabel || "Start";
  var toLabel = opts.toLabel || "Destination";
  var speedKmh = Number(opts.speedKmh) > 0 ? Number(opts.speedKmh) : 35;
  var dM = haversineMeters(fromWgs.lon, fromWgs.lat, toWgs.lon, toWgs.lat);
  var km = dM / 1000;
  var mins = Math.max(1, Math.round((km / speedKmh) * 60));

  routeLineLayer.removeAll();
  return projection.load().then(function () {
    var line4326 = new Polyline({
      paths: [[[fromWgs.lon, fromWgs.lat], [toWgs.lon, toWgs.lat]]],
      spatialReference: SR4326
    });
    var lineWeb = projection.project(line4326, SR_WEB);
    routeLineLayer.add(new Graphic({
      geometry: lineWeb,
      symbol: new SimpleLineSymbol({ color: [230, 128, 36, 0.95], width: 3, style: "short-dash" })
    }));
    addRouteEndpointMarkers(fromWgs, toWgs, fromLabel, toLabel, lineWeb);
    return view.goTo(lineWeb, { padding: getUiZoomPadding() });
  }).catch(function (e1) {
    console.warn("[routing] fallback line draw/zoom issue", e1);
  }).then(function () {
    return {
      summary: "Approx route (straight line): " + km.toFixed(2) + " km - ~" + mins + " min",
      steps: [
        "ArcGIS driving route needs an API key/token.",
        "Showing straight-line approximation from " + fromLabel + " to " + toLabel + "."
      ],
      km: km,
      mins: mins
    };
  });
}

function drawBestAvailableFallbackRoute(fromWgs, toWgs, opts) {
  return drawOsrmFallbackRouteLine(fromWgs, toWgs, opts).then(function (osrmRes) {
    if (osrmRes) return osrmRes;
    return drawRoadNetworkFallbackLine(fromWgs, toWgs, opts);
  }).then(function (roadRes) {
    if (roadRes) return roadRes;
    return drawApproxRouteLine(fromWgs, toWgs, opts);
  }).catch(function () {
    return drawApproxRouteLine(fromWgs, toWgs, opts);
  });
}

function resolveWgsFrom32643Geometry(geom) {
  if (!geom) return Promise.resolve(null);
  var g32643 = toEngineSR(ensureSR32643(geom));
  if (!g32643) return Promise.resolve(null);
  var ctr = getGeometryCentroid(g32643);
  var anch = ctr || (g32643.type === "point" ? g32643 : null);
  if (!anch) return Promise.resolve(null);
  return projection.load().then(function () {
    var anch32643 = toEngineSR(ensureSR32643(anch));
    var wgs = anch32643 ? projection.project(anch32643, SR4326) : null;
    if (!wgs || !isValidWgsLatLon(Number(wgs.y), Number(wgs.x))) return null;
    return { lat: Number(wgs.y), lon: Number(wgs.x) };
  }).catch(function () {
    return null;
  });
}

function resolveCurrentLocationForRoute() {
  return coerceLocationToWgs(lastCurrentLocationWgs).then(function (wgs) {
    if (wgs) {
      lastCurrentLocationWgs = wgs;
      return wgs;
    }
    var g = currentLocationGraphic && currentLocationGraphic.geometry;
    if (!g) return null;
    return projection.load().then(function () {
      if (g.type === "point" && isValidWgsLatLon(Number(g.y), Number(g.x))) {
        return { lat: Number(g.y), lon: Number(g.x) };
      }
      var p = g.type === "point" ? g : null;
      var pWgs = p ? projection.project(p, SR4326) : null;
      if (!pWgs || !isValidWgsLatLon(Number(pWgs.y), Number(pWgs.x))) return null;
      return { lat: Number(pWgs.y), lon: Number(pWgs.x) };
    }).then(function (v) {
      if (v) lastCurrentLocationWgs = v;
      return v || null;
    }).catch(function () {
      return null;
    });
  });
}

function fetchBrowserCurrentLocationWgsForRoute() {
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise(function (resolve) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = Number(pos && pos.coords && pos.coords.latitude);
      var lon = Number(pos && pos.coords && pos.coords.longitude);
      if (!isValidWgsLatLon(lat, lon)) {
        resolve(null);
        return;
      }
      lastCurrentLocationWgs = { lat: lat, lon: lon };
      try {
        if (view && !view.destroyed) {
          if (currentLocationGraphic) view.graphics.remove(currentLocationGraphic);
          currentLocationGraphic = new Graphic({
            geometry: {
              type: "point",
              longitude: lon,
              latitude: lat,
              spatialReference: { wkid: 4326 }
            },
            symbol: {
              type: "simple-marker",
              style: "circle",
              size: 11,
              color: [0, 122, 255, 0.95],
              outline: { color: [255, 255, 255, 0.95], width: 1.5 }
            },
            attributes: { label: "Current Location" }
          });
          view.graphics.add(currentLocationGraphic);
        }
      } catch (e0) {}
      resolve(lastCurrentLocationWgs);
    }, function () {
      resolve(null);
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  });
}

function buildAoiSelectionQueryForRoute() {
  var dCode = districtSelect && districtSelect.value ? String(districtSelect.value).trim() : "";
  var tCode = tehsilSelect && tehsilSelect.value ? String(tehsilSelect.value).trim() : "";
  var vCode = villageSelect && villageSelect.value ? String(villageSelect.value).trim() : "";
  if (!dCode) return null;

  var layerId = LAYER_DISTRICT;
  var where = "n_d_code = " + sqlQuote(dCode);
  if (vCode && tCode) {
    layerId = LAYER_VILLAGE;
    where += " AND n_t_code = " + sqlQuote(tCode) + " AND n_v_code = " + sqlQuote(vCode);
  } else if (tCode) {
    layerId = LAYER_TEHSIL;
    where += " AND n_t_code = " + sqlQuote(tCode);
  }
  return { layerId: layerId, where: where };
}

function queryAdminExtentCenterWgsForRoute(layerId, where) {
  if (layerId == null || !where) return Promise.resolve(null);
  var fl = new FeatureLayer({ url: ADMIN_MS + "/" + layerId });
  var q = fl.createQuery();
  q.where = where;
  q.returnGeometry = false;
  q.outSpatialReference = SR_METER;
  return fl.load().then(function () {
    return fl.queryExtent(q);
  }).then(function (res) {
    var ext = res && res.extent;
    if (!ext || !isFinite(ext.xmin) || !isFinite(ext.xmax)) return null;
    var ctr = ext.center;
    if (!ctr) return null;
    return projection.load().then(function () {
      var ctrWgs = projection.project(ctr, SR4326);
      if (!ctrWgs || !isValidWgsLatLon(Number(ctrWgs.y), Number(ctrWgs.x))) return null;
      return { lat: Number(ctrWgs.y), lon: Number(ctrWgs.x) };
    }).catch(function () {
      return null;
    });
  }).catch(function () {
    return null;
  });
}

function resolveAoiLocationForRoute() {
  return coerceLocationToWgs(lastAoiLocationWgs).then(function (wgs) {
    if (wgs) {
      lastAoiLocationWgs = wgs;
      return wgs;
    }

    var fromSelectedGeom = selectedVillageGeom || selectedTehsilGeom || selectedDistrictGeom;
    var selectedTry = fromSelectedGeom ? resolveWgsFrom32643Geometry(fromSelectedGeom) : Promise.resolve(null);
    return selectedTry.then(function (w0) {
      if (w0) return w0;
      var q = buildAoiSelectionQueryForRoute();
      if (!q) return null;
      return queryAdministrativeGeometryForZoom(q.layerId, q.where, "OBJECTID").then(function (res) {
        var g32643 = res && res.geometry;
        if (g32643) {
          return resolveWgsFrom32643Geometry(g32643).then(function (w1) {
            if (w1) return w1;
            return queryAdminExtentCenterWgsForRoute(q.layerId, q.where);
          });
        }
        return queryAdminExtentCenterWgsForRoute(q.layerId, q.where);
      }).catch(function () {
        return queryAdminExtentCenterWgsForRoute(q.layerId, q.where);
      });
    });
  }).then(function (wgsFinal) {
    if (wgsFinal) {
      lastAoiLocationWgs = wgsFinal;
      return wgsFinal;
    }
    return projection.load().then(function () {
      var c = view && view.center ? view.center : null;
      if (!c) return null;
      var cWgs = projection.project(c, SR4326);
      if (!cWgs || !isValidWgsLatLon(Number(cWgs.y), Number(cWgs.x))) return null;
      var fb = { lat: Number(cWgs.y), lon: Number(cWgs.x) };
      lastAoiLocationWgs = fb;
      return fb;
    }).catch(function () {
      return null;
    });
  });
}

function ensureCurrentLocationForRoute() {
  return resolveCurrentLocationForRoute().then(function (wgs) {
    if (wgs) return wgs;
    setStatus("Fetching current location for routing...");
    return fetchBrowserCurrentLocationWgsForRoute();
  }).then(function (wgsFinal) {
    if (wgsFinal) lastCurrentLocationWgs = wgsFinal;
    return wgsFinal || null;
  });
}

function ensureAoiLocationForRoute() {
  return resolveAoiLocationForRoute().then(function (wgs) {
    if (wgs) return wgs;
    return runNavigate().catch(function () {
      return null;
    }).then(function () {
      return resolveAoiLocationForRoute();
    });
  }).then(function (wgsFinal) {
    if (wgsFinal) lastAoiLocationWgs = wgsFinal;
    return wgsFinal || null;
  });
}

function routeFromCurrentLocationToAoi() {
  openAoiRoutePanel();
  renderAoiRoutePanel("Preparing route...", []);

  Promise.all([
    ensureCurrentLocationForRoute(),
    ensureAoiLocationForRoute()
  ]).then(function (resolved) {
    var resolvedCurrent = resolved[0];
    var resolvedAoi = resolved[1];
    if (!resolvedCurrent || !resolvedAoi) {
      var preMsg = !resolvedCurrent && !resolvedAoi
        ? "Current location and AOI both are missing. Set location and click Apply & zoom."
        : (!resolvedCurrent
          ? "Current location not found. Allow location permission and try Route again."
          : "AOI location not found from current selection. Change selection or click Apply & zoom, then Route.");
      renderAoiRoutePanel(preMsg, [], true);
      setStatus(preMsg);
      return;
    }
    return Promise.all([
      coerceLocationToWgs(resolvedCurrent),
      coerceLocationToWgs(resolvedAoi)
    ]);
  }).then(function (pair) {
    if (!pair) return;
    var fromWgs = pair[0];
    var toWgs = pair[1];
    if (!fromWgs || !toWgs) {
      var badLocMsg = "Route points invalid. Click current location and Apply & zoom again.";
      renderAoiRoutePanel(badLocMsg, [], true);
      setStatus(badLocMsg);
      return;
    }

    lastCurrentLocationWgs = fromWgs;
    lastAoiLocationWgs = toWgs;

    var solveUrl = getEsriRouteSolveUrl();
    var destLabel = getSelectedAoiLabel();
    var fromTxt = fromWgs.lat.toFixed(6) + ", " + fromWgs.lon.toFixed(6);
    var toTxt = toWgs.lat.toFixed(6) + ", " + toWgs.lon.toFixed(6);

    if (!hasArcGisRoutingApiKey() && routeServiceNeedsApiKey(solveUrl)) {
      setStatus("ArcGIS API key not configured - showing approximate route.");
      renderAoiRoutePanel("ArcGIS route key missing. Showing approximate route to " + destLabel + "...", []);
      drawBestAvailableFallbackRoute(fromWgs, toWgs, {
        fromLabel: "Current Location",
        toLabel: destLabel
      }).then(function (approx) {
        var panelSummary = approx.summary + "\nFrom: " + fromTxt + "\nTo: " + destLabel + " (" + toTxt + ")";
        renderAoiRoutePanel(panelSummary, approx.steps, false);
        var el0 = document.getElementById("cadResults");
        if (el0) el0.textContent = panelSummary + "\n\n" + approx.steps.join("\n");
      });
      return;
    }

    var p0 = new Point({
      x: fromWgs.lon,
      y: fromWgs.lat,
      spatialReference: SR4326
    });

    var p1 = new Point({
      x: toWgs.lon,
      y: toWgs.lat,
      spatialReference: SR4326
    });

    var fs = new FeatureSet({
      features: [
        new Graphic({ geometry: p0, attributes: { Name: "Current Location" } }),
        new Graphic({ geometry: p1, attributes: { Name: "Selected AOI" } })
      ]
    });

    var rparams = new RouteParameters({
      stops: fs,
      returnDirections: true,
      directionsLengthUnits: "esriKilometers",
      returnRoutes: true
    });

    if (esriConfig.apiKey) rparams.apiKey = esriConfig.apiKey;

    routeLineLayer.removeAll();
    setStatus("Computing driving route from current location to AOI...");
    renderAoiRoutePanel("Computing best road route to " + destLabel + "...", []);

    solve(solveUrl, rparams, { apiKey: esriConfig.apiKey }).then(function (res) {
      var rr = res.routeResults && res.routeResults[0];
      var routeFeat = rr && rr.route;
      var altFeat = null;
      var geom = routeFeat && (routeFeat.geometry || routeFeat);

      if (!geom || !geom.type) {
        altFeat = res.routes && res.routes.features && res.routes.features[0];
        geom = altFeat && altFeat.geometry;
      }

      if (!geom) {
        var noRouteMsg = "Esri route returned no line.";
        renderAoiRoutePanel(noRouteMsg, [], true);
        setStatus(noRouteMsg);
        return;
      }

      return projection.load().then(function () {
        var gLine = geom.spatialReference && geom.spatialReference.wkid === 3857
          ? geom
          : projection.project(geom, SR_WEB);

        routeLineLayer.add(new Graphic({
          geometry: gLine,
          symbol: new SimpleLineSymbol({ color: [0, 92, 230, 1], width: 4 })
        }));
        addRouteEndpointMarkers(fromWgs, toWgs, "Current Location", destLabel, gLine);

        return view.goTo(gLine, { padding: getUiZoomPadding() });
      }).then(function () {
        var attrs = (routeFeat && routeFeat.attributes) || (altFeat && altFeat.attributes) || {};
        var km = attrs.Total_Kilometers != null ? attrs.Total_Kilometers : attrs.Shape_Length;
        var mins = attrs.Total_Minutes;
        var lines = [];

        if (rr && rr.directions && rr.directions.features) {
          rr.directions.features.slice(0, 30).forEach(function (df) {
            var a = df.attributes || {};
            var tx = a.text || a.Text || a.narrative || "";
            if (tx) lines.push(tx);
          });
        }

        var msg =
          "Driving route: " +
          (km != null ? Number(km).toFixed(2) + " km" : "") +
          (mins != null ? " - ~" + Math.round(mins) + " min" : "");
        var panelSummary = msg + "\nFrom: " + fromTxt + "\nTo: " + destLabel + " (" + toTxt + ")";
        if (!lines.length) lines.push("Route line is shown on the map.");

        setStatus(msg);
        renderAoiRoutePanel(panelSummary, lines);

        var el = document.getElementById("cadResults");
        if (el) el.textContent = msg + (lines.length ? "\n\n" + lines.join("\n") : "");
      });
    }).catch(function (err) {
      console.error(err);
      if (isRoutingAuthError(err)) {
        setStatus("ArcGIS route authorization failed - showing approximate route.");
        drawBestAvailableFallbackRoute(fromWgs, toWgs, {
          fromLabel: "Current Location",
          toLabel: destLabel
        }).then(function (approx) {
          var panelSummary = approx.summary + "\nFrom: " + fromTxt + "\nTo: " + destLabel + " (" + toTxt + ")";
          renderAoiRoutePanel(panelSummary, approx.steps, false);
          var el0 = document.getElementById("cadResults");
          if (el0) el0.textContent = panelSummary + "\n\n" + approx.steps.join("\n");
        });
        return;
      }
      var routeFailMsg = isGateway502Error(err)
        ? "Routing failed: ArcGIS route service/proxy unreachable (502)."
        : "Routing failed - ArcGIS route service error.";
      renderAoiRoutePanel(routeFailMsg, [], true);
      setStatus(routeFailMsg);
    });
  });
}

function getSelectedAoiLabel() {
  function getText(id) {
    var el = document.getElementById(id);
    if (!el || !el.options || el.selectedIndex < 0) return "";
    var txt = String((el.options[el.selectedIndex] && el.options[el.selectedIndex].text) || "").trim();
    return txt;
  }
  var v = getText("villageSelect");
  var t = getText("tehsilSelect");
  var d = getText("districtSelect");
  return v || t || d || "Selected AOI";
}

function openAoiRoutePanel() {
  var panel = document.getElementById("aoiRoutePanel");
  if (panel) panel.classList.add("open");
}

function closeAoiRoutePanel() {
  var panel = document.getElementById("aoiRoutePanel");
  if (panel) panel.classList.remove("open");
}

function renderAoiRoutePanel(summary, steps, isError) {
  var panel = document.getElementById("aoiRoutePanel");
  var sumEl = document.getElementById("aoiRouteSummary");
  var stepsEl = document.getElementById("aoiRouteSteps");
  if (!panel || !sumEl || !stepsEl) return;

  panel.classList.toggle("is-error", !!isError);
  sumEl.textContent = summary || "";
  stepsEl.innerHTML = "";
  (steps || []).forEach(function (line) {
    if (!line) return;
    var li = document.createElement("li");
    li.textContent = line;
    stepsEl.appendChild(li);
  });
}
/** Last spatial analysis tool run (buffer, proximity, etc.). */
var lastAnalysisReportSnapshot = null;
function publishAnalysisReportSnapshot(payload) {
  lastAnalysisReportSnapshot = payload;
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("msme-analysis-report-snapshot"));
    }
  } catch (e0) {}
}

function publishAnalysisToolResult(toolId, summary, extra) {
  var p = {
    generatedAt: new Date().toISOString(),
    reportKind: "analysis",
    tool: toolId,
    summary: summary
  };
  if (extra && typeof extra === "object") {
    Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
  }
  publishAnalysisReportSnapshot(p);
}

/** @deprecated Use getters per report type; returns map selection only for backward compatibility. */
window.msmeGisGetLandReportSnapshot = function () {
  return lastMapSelectionReportSnapshot;
};
window.msmeGisGetAoiLandReportSnapshot = function () {
  return lastAoiLandReportSnapshot;
};
window.msmeGisGetMapSelectionReportSnapshot = function () {
  return lastMapSelectionReportSnapshot;
};
window.msmeGisGetAnalysisReportSnapshot = function () {
  return lastAnalysisReportSnapshot;
};

/** Multi-click map identify session (map-click only). */
var mapSelectionAccumulateMode = false;
var mapIdentifyClickSessions = [];
/** When set, buffer / proximity / etc. use this geometry (union of map picks). Cleared on full clear. */
var userMapAnalysisGeometry32643 = null;

function publishInvestorSnapshot(p32643, source) {
  if (!p32643) return;
  return projection.load().then(function () {
    var wgs = projection.project(p32643, SR4326);
    var radiusM = 3000;
    try {
      var elR = document.getElementById("cadNearM");
      if (elR) radiusM = parseInt(elR.value, 10) || 3000;
    } catch (e1) {}
    publishAoiLandReportSnapshot({
      generatedAt: new Date().toISOString(),
      reportKind: "aoi",
      lat: wgs.y,
      lon: wgs.x,
      radiusM: radiusM,
      atClickRows: [],
      nearbyRows: [],
      domContext: readLandReportDomContext(),
      selectionSource: source || "admin-aoi"
    });
  });
}

/**
 * Approximate zoom when MapServer omits geometry: same district centre [lon,lat], tighter scale for
 * district ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ tehsil ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ village ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ muraba ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ khasra (finer each step).
 */
function zoomGoToApproxSelection(dCode, mode) {
  var k = normalizeDistrictCodeKey(dCode);
  var ll = HR_DISTRICT_LONLAT[k];
  if (!ll) {
    console.warn("[zoom] no fallback centre for district code", k);
    return Promise.resolve();
  }
  /* Denominator must be small enough for cadastral group (often ~1:5k on server) to draw parcels/muraba. */
  var scales = {
    district: 400000,
    tehsil: 115000,
    village: 35000,
    muraba: 20000,
    khasra: 10000
  };
  var scale = scales[mode] || scales.district;
  return view.when().then(function () {
    return projection.load();
  }).then(function () {
    var pt = jsonUtils.fromJSON({
      type: "point",
      x: ll[0],
      y: ll[1],
      spatialReference: { wkid: 4326 }
    });
    var ptw = projection.project(pt, SR_WEB);
    return view.goTo({ target: ptw, scale: scale, padding: getUiZoomPadding() });
  }).catch(function (e) {
    console.warn("[zoom] approximate goTo failed", e);
    return Promise.resolve();
  });
}

esriConfig.request.trustedServers.push("https://hsacggm.in");

/**
 * Populated at startup from MapServer ?f=json (all point / multipoint layers) + lines + polygons below.
 * @type {Array<{url:string,layerId:number,label:string}>}
 */
var nearbyDistanceLayers = mergeNearbyLayerLists([]);

var resultsLayer = new GraphicsLayer({ title: "Analysis", listMode: "hide" });
var identifyLayer = new GraphicsLayer({ title: "Identify", listMode: "hide" });
var cadParcelLayer = new GraphicsLayer({ title: "Cadastral parcel highlight", listMode: "hide" });
var cadNearbyLayer = new GraphicsLayer({ title: "Cadastral nearby", listMode: "hide" });
var bufferMarkLayer = new GraphicsLayer({ title: "Buffer anchor", listMode: "hide" });
var routeLineLayer = new GraphicsLayer({ title: "Esri route", listMode: "hide" });
var sketchLayer = new GraphicsLayer({ title: "Sketch selection", listMode: "hide" });
var selectionHighlightLayer = new GraphicsLayer({ title: "Highlighted selection", listMode: "hide" });
var connectorLayer = new GraphicsLayer({ title: "Distance connector", listMode: "hide" });
var adminLayer = new MapImageLayer({ url: ADMIN_MS, title: "Administrative boundaries" });
var baseRefLayer = new MapImageLayer({ url: BASE_MS, title: "Base & reference", opacity: 0.65, visible: false });
var transLayer = new MapImageLayer({ url: TRANS_MS, title: "Transportation", visible: false });
var envLayer = new MapImageLayer({ url: ENV_MS, title: "Environmental", visible: false });
var invLayer = new MapImageLayer({ url: INV_MS, title: "Investment zones", visible: false });
var socialLayer = new MapImageLayer({ url: SOC_MS, title: "Social infrastructure", visible: false });
var utilLayer = new MapImageLayer({ url: UTIL_MS, title: "Utilities", visible: false });
var cadLayer = new MapImageLayer({ url: CAD_MS, title: "Cadastral", visible: false });
var conLayer = new MapImageLayer({ url: CON_MS, title: "Constituencies", visible: false });
var cadSelectionLayer = null;
var optionalOperationalLayers = [baseRefLayer, envLayer, invLayer, socialLayer, transLayer, utilLayer, cadLayer, conLayer];
var optionalOperationalLayersPromise = null;

var map = new Map({
  basemap: "gray-vector",
  layers: [adminLayer, bufferMarkLayer, cadParcelLayer, cadNearbyLayer, routeLineLayer, connectorLayer, selectionHighlightLayer, sketchLayer, resultsLayer, identifyLayer]
});

var view = new MapView({
  container: "viewDiv",
  map: map,
  spatialReference: SR_WEB,
  constraints: { snapToZoom: false },
  background: { color: "#ffffff" }
});

var layerList = new LayerList({
  view: view,
  container: "layerListContainer"
});
var legend = new Legend({ view: view, container: "legendInner", basemapLegendVisible: true });

view.ui.add(new Home({ view: view }), "top-right");
view.ui.move("zoom", "bottom-right");
view.ui.add(new ScaleBar({ view: view, unit: "metric", style: "line" }), "bottom-left");

var basemapGallery = new BasemapGallery({ view: view });
var bgExpand = new Expand({
  view: view,
  content: basemapGallery,
  expandIconClass: "esri-icon-basemap",
  group: "top-right",
  expandTooltip: "Basemap",
  collapseTooltip: "Close"
});
view.ui.add(bgExpand, "top-right");

function mapHasLayer(layer) {
  return !!(map && map.layers && map.layers.includes(layer));
}

function addOperationalLayerToMap(layer) {
  if (!layer || mapHasLayer(layer)) return;
  if (layer === baseRefLayer) {
    var adminIndex = map.layers.indexOf(adminLayer);
    map.add(layer, adminIndex >= 0 ? adminIndex : 0);
    return;
  }
  var overlayIndex = map.layers.indexOf(bufferMarkLayer);
  map.add(layer, overlayIndex >= 0 ? overlayIndex : map.layers.length);
}

function ensureOptionalOperationalLayers() {
  if (optionalOperationalLayersPromise) return optionalOperationalLayersPromise;
  optionalOperationalLayersPromise = Promise.resolve().then(function () {
    var chain = Promise.resolve();
    optionalOperationalLayers.forEach(function (layer) {
      chain = chain.then(function () {
        if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return null;
        addOperationalLayerToMap(layer);
        return layer.load().catch(function (err) {
          console.warn("[layer bootstrap]", layer && layer.title, err);
          return null;
        });
      });
    });
    return chain;
  }).catch(function (err) {
    optionalOperationalLayersPromise = null;
    throw err;
  });
  return optionalOperationalLayersPromise;
}

function getInitialMapExtent() {
  var adminExtent = adminLayer && adminLayer.fullExtent ? adminLayer.fullExtent : null;
  if (adminExtent) {
    try {
      return projection.project(adminExtent, SR_WEB) || projection.project(defaultStudyExtent32643, SR_WEB);
    } catch (e0) {
      console.warn("[extent] admin full extent projection failed", e0);
    }
  }
  return projection.project(defaultStudyExtent32643, SR_WEB);
}

function setStatus(msg) {
  var el = document.getElementById("status");
  if (el) el.textContent = msg || "";
  console.log("[status]", msg);
}

function isGateway502Error(err) {
  if (!err) return false;
  try {
    var d = err.details || {};
    if (Number(d.httpStatus) === 502 || Number(d.status) === 502) return true;
  } catch (e0) {}
  var m = String((err && err.message) || "");
  return m.indexOf("status: 502") >= 0 || m.indexOf("status 502") >= 0;
}

function alertNoData(ctx) {
  var m = "No results" + (ctx ? ": " + ctx : "") + ".";
  window.alert(m);
  setStatus(m);
}

/** Cadastral district polygon layer id by district name (from service layer names e.g. Hisar_06). */
var cadDistrictNameToLayerId = {};

function buildCadastralLayerIndex() {
  return requestArcGisJson(CAD_MS + "?f=json", { responseType: "json" }).then(function (res) {
    var layers = (res.data && res.data.layers) || [];
    layers.forEach(function (ly) {
      if (ly.parentLayerId !== 0 || ly.type !== "Feature Layer" || ly.geometryType !== "esriGeometryPolygon") return;
      var m = ly.name.match(/^(.+)_(\d+)$/);
      if (!m) return;
      var base = m[1].replace(/_/g, " ").trim();
      cadDistrictNameToLayerId[base.toLowerCase()] = ly.id;
      cadDistrictNameToLayerId[m[1].toLowerCase()] = ly.id;
      cadDistrictNameToLayerId[normalizeDistrictKey(base)] = ly.id;
      cadDistrictNameToLayerId[normalizeDistrictKey(m[1])] = ly.id;
    });
    console.log("[cadastral] district layer index", cadDistrictNameToLayerId);
  }).catch(function (e) {
    console.warn("[cadastral] could not build district layer index", e);
  });
}

function getCadastralLayerIdForDistrictName(dName) {
  if (!dName) return null;
  var k = String(dName).trim().toLowerCase();
  if (cadDistrictNameToLayerId[k] != null) return cadDistrictNameToLayerId[k];
  var simple = normalizeDistrictKey(dName);
  if (cadDistrictNameToLayerId[simple] != null) return cadDistrictNameToLayerId[simple];
  var noUnderscore = simple.replace(/_/g, " ");
  if (cadDistrictNameToLayerId[noUnderscore] != null) return cadDistrictNameToLayerId[noUnderscore];
  return null;
}

function fixAdminScales() {
  return adminLayer.when(function () {
    adminLayer.minScale = 0;
    adminLayer.maxScale = 0;
    adminLayer.allSublayers.forEach(function (sl) {
      sl.minScale = 0;
      sl.maxScale = 0;
    });
  });
}

function fixCadastralScales() {
  return cadLayer.when(function () {
    cadLayer.minScale = 0;
    cadLayer.maxScale = 0;
    cadLayer.allSublayers.forEach(function (sl) {
      sl.minScale = 0;
      sl.maxScale = 0;
    });
  });
}

/** Cadastral MapImageLayer is off by default; turn on when using cad dropdowns so muraba/khasra draw. */
function ensureCadastralMapVisible() {
  addOperationalLayerToMap(cadLayer);
  return cadLayer.when(function () {
    cadLayer.visible = true;
  }).then(function () {
    return fixCadastralScales();
  });
}

function clearCadSelectionLayer() {
  if (cadSelectionLayer && map && map.layers && map.layers.includes(cadSelectionLayer)) {
    map.remove(cadSelectionLayer);
  }
  cadSelectionLayer = null;
}

function showCadSelectionLayer(lid, where) {
  if (lid == null || !where) return Promise.resolve(null);
  clearCadSelectionLayer();
  cadSelectionLayer = new FeatureLayer({
    url: CAD_MS + "/" + lid,
    definitionExpression: where,
    outFields: ["*"],
    popupEnabled: false,
    minScale: 0,
    maxScale: 0,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [255, 235, 59, 0.18],
        outline: {
          type: "simple-line",
          color: [245, 124, 0, 1],
          width: 2.5
        }
      }
    }
  });
  map.add(cadSelectionLayer);
  return cadSelectionLayer.load().then(function () {
    var q = cadSelectionLayer.createQuery();
    q.where = where;
    q.outSpatialReference = view.spatialReference;
    return cadSelectionLayer.queryExtent(q).then(function (res) {
      return res && res.extent ? res.extent : null;
    });
  }).catch(function (err) {
    console.warn("[cad] selection FeatureLayer failed", err);
    clearCadSelectionLayer();
    return null;
  });
}

function mapImageLayerForCadNearUrl(url) {
  if (url === TRANS_MS) return transLayer;
  if (url === INV_MS) return invLayer;
  if (url === SOC_MS) return socialLayer;
  if (url === UTIL_MS) return utilLayer;
  return null;
}

/** Match ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œNearbyÃƒÂ¢Ã¢â€šÂ¬Ã‚Â checkboxes to MapServer sublayer visibility so features show as soon as they are checked. */
function syncCadNearInfrastructureVisibility() {
  var urls = [TRANS_MS, INV_MS, SOC_MS, UTIL_MS];
  urls.forEach(function (u) {
    var mil = mapImageLayerForCadNearUrl(u);
    if (!mil) return;
    if (!mapHasLayer(mil)) return;
    mil.when(function () {
      POI_LAYERS.filter(function (p) { return p.url === u; }).forEach(function (p) {
        var c = document.querySelector(".cad-near-cb[data-url=\"" + p.url + "\"][data-layer=\"" + p.layerId + "\"]");
        var sl = mil.findSublayerById(p.layerId);
        if (sl && c) sl.visible = c.checked;
      });
      if (u === SOC_MS) {
        var cs = document.querySelector(".cad-near-cb[data-url=\"" + SOC_MS + "\"][data-layer=\"0\"]");
        socialLayer.visible = !!(cs && cs.checked);
      }
    });
  });
}

function resolveCadNearbySearchGeometry32643() {
  function toUsable32643(g) {
    if (!g || !geometryIsUsable(g)) return null;
    try {
      return toEngineSR(ensureSR32643(g)) || ensureSR32643(g);
    } catch (e0) {
      return g;
    }
  }

  var dSel = cadDistrictSelect && cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
  var tSel = cadTehsilSelect && cadTehsilSelect.value ? String(cadTehsilSelect.value).trim() : "";
  var vSel = cadVillageSelect && cadVillageSelect.value ? String(cadVillageSelect.value).trim() : "";
  var murSel = cadMurabaSelect && cadMurabaSelect.value ? String(cadMurabaSelect.value).trim() : "";
  var khaSel = cadKhasraSelect && cadKhasraSelect.value ? String(cadKhasraSelect.value).trim() : "";

  var districtFallback = function () {
    if (!dSel) {
      return Promise.resolve(lastCadParcel32643 ? toUsable32643(lastCadParcel32643) : null);
    }
    return queryAdminGeometryForCadZoom(dSel, tSel, vSel).then(function (gAdm) {
      return toUsable32643(gAdm) || (lastCadParcel32643 ? toUsable32643(lastCadParcel32643) : null);
    }).catch(function () {
      return lastCadParcel32643 ? toUsable32643(lastCadParcel32643) : null;
    });
  };

  if (dSel && tSel && vSel && murSel && khaSel) {
    return queryCadParcelGeometry().then(function (res) {
      var g = res && res.feature && res.feature.geometry ? geomFromJSON(res.feature.geometry) : null;
      var parcel = toUsable32643(g);
      if (parcel) return parcel;
      return queryCadMurabaExtentGeometry(dSel, tSel, vSel, murSel).then(function (gMur) {
        return toUsable32643(gMur);
      }).catch(function () {
        return null;
      }).then(function (murGeom) {
        if (murGeom) return murGeom;
        return districtFallback();
      });
    }).catch(function () {
      return districtFallback();
    });
  }

  if (dSel && tSel && vSel && murSel) {
    return queryCadMurabaExtentGeometry(dSel, tSel, vSel, murSel).then(function (gMur) {
      var murGeom = toUsable32643(gMur);
      if (murGeom) return murGeom;
      return districtFallback();
    }).catch(function () {
      return districtFallback();
    });
  }

  return districtFallback();
}

var cadNearAutoTimer = null;

function runCadNearbyDistances(opts) {
  opts = opts || {};
  cadNearbyLayer.removeAll();
  var checks = Array.prototype.slice.call(document.querySelectorAll(".cad-near-cb")).filter(function (c) { return c.checked; });
  if (!checks.length) {
    if (!opts.silentNoParcel) {
      setStatus("Select at least one feature class.");
    }
    return;
  }

  var rad = parseInt(document.getElementById("cadNearM").value, 10) || 2000;
  rad = Math.max(200, Math.min(10000, rad));

  projection.load().catch(function () { return null; }).then(function () {
    return resolveCadNearbySearchGeometry32643();
  }).then(function (parcel) {
    if (!parcel) {
      if (!opts.silentNoParcel) {
        setStatus("Select District, Tehsil, Village, Muraba (and optional Khasra), then click Features near me.");
        var cr0 = document.getElementById("cadResults");
        if (cr0) cr0.textContent = "AOI / parcel not ready. Select cadastral values first.";
      }
      return;
    }

    var parcelLinear = null;
    try {
      parcelLinear = toEngineSR(ensureSR32643(parcel)) || parcel;
    } catch (eP0) {
      parcelLinear = parcel;
    }
    if (!parcelLinear || !geometryIsUsable(parcelLinear)) {
      setStatus("Nearby query failed: parcel geometry is not usable.");
      return;
    }

    lastCadParcel32643 = parcelLinear;

    var distanceGeom = parcelLinear;
    var usedCenterFallback = false;
    var usedEnvelopeFallback = false;

    function tryBuffer(gIn) {
      if (!gIn || !geometryIsUsable(gIn)) return null;
      var g = gIn;
      try {
        g = toEngineSR(ensureSR32643(gIn)) || gIn;
      } catch (e0) {
        g = gIn;
      }
      var sr = g.spatialReference || null;
      var wk = wkidValue(sr);
      var isGeographic = !!(sr && (sr.isGeographic === true || wk === 4326 || wk === 4269));
      try {
        return isGeographic
          ? geometryEngine.geodesicBuffer(g, rad, "meters")
          : geometryEngine.buffer(g, rad, "meters");
      } catch (e1) {
        return null;
      }
    }

    var buf = tryBuffer(distanceGeom);
    if (!buf && (distanceGeom.type === "polygon" || distanceGeom.type === "polyline")) {
      try {
        var simp = geometryEngine.simplify(distanceGeom);
        if (simp && geometryIsUsable(simp)) {
          distanceGeom = simp;
          buf = tryBuffer(distanceGeom);
        }
      } catch (eS0) {}
    }
    if (!buf) {
      var ctr0 = null;
      try {
        ctr0 = getGeometryCentroid(distanceGeom);
      } catch (eC0) {}
      if (!ctr0 && distanceGeom.extent && distanceGeom.extent.center) ctr0 = distanceGeom.extent.center;
      if (!ctr0 && parcelLinear && parcelLinear.extent && parcelLinear.extent.center) ctr0 = parcelLinear.extent.center;
      if (ctr0) {
        try {
          coerceMissingSpatialReference(ctr0, distanceGeom.spatialReference || parcelLinear.spatialReference || SR_METER);
          ctr0 = toEngineSR(ensureSR32643(ctr0)) || ctr0;
        } catch (eC1) {}
        if (ctr0 && ctr0.type === "point" && isFinite(ctr0.x) && isFinite(ctr0.y)) {
          usedCenterFallback = true;
          distanceGeom = ctr0;
          buf = tryBuffer(distanceGeom);
          if (!buf) {
            try {
              buf = new Extent({
                xmin: ctr0.x - rad,
                ymin: ctr0.y - rad,
                xmax: ctr0.x + rad,
                ymax: ctr0.y + rad,
                spatialReference: ctr0.spatialReference || SR_METER
              });
              usedEnvelopeFallback = true;
            } catch (eE0) {}
          }
        }
      }
    }
    if (!buf) {
      console.warn("[cad nearby] buffer failed after fallback", parcelLinear);
    }
    if (!buf) {
      setStatus("Nearby query failed: buffer could not be created.");
      var crFail = document.getElementById("cadResults");
      if (crFail) {
        crFail.textContent = "Buffer create failed for selected geometry. Try another Muraba/Khasra or click Apply/Show once.";
      }
      return;
    }

    try {
      buf = toEngineSR(ensureSR32643(buf)) || buf;
    } catch (eBProj) {}
    var bufWeb = projection.project(buf, SR_WEB) || buf;
    if (bufWeb && geometryIsUsable(bufWeb)) {
      cadNearbyLayer.add(new Graphic({
        geometry: bufWeb,
        symbol: symCadNearBuffer,
        attributes: { type: "cad-near-buffer", radiusM: rad }
      }));
    }

    var qp = geometryToQueryParams(buf);
    if (!qp || !qp.geometry) {
      setStatus("Nearby query failed: unable to prepare buffer geometry.");
      return;
    }

    var tasks = checks.map(function (c) {
      return queryLayer(c.getAttribute("data-url"), parseInt(c.getAttribute("data-layer"), 10), Object.assign({
        where: "1=1",
        returnGeometry: true,
        outFields: "OBJECTID",
        resultRecordCount: 400
      }, qp)).catch(function () { return { features: [] }; });
    });

    var lines = [];
    var parcelCtr = null;
    if (distanceGeom.type === "point") {
      parcelCtr = distanceGeom;
    } else if (distanceGeom.extent && distanceGeom.extent.center) {
      parcelCtr = distanceGeom.extent.center;
    }
    if (!parcelCtr) {
      try { parcelCtr = getGeometryCentroid(distanceGeom); } catch (e) { parcelCtr = null; }
    }
    if (parcelCtr) {
      var pcW = projection.project(ensureSR32643(parcelCtr), SR4326) || parcelCtr;
      lastCadCenterWgs = { lat: pcW.y, lon: pcW.x };
    }

    return Promise.all(tasks).then(function (all) {
      var bestD = Infinity;
      var bestPt = null;
      var linearDistanceFailures = 0;

      all.forEach(function (data, idx) {
        var label = (checks[idx].parentElement && checks[idx].parentElement.textContent)
          ? checks[idx].parentElement.textContent.replace(/\s+/g, " ").trim()
          : "Layer";

        (data.features || []).forEach(function (f) {
          var raw = geomFromJSON(f.geometry);
          if (!raw || !geometryIsUsable(raw)) return;

          coerceMissingSpatialReference(raw, distanceGeom.spatialReference || SR_METER);

          var fg = null;
          try {
            fg = toEngineSR(raw) || raw;
          } catch (eG0) {
            fg = raw;
          }
          if (!fg || !geometryIsUsable(fg)) return;

          var dM = null;
          try {
            dM = geometryEngine.distance(distanceGeom, fg, "meters");
          } catch (eD0) {
            linearDistanceFailures++;
            dM = null;
          }

          if (dM == null || !isFinite(dM)) {
            dM = geodesicDistanceMetersFallback(distanceGeom, fg);
          }

          var dLabel = (dM != null && isFinite(dM)) ? ("~" + Math.round(dM) + " m") : "n/a";
          lines.push(label.substring(0, 36) + ": " + dLabel);

          if (dM != null && isFinite(dM) && dM < bestD) {
            bestD = dM;
            var c2 = fg.extent && fg.extent.center ? fg.extent.center : null;
            if (!c2) {
              try { c2 = getGeometryCentroid(fg); } catch (e2) {}
            }
            if (c2) bestPt = c2;
          }

          var sym = fg.type === "point" ? symPoint : (fg.type === "polyline" ? symLineHit : symVillage);
          var fgWeb = projection.project(fg, SR_WEB) || fg;
          cadNearbyLayer.add(new Graphic({
            geometry: fgWeb,
            symbol: sym,
            attributes: f.attributes || {}
          }));
        });
      });

      if (bestPt) {
        var bw = projection.project(ensureSR32643(bestPt), SR4326) || bestPt;
        lastNearestPoiWgs = { lat: bw.y, lon: bw.x };
      }

      var summary = lines.length
        ? ("Distances (min straight-line, m):\n" +
            lines.slice(0, 80).join("\n") +
            (lines.length > 80 ? "\n..." : ""))
        : "No selected feature found inside " + rad + " m buffer.";
      document.getElementById("cadResults").textContent =
        summary +
        "\n\nBuffer: " + rad + " m - showing intersecting features on map." +
        (usedCenterFallback ? "\nDistance source: AOI center fallback (parcel geometry was not buffer-safe)." : "") +
        (usedEnvelopeFallback ? "\nQuery shape: meter-envelope fallback." : "");

      setStatus(
        (lines.length ? "Nearby features loaded." : "Nearby search complete: no feature in buffer.") +
          (linearDistanceFailures ? " Some distances used fallback." : "")
      );
    });
  }).catch(function (e) {
    console.error(e);
    setStatus("Nearby query failed.");
  });
}
function scheduleCadNearbyAutoRun() {
  clearTimeout(cadNearAutoTimer);
  cadNearAutoTimer = setTimeout(function () {
    syncCadNearInfrastructureVisibility();
    var dSel = cadDistrictSelect && cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
    var tSel = cadTehsilSelect && cadTehsilSelect.value ? String(cadTehsilSelect.value).trim() : "";
    var vSel = cadVillageSelect && cadVillageSelect.value ? String(cadVillageSelect.value).trim() : "";
    var murSel = cadMurabaSelect && cadMurabaSelect.value ? String(cadMurabaSelect.value).trim() : "";
    if (!dSel || !tSel || !vSel || !murSel) {
      return;
    }
    runCadNearbyDistances({ silentNoParcel: true });
  }, 400);
}

/** Left padding when layers, AOI, spatial analysis, or map selection side panel is open. */
function getUiZoomPadding() {
  var rail = 48;
  var pw = 320;
  var tools = document.getElementById("toolsPanel");
  var aoi = document.getElementById("aoiPanel");
  var spatial = document.getElementById("spatialPanel");
  var sel = document.getElementById("selectToolsPanel");
  var left = rail + 12;
  if (tools && !tools.classList.contains("collapsed")) left = rail + pw + 16;
  else if (aoi && !aoi.classList.contains("collapsed")) left = rail + pw + 16;
  else if (spatial && !spatial.classList.contains("collapsed")) left = rail + pw + 16;
  else if (sel && !sel.classList.contains("collapsed")) left = rail + pw + 16;
  return { top: 76, bottom: 56, left: left, right: 44 };
}

/** Extra left inset (px) for the identify results flyout so the scale bar / map frame clear overlays. */
var __msmeResultsFlyoutLeftInset = 0;

function refreshMapViewPadding() {
  if (!view) return;
  var p = getUiZoomPadding();
  view.padding = {
    top: p.top,
    bottom: p.bottom,
    left: p.left + __msmeResultsFlyoutLeftInset,
    right: p.right
  };
}

/**
 * After side panels open/close, the map container size changes. MapView has no resize() in 4.30;
 * DOMContainer provides forceDOMReadyCycle() to remeasure. Fallback for older API copies.
 */
var __msmeLastLayoutNotifyMs = 0;
function notifyViewLayoutChanged() {
  if (!view) return;
  try {
    if (view.destroyed) return;
  } catch (e0) {
    return;
  }
  var now = Date.now();
  if (now - __msmeLastLayoutNotifyMs < 220) return;
  __msmeLastLayoutNotifyMs = now;

  // forceDOMReadyCycle can feel like a map reload on frequent sidebar clicks.
  // Use lightweight refresh; MapView already tracks container size in modern versions.
  if (typeof view.requestRender === "function") {
    view.requestRender();
    return;
  }
  if (typeof view.resize === "function") view.resize();
}

window.msmeGisSetResultsFlyoutInset = function (leftPx) {
  __msmeResultsFlyoutLeftInset = typeof leftPx === "number" && leftPx > 0 ? Math.round(leftPx) : 0;
  refreshMapViewPadding();
};

function zoomPadding() {
  return getUiZoomPadding();
}

function extentLooksEmpty(ext) {
  if (!ext || !isFinite(ext.xmin) || !isFinite(ext.xmax)) return true;
  return ext.width === 0 && ext.height === 0;
}

/**
 * Zoom to a geometry: normalize SR, project whole geometry to Web Mercator, then goTo(extent).
 * Projecting the full geometry (not only geom.extent in UTM) avoids bad extent / projection edge cases.
 */
function zoomToGeometry(geom, opts) {
  if (!geom) return Promise.resolve();
  opts = opts || {};
  normalizeSpatialReference(geom);
  var wIn = wkidValue(geom.spatialReference);
  if (!isWebMercatorWkid(wIn)) {
    ensureSR32643(geom);
  }
  return view.when().then(function () {
    return projection.load();
  }).then(function () {
    function goCenterFromGeom(gIn, zoomLvl) {
      var gWork = gIn;
      if (!isWebMercatorWkid(wkidValue(gWork.spatialReference))) {
        gWork = projection.project(ensureSR32643(gIn), SR_WEB) || gIn;
      }
      var ext0 = gWork.type === "extent" ? gWork : gWork.extent;
      var cWeb = null;
      if (gWork.type === "point") {
        cWeb = gWork;
      } else if (ext0 && ext0.center) {
        cWeb = ext0.center;
      } else {
        try {
          var c0 = getGeometryCentroid(ensureSR32643(gIn));
          if (c0) cWeb = projection.project(c0, SR_WEB);
        } catch (e1) { console.warn("[zoom] centroid", e1); }
      }
      if (!cWeb) return Promise.resolve();
      return view.goTo({ center: cWeb, zoom: zoomLvl || 12 }).catch(function (e2) {
        console.warn("[zoom] center goTo failed", e2);
        return Promise.resolve();
      });
    }
    var geomWeb = geom;
    if (!isWebMercatorWkid(wkidValue(geom.spatialReference))) {
      geomWeb = projection.project(geom, SR_WEB);
    }
    if (!geomWeb) {
      console.warn("[zoom] project geometry to Web Mercator failed");
      return goCenterFromGeom(geom, 11);
    }
    var ext = geomWeb.type === "extent" ? geomWeb : geomWeb.extent;
    if (extentLooksEmpty(ext)) {
      if (geom.type === "point" || geom.type === "multipoint") {
        return goCenterFromGeom(geom, 14);
      }
      console.warn("[zoom] empty extent, centroid fallback", geom && geom.type);
      return goCenterFromGeom(geom, 11);
    }
    var expandFactor = opts.expandFactor != null ? opts.expandFactor : 1.25;
    var minScale = opts.minScale != null ? opts.minScale : null;
    var expanded = typeof ext.expand === "function" ? ext.expand(expandFactor) : ext;
    var goExtent = function (e, pad) {
      if (pad) {
        return view.goTo(e, { padding: getUiZoomPadding() });
      }
      return view.goTo(e);
    };
    function clampMinScaleIfNeeded() {
      if (!minScale || !isFinite(minScale) || !view || !isFinite(view.scale) || view.scale >= minScale) {
        return Promise.resolve();
      }
      var center = expanded && expanded.center ? expanded.center : null;
      if (!center) return Promise.resolve();
      return view.goTo({ center: center, scale: minScale }).catch(function (e3) {
        console.warn("[zoom] minScale clamp failed", e3);
        return Promise.resolve();
      });
    }
    return goExtent(expanded, true).then(function () {
      return clampMinScaleIfNeeded();
    }).catch(function (err) {
      console.warn("[zoom] goTo extent+padding failed", err);
      return goExtent(expanded, false).then(function () {
        return clampMinScaleIfNeeded();
      }).catch(function (err2) {
        console.warn("[zoom] goTo extent failed", err2);
        if (expanded.center) {
          return view.goTo({ center: expanded.center, scale: Math.min(view.scale || 50000, 50000) });
        }
        return goCenterFromGeom(geom, 11);
      });
    });
  });
}

var selectedDistrictGeom = null;
var selectedTehsilGeom = null;
var selectedVillageGeom = null;
var districtSelect = document.getElementById("districtSelect");
var tehsilSelect = document.getElementById("tehsilSelect");
var villageSelect = document.getElementById("villageSelect");
var cadTehsilSelect = document.getElementById("cadTehsilSelect");
var cadVillageSelect = document.getElementById("cadVillageSelect");
var cadMurabaSelect = document.getElementById("cadMurabaSelect");
var cadKhasraSelect = document.getElementById("cadKhasraSelect");
var lastCadParcel32643 = null;

/** Avoid throwing on missing nodes ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â a single throw aborts all later wiring (rail, analysis, identify). */
function msmeBind(id, evt, handler) {
  var el = document.getElementById(id);
  if (!el) {
    console.warn("[GIS] Missing #" + id + " ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â skipping " + evt + " handler.");
    return false;
  }
  el.addEventListener(evt, handler);
  return true;
}
/** Last zoom target from cadastral hierarchy (districtÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢tehsilÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢villageÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢muraba) for analysis extent. */
var lastCadHierarchyGeom32643 = null;

refreshGisPlaceholderLabelsImpl = function () {
  var rows = [
    ["districtSelect", "district"],
    ["cadDistrictSelect", "district"],
    ["hsvpDistrictSelect", "district"],
    ["cadTehsilSelect", "tehsil"],
    ["cadVillageSelect", "village"],
    ["cadMurabaSelect", "muraba"],
    ["cadKhasraSelect", "cadKhasraPlaceholder"],
    ["hsvpPlotSelect", "hsvpPlot"]
  ];
  rows.forEach(function (row) {
    var el = document.getElementById(row[0]);
    if (!el || !el.options || el.options.length < 1) return;
    var opt0 = el.options[0];
    if (opt0 && String(opt0.value) === "") {
      opt0.textContent = gisPh(row[1]);
    }
  });
};
var lastCadCenterWgs = null;
var lastNearestPoiWgs = null;
var bufferMarkModeActive = false;
var bufferMarkPoint32643 = null;
var lastIdentifyAnchor32643 = null;

var symCadParcel = new SimpleFillSymbol({
  color: [255, 235, 59, 0.35],
  outline: new SimpleLineSymbol({ color: [245, 124, 0, 1], width: 2 })
});

function activeQueryGeometry() {
  if (bufferMarkPoint32643) {
    var rEl = document.getElementById("bufMarkQueryRadius");
    var rM = rEl ? parseInt(rEl.value, 10) : 5000;
    if (!isFinite(rM) || rM < 200) rM = 5000;
    var buf = geometryEngine.buffer(bufferMarkPoint32643, rM, "meters");
    return buf ? ensureSR32643(buf) : view.extent;
  }
  if (userMapAnalysisGeometry32643 && geometryIsUsable(userMapAnalysisGeometry32643)) {
    return userMapAnalysisGeometry32643;
  }
  if (lastCadParcel32643 && geometryIsUsable(lastCadParcel32643)) {
    return lastCadParcel32643;
  }
  if (lastCadHierarchyGeom32643 && geometryIsUsable(lastCadHierarchyGeom32643)) {
    return lastCadHierarchyGeom32643;
  }
  if (selectedVillageGeom) return selectedVillageGeom;
  if (selectedTehsilGeom) return selectedTehsilGeom;
  if (selectedDistrictGeom) return selectedDistrictGeom;
  return view.extent;
}

function setAdminFilters(dCode, tCode, vCode) {
  return adminLayer.when(function () {
    var d1 = adminLayer.findSublayerById(LAYER_DISTRICT);
    var d3 = adminLayer.findSublayerById(LAYER_TEHSIL);
    var d4 = adminLayer.findSublayerById(LAYER_VILLAGE);
    if (!dCode) {
      if (d1) d1.definitionExpression = "1=1";
      if (d3) d3.definitionExpression = "1=1";
      if (d4) d4.definitionExpression = "1=1";
      return;
    }
    if (d1) d1.definitionExpression = "n_d_code = " + sqlQuote(dCode);
    if (d3) d3.definitionExpression = tCode ? "n_d_code = " + sqlQuote(dCode) + " AND n_t_code = " + sqlQuote(tCode) : "n_d_code = " + sqlQuote(dCode);
    if (d4) {
      if (vCode && tCode) d4.definitionExpression = "n_d_code = " + sqlQuote(dCode) + " AND n_t_code = " + sqlQuote(tCode) + " AND n_v_code = " + sqlQuote(vCode);
      else if (tCode) d4.definitionExpression = "n_d_code = " + sqlQuote(dCode) + " AND n_t_code = " + sqlQuote(tCode);
      else d4.definitionExpression = "n_d_code = " + sqlQuote(dCode);
    }
  });
}

function resetTehsilVillage() {
  if (!tehsilSelect || !villageSelect) return;
  tehsilSelect.innerHTML = "<option value=\"\">" + gisPh("tehsil") + "</option>";
  villageSelect.innerHTML = "<option value=\"\">" + gisPh("village") + "</option>";
  tehsilSelect.disabled = true;
  villageSelect.disabled = true;
}

var cadDistrictSelect = document.getElementById("cadDistrictSelect");

function loadDistricts() {
  if (!districtSelect || !cadDistrictSelect) {
    console.warn("[GIS] loadDistricts: administrative/cadastral district selects missing.");
    return Promise.resolve();
  }
  return queryLayer(ADMIN_MS, LAYER_DISTRICT, {
    where: "1=1", outFields: "n_d_code,n_d_name", returnGeometry: false, orderByFields: "n_d_name"
  }).then(function (data) {
    districtSelect.innerHTML = "<option value=\"\">" + gisPh("district") + "</option>";
    cadDistrictSelect.innerHTML = "<option value=\"\">" + gisPh("district") + "</option>";
    var hsvpD0 = document.getElementById("hsvpDistrictSelect");
    if (hsvpD0) hsvpD0.innerHTML = "<option value=\"\">" + gisPh("district") + "</option>";
    (data.features || []).forEach(function (f) {
      var a = f.attributes;
      var o = document.createElement("option");
      o.value = a.n_d_code;
      o.textContent = a.n_d_name || a.n_d_code;
      districtSelect.appendChild(o);
      var o2 = document.createElement("option");
      o2.value = a.n_d_code;
      o2.textContent = a.n_d_name || a.n_d_code;
      o2.setAttribute("data-dname", (a.n_d_name || "").trim());
      cadDistrictSelect.appendChild(o2);
      var hsvpD = document.getElementById("hsvpDistrictSelect");
      if (hsvpD) {
        var o3 = document.createElement("option");
        o3.value = a.n_d_code;
        o3.textContent = a.n_d_name || a.n_d_code;
        hsvpD.appendChild(o3);
      }
    });
  });
}

function loadTehsils(d) {
  resetTehsilVillage();
  if (!tehsilSelect) return Promise.resolve();
  if (!d) return Promise.resolve();
  return queryLayer(ADMIN_MS, LAYER_TEHSIL, {
    where: "n_d_code = " + sqlQuote(d), outFields: "n_t_code,n_t_name", returnGeometry: false, orderByFields: "n_t_name", resultRecordCount: 2000
  }).then(function (data) {
    var seen = {};
    tehsilSelect.innerHTML = "<option value=\"\">" + gisPh("allTehsils") + "</option>";
    (data.features || []).forEach(function (f) {
      var c = f.attributes.n_t_code;
      if (!c || seen[c]) return;
      seen[c] = true;
      var o = document.createElement("option");
      o.value = c;
      o.textContent = f.attributes.n_t_name || c;
      tehsilSelect.appendChild(o);
    });
    tehsilSelect.disabled = false;
  });
}

function loadVillages(d, t) {
  if (!villageSelect) return Promise.resolve();
  villageSelect.innerHTML = "<option value=\"\">" + gisPh("village") + "</option>";
  villageSelect.disabled = true;
  if (!d || !t) return Promise.resolve();
  return queryLayer(ADMIN_MS, LAYER_VILLAGE, {
    where: "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t),
    outFields: "n_v_code,n_v_name", returnGeometry: false, orderByFields: "n_v_name", resultRecordCount: 2000
  }).then(function (data) {
    villageSelect.innerHTML = "<option value=\"\">" + gisPh("allVillages") + "</option>";
    (data.features || []).forEach(function (f) {
      var o = document.createElement("option");
      o.value = f.attributes.n_v_code;
      o.textContent = f.attributes.n_v_name || f.attributes.n_v_code;
      villageSelect.appendChild(o);
    });
    villageSelect.disabled = false;
  });
}

if (districtSelect && tehsilSelect && villageSelect) {
  function zoomFromAdministrativeSelectionOnChange() {
    return runNavigate().catch(function (err) {
      console.error("[admin selection zoom]", err);
      setStatus("Administrative boundary zoom failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
    });
  }

  districtSelect.addEventListener("change", function () {
    var raw = districtSelect.value;
    var d = raw ? String(raw).trim() : "";
    selectedDistrictGeom = null;
    selectedTehsilGeom = null;
    selectedVillageGeom = null;
    loadTehsils(d);
    if (!d) {
      zoomFromAdministrativeSelectionOnChange();
      return;
    }
    zoomFromAdministrativeSelectionOnChange();
  });
  tehsilSelect.addEventListener("change", function () {
    selectedTehsilGeom = null;
    var d = districtSelect.value ? String(districtSelect.value).trim() : "";
    var t = tehsilSelect.value || "";
    loadVillages(d, t).then(function () {
      if (d) return zoomFromAdministrativeSelectionOnChange();
      return Promise.resolve();
    }).catch(function (err) {
      console.error("[tehsil change]", err);
      if (d) return zoomFromAdministrativeSelectionOnChange();
      return Promise.resolve();
    });
  });
  villageSelect.addEventListener("change", function () {
    selectedVillageGeom = null;
    var d = districtSelect.value ? String(districtSelect.value).trim() : "";
    if (d) zoomFromAdministrativeSelectionOnChange();
  });
} else {
  console.error("[GIS] Administrative AOI selects (#districtSelect / #tehsilSelect / #villageSelect) missing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â AOI tab disabled.");
}

function resetCadBelowTehsil() {
  cadVillageSelect.innerHTML = "<option value=\"\">" + gisPh("village") + "</option>";
  cadVillageSelect.disabled = true;
  cadMurabaSelect.innerHTML = "<option value=\"\">" + gisPh("muraba") + "</option>";
  cadMurabaSelect.disabled = true;
  cadKhasraSelect.innerHTML = "<option value=\"\">" + gisPh("cadKhasraPlaceholder") + "</option>";
  cadKhasraSelect.disabled = true;
}

function loadCadTehsils(d) {
  resetCadBelowTehsil();
  if (!d) return Promise.resolve();
  return queryLayer(ADMIN_MS, LAYER_TEHSIL, {
    where: "n_d_code = " + sqlQuote(d),
    outFields: "n_t_code,n_t_name",
    returnGeometry: false,
    orderByFields: "n_t_name",
    resultRecordCount: 2000
  }).then(function (data) {
    var seen = {};
    cadTehsilSelect.innerHTML = "<option value=\"\">" + gisPh("tehsil") + "</option>";
    (data.features || []).forEach(function (f) {
      var c = f.attributes.n_t_code;
      if (!c || seen[c]) return;
      seen[c] = true;
      var o = document.createElement("option");
      o.value = c;
      o.textContent = f.attributes.n_t_name || c;
      cadTehsilSelect.appendChild(o);
    });
    cadTehsilSelect.disabled = false;
  });
}

function loadCadVillages(d, t) {
  cadMurabaSelect.innerHTML = "<option value=\"\">" + gisPh("muraba") + "</option>";
  cadMurabaSelect.disabled = true;
  cadKhasraSelect.innerHTML = "<option value=\"\">" + gisPh("cadKhasraPlaceholder") + "</option>";
  cadKhasraSelect.disabled = true;
  if (!d || !t) return Promise.resolve();
  return queryLayer(ADMIN_MS, LAYER_VILLAGE, {
    where: "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t),
    outFields: "n_v_code,n_v_name",
    returnGeometry: false,
    orderByFields: "n_v_name",
    resultRecordCount: 2000
  }).then(function (data) {
    cadVillageSelect.innerHTML = "<option value=\"\">" + gisPh("village") + "</option>";
    (data.features || []).forEach(function (f) {
      var o = document.createElement("option");
      o.value = f.attributes.n_v_code;
      o.textContent = f.attributes.n_v_name || f.attributes.n_v_code;
      cadVillageSelect.appendChild(o);
    });
    cadVillageSelect.disabled = false;
  });
}

function loadCadMurabaList() {
  var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
  var t = cadTehsilSelect.value || "";
  var v = cadVillageSelect.value || "";
  cadKhasraSelect.innerHTML = "<option value=\"\">" + gisPh("cadKhasraPlaceholder") + "</option>";
  cadKhasraSelect.disabled = true;
  cadMurabaSelect.innerHTML = "<option value=\"\">" + gisPh("muraba") + "</option>";
  cadMurabaSelect.disabled = true;
  if (!d || !t || !v) return Promise.resolve();
  var opt = cadDistrictSelect.options[cadDistrictSelect.selectedIndex];
  var dName = (opt && opt.getAttribute("data-dname")) || opt.text || "";
  var lid = getCadastralLayerIdForDistrictName(dName);
  if (lid == null) {
    setStatus("Cadastral map has no polygon layer for ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ" + dName + "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â.");
    return Promise.resolve();
  }
  var w = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) + " AND n_murr_no IS NOT NULL";
  return queryLayer(CAD_MS, lid, {
    where: w,
    outFields: "n_murr_no",
    returnGeometry: false,
    returnDistinctValues: true,
    resultRecordCount: 2000
  }).then(function (data) {
    var seen = {};
    cadMurabaSelect.innerHTML = "<option value=\"\">" + gisPh("muraba") + "</option>";
    (data.features || []).forEach(function (f) {
      var m = f.attributes.n_murr_no;
      if (m == null || m === "" || seen[m]) return;
      seen[m] = true;
      var o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      cadMurabaSelect.appendChild(o);
    });
    cadMurabaSelect.disabled = cadMurabaSelect.options.length <= 1;
  }).catch(function () {
    return queryLayer(CAD_MS, lid, {
      where: w,
      outFields: "n_murr_no",
      returnGeometry: false,
      resultRecordCount: 2000
    }).then(function (data2) {
      var seen = {};
      cadMurabaSelect.innerHTML = "<option value=\"\">" + gisPh("muraba") + "</option>";
      (data2.features || []).forEach(function (f) {
        var m = f.attributes.n_murr_no;
        if (m == null || m === "" || seen[m]) return;
        seen[m] = true;
        var o = document.createElement("option");
        o.value = m;
        o.textContent = m;
        cadMurabaSelect.appendChild(o);
      });
      cadMurabaSelect.disabled = cadMurabaSelect.options.length <= 1;
    });
  });
}

function loadCadKhasraList() {
  var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
  var t = cadTehsilSelect.value || "";
  var v = cadVillageSelect.value || "";
  var mur = cadMurabaSelect.value || "";
  cadKhasraSelect.innerHTML = "<option value=\"\">" + gisPh("cadKhasraPlaceholder") + "</option>";
  cadKhasraSelect.disabled = true;
  if (!d || !t || !v || !mur) return Promise.resolve();
  var opt = cadDistrictSelect.options[cadDistrictSelect.selectedIndex];
  var dName = (opt && opt.getAttribute("data-dname")) || opt.text || "";
  var lid = getCadastralLayerIdForDistrictName(dName);
  if (lid == null) return Promise.resolve();
  var w = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) +
    " AND n_murr_no = " + sqlQuote(mur) + " AND n_khas_no IS NOT NULL";
  return queryLayer(CAD_MS, lid, {
    where: w,
    outFields: "n_khas_no",
    returnGeometry: false,
    returnDistinctValues: true,
    resultRecordCount: 2000
  }).then(function (data) {
    var seen = {};
    cadKhasraSelect.innerHTML = "<option value=\"\">" + gisPh("cadKhasraPlaceholder") + "</option>";
    (data.features || []).forEach(function (f) {
      var k = f.attributes.n_khas_no;
      if (k == null || k === "" || seen[k]) return;
      seen[k] = true;
      var o = document.createElement("option");
      o.value = k;
      o.textContent = k;
      cadKhasraSelect.appendChild(o);
    });
    cadKhasraSelect.disabled = cadKhasraSelect.options.length <= 1;
  }).catch(function () {
    return queryLayer(CAD_MS, lid, {
      where: w,
      outFields: "n_khas_no",
      returnGeometry: false,
      resultRecordCount: 2000
    }).then(function (data2) {
      var seen = {};
      cadKhasraSelect.innerHTML = "<option value=\"\">" + gisPh("cadKhasraPlaceholder") + "</option>";
      (data2.features || []).forEach(function (f) {
        var k = f.attributes.n_khas_no;
        if (k == null || k === "" || seen[k]) return;
        seen[k] = true;
        var o = document.createElement("option");
        o.value = k;
        o.textContent = k;
        cadKhasraSelect.appendChild(o);
      });
      cadKhasraSelect.disabled = cadKhasraSelect.options.length <= 1;
    });
  });
}

function zoomCadDistrictFromServer(d) {
  var where = "n_d_code = " + sqlQuote(d);
  return zoomToAdminFeatureExtent(view, LAYER_DISTRICT, where, getUiZoomPadding(), 1000).then(function (extentZoomed) {
    return queryAdminGeometryForCadZoom(d, "", "").then(function (geom) {
      if (geom && geometryIsUsable(geom)) {
        lastCadHierarchyGeom32643 = geom;
        if (extentZoomed) return true;
        return zoomToGeometry(geom);
      }
      lastCadHierarchyGeom32643 = null;
      if (extentZoomed) return true;
      return zoomGoToApproxSelection(d, "district");
    });
  }).catch(function (err) {
    console.warn("[zoomCadDistrictFromServer]", err);
    lastCadHierarchyGeom32643 = null;
    return zoomGoToApproxSelection(d, "district");
  });
}
function zoomCadTehsilFromServer(d, t) {
  var where = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t);
  return zoomToAdminFeatureExtent(view, LAYER_TEHSIL, where, getUiZoomPadding(), 1000).then(function (extentZoomed) {
    return queryAdminGeometryForCadZoom(d, t, "").then(function (geom) {
      if (geom && geometryIsUsable(geom)) {
        lastCadHierarchyGeom32643 = geom;
        if (extentZoomed) return true;
        return zoomToGeometry(geom);
      }
      if (extentZoomed) return true;
      return zoomGoToApproxSelection(d, "tehsil");
    });
  }).catch(function (err) {
    console.warn("[zoomCadTehsilFromServer]", err);
    return zoomGoToApproxSelection(d, "tehsil");
  });
}
function zoomCadVillageFromServer(d, t, v) {
  var where = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v);
  return zoomToAdminFeatureExtent(view, LAYER_VILLAGE, where, getUiZoomPadding(), 1000).then(function (extentZoomed) {
    return queryAdminGeometryForCadZoom(d, t, v).then(function (geom) {
      if (geom && geometryIsUsable(geom)) {
        lastCadHierarchyGeom32643 = geom;
        if (extentZoomed) return true;
        return zoomToGeometry(geom);
      }
      if (extentZoomed) return true;
      return zoomGoToApproxSelection(d, "village");
    });
  }).catch(function (err) {
    console.warn("[zoomCadVillageFromServer]", err);
    return zoomGoToApproxSelection(d, "village");
  });
}


//scale contrl muraba
function fixGeometrySR(g) {
  if (!g) return null;

  var x = g.x || (g.extent && g.extent.xmin);
  var y = g.y || (g.extent && g.extent.ymin);

  if (x == null || y == null) return null;

  // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Already WebMercator (CORRECT CASE)
  if (Math.abs(x) > 1000000 && Math.abs(y) > 1000000) {
    g.spatialReference = { wkid: 3857 };
  }

  // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ UTM (Haryana)
  else if (x > 100000 && x < 900000 && y > 2000000 && y < 4000000) {
    g.spatialReference = { wkid: 32643 };
  }

  // ÃƒÂ¢Ã‚ÂÃ…â€™ Unknown ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ skip (IMPORTANT)
  else {
    console.warn("Unknown SR, skipping geometry", x, y);
    return null;
  }

  return g;
}
//end scale control muraba

function zoomCadMurabaFromServer(d, t, v, mur) {

  return queryCadMurabaViewGeometries(d, t, v, mur)
    .then(function (viewGeoms) {

      if (!viewGeoms || viewGeoms.length === 0) {
        throw "No muraba geometry";
      }

      return projection.load().then(function () {

        var unionExt = null;

        viewGeoms.forEach(function (item) {

          var g = item.geometry;
          if (!g) return;

          // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ FORCE CORRECT SR
          g = fixGeometrySR(g);

          // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ PROJECT TO MAP SR (3857)
          var gWeb;
          try {
            gWeb = projection.project(g, view.spatialReference);
          } catch (e) {
            console.warn("projection failed", e);
            return;
          }

          if (!gWeb || !gWeb.extent) return;

          var ext = gWeb.extent;

          // ÃƒÂ°Ã…Â¸Ã…Â¡Ã‚Â¨ SAFETY CHECK (avoid 10,000 km zoom)
          var width = ext.xmax - ext.xmin;
          var height = ext.ymax - ext.ymin;

          if (width > 5000 || height > 5000) {
            console.warn("Skipping invalid extent", width, height);
            return;
          }

          if (!unionExt) {
            unionExt = ext.clone ? ext.clone() : ext;
          } else if (typeof unionExt.union === "function") {
            unionExt = unionExt.union(ext);
          }
        });

        if (!unionExt) {
          throw "Extent invalid";
        }

        // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ FINAL ZOOM (perfect muraba fit)
        return view.goTo({
          target: unionExt.expand(1.2),
          padding: getUiZoomPadding()
        });

      });

    })
    .catch(function (err) {

      console.warn("[muraba zoom fallback]", err);

      // fallback ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ village
      return queryAdminGeometryForCadZoom(d, t, v).then(function (g2) {
        if (g2 && geometryIsUsable(g2)) {
          return zoomToGeometry(g2);
        }

        return zoomGoToApproxSelection(d, "muraba");
      });

    });
}

//end zoom to scale

if (cadDistrictSelect && cadTehsilSelect && cadVillageSelect && cadMurabaSelect && cadKhasraSelect) {
  cadDistrictSelect.addEventListener("change", function () {
    var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
    lastCadHierarchyGeom32643 = null;
    loadCadTehsils(d).then(function () {
      if (d) {
        ensureCadastralMapVisible().then(function () {
          return zoomCadDistrictFromServer(d);
        }).catch(function (err) {
          console.warn("[cad zoom district]", err);
          return zoomGoToApproxSelection(d, "district");
        }).then(function () {
          setStatus("Zoomed to district (cadastral). Continue tehsil to khasra to narrow.");
        });
      }
    });
  });
  cadTehsilSelect.addEventListener("change", function () {
    var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
    var t = cadTehsilSelect.value || "";
    loadCadVillages(cadDistrictSelect.value, cadTehsilSelect.value).then(function () {
      if (d && t) {
        ensureCadastralMapVisible().then(function () {
          return zoomCadTehsilFromServer(d, t);
        }).catch(function (err) {
          console.warn("[cad zoom tehsil]", err);
          return zoomGoToApproxSelection(d, "tehsil");
        }).then(function () {
          setStatus("Zoomed to tehsil. Pick village, muraba, then khasra.");
        });
      }
    });
  });
  cadVillageSelect.addEventListener("change", function () {
    var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
    var t = cadTehsilSelect.value || "";
    var v = cadVillageSelect.value || "";
    loadCadMurabaList().then(function () {
      if (d && t && v) {
        ensureCadastralMapVisible().then(function () {
          return zoomCadVillageFromServer(d, t, v);
        }).catch(function (err) {
          console.warn("[cad zoom village]", err);
          return zoomGoToApproxSelection(d, "village");
        }).then(function () {
          setStatus("Zoomed to village. Pick muraba and khasra for the parcel.");
        });
      }
    });
  });
  cadMurabaSelect.addEventListener("change", function () {
    var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
    var t = cadTehsilSelect.value || "";
    var v = cadVillageSelect.value || "";
    var mur = cadMurabaSelect.value || "";
    loadCadKhasraList().then(function () {
      if (d && t && v && mur) {
        ensureCadastralMapVisible().then(function () {
          return zoomCadMurabaFromServer(d, t, v, mur);
        }).catch(function (err) {
          console.warn("[cad zoom muraba]", err);
          return zoomGoToApproxSelection(d, "muraba");
        }).then(function () {
          setStatus("Zoomed to muraba. Select khasra to open the parcel.");
        });
      }
    });
  });
  cadKhasraSelect.addEventListener("change", function () {
    if (!cadKhasraSelect.value) return;
    performCadParcelShowZoom();
  });
} else {
  console.error("[GIS] Cadastral AOI selects missing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â cadastral dropdown workflow disabled.");
}

var cadNearM = document.getElementById("cadNearM");
if (cadNearM) {
  cadNearM.addEventListener("input", function () {
    var v = document.getElementById("cadNearMVal");
    if (v) v.textContent = this.value;
    scheduleCadNearbyAutoRun();
  });
}

(function buildCadNearChecks() {
  var box = document.getElementById("cadNearChecks");
  if (!box) {
    console.warn("[GIS] cadNearChecks missing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â skipping cad nearby checkboxes (rail/panels may still work).");
    return;
  }
  POI_LAYERS.forEach(function (p) {
    var lab = document.createElement("label");
    lab.innerHTML = "<input type=\"checkbox\" class=\"cad-near-cb\" data-url=\"" + p.url + "\" data-layer=\"" + p.layerId + "\" checked /> " + p.label;
    box.appendChild(lab);
  });
  var cadNearAll = document.getElementById("cadNearAll");
  if (!cadNearAll) return;
  cadNearAll.addEventListener("change", function () {
    document.querySelectorAll(".cad-near-cb").forEach(function (c) { c.checked = this.checked; }.bind(this));
    syncCadNearInfrastructureVisibility();
    scheduleCadNearbyAutoRun();
  });
  box.addEventListener("change", function (ev) {
    if (ev.target && ev.target.classList && ev.target.classList.contains("cad-near-cb")) {
      syncCadNearInfrastructureVisibility();
      scheduleCadNearbyAutoRun();
    }
  });
  syncCadNearInfrastructureVisibility();
})();

function isAdministrativeAoiTabActive() {
  var tabAoi = document.getElementById("tabAoi");
  var mpAoi = document.getElementById("mpAoi");
  if (tabAoi && tabAoi.classList.contains("active")) return true;
  if (mpAoi && mpAoi.classList.contains("active")) return true;
  return false;
}

function syncCurrentLocationFabVisibility() {
  var fab = document.getElementById("currentLocationFab");
  if (!fab) return;
  var show = isAdministrativeAoiTabActive();
  fab.style.display = show ? "flex" : "none";
  fab.setAttribute("aria-hidden", show ? "false" : "true");

  if (!show && view && view.popup && view.popup.visible) {
    var isCurrentPopup = false;
    try {
      var sf = view.popup.selectedFeature;
      isCurrentPopup = !!(sf && sf.attributes && String(sf.attributes.label || "").toLowerCase() === "current location");
    } catch (e0) {}
    if (!isCurrentPopup) {
      var t = String(view.popup.title || "").toLowerCase();
      isCurrentPopup = t.indexOf("current location") >= 0;
    }
    if (isCurrentPopup) {
      try { view.popup.close(); } catch (e1) {}
    }
  }
}

document.querySelectorAll(".modal-tabs button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".modal-tabs button").forEach(function (b) { b.classList.remove("active"); });
    document.querySelectorAll(".modal-panel").forEach(function (p) { p.classList.remove("active"); });
    btn.classList.add("active");
    var id = btn.getAttribute("data-mpanel");
    var p = document.getElementById(id);
    if (p) p.classList.add("active");
    syncCurrentLocationFabVisibility();
  });
});
syncCurrentLocationFabVisibility();

function queryCadParcelGeometry() {
  var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
  var t = cadTehsilSelect.value || "";
  var v = cadVillageSelect.value || "";
  var mur = cadMurabaSelect.value || "";
  var kha = cadKhasraSelect.value || "";
  if (!d || !t || !v || !mur || !kha) {
    return Promise.resolve(null);
  }
  var opt = cadDistrictSelect.options[cadDistrictSelect.selectedIndex];
  var dName = (opt && opt.getAttribute("data-dname")) || opt.text || "";
  var lid = getCadastralLayerIdForDistrictName(dName);
  if (lid == null) {
    return Promise.resolve(null);
  }
  var w = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) +
    " AND n_murr_no = " + sqlQuote(mur) + " AND n_khas_no = " + sqlQuote(kha);
  return cadLayer.when(function () { cadLayer.visible = true; }).then(function () {
    return fixCadastralScales();
  }).then(function () {
    return queryLayer(CAD_MS, lid, {
      where: w,
      outFields: "*",
      returnGeometry: true,
      resultRecordCount: 5
    });
  }).then(function (data) {
    if (!data.features || !data.features.length) return null;
    return { lid: lid, feature: data.features[0] };
  });
}

function getCurrentCadSelectionInfo() {
  var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
  var t = cadTehsilSelect.value || "";
  var v = cadVillageSelect.value || "";
  var mur = cadMurabaSelect.value || "";
  var kha = cadKhasraSelect.value || "";
  var opt = cadDistrictSelect.options[cadDistrictSelect.selectedIndex];
  var dName = (opt && opt.getAttribute("data-dname")) || opt.text || "";
  var lid = getCadastralLayerIdForDistrictName(dName);
  return {
    lid: lid,
    murWhere: d && t && v && mur
      ? "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) + " AND n_murr_no = " + sqlQuote(mur)
      : "",
    khasraWhere: d && t && v && mur && kha
      ? "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) + " AND n_murr_no = " + sqlQuote(mur) + " AND n_khas_no = " + sqlQuote(kha)
      : ""
  };
}

function queryCadParcelGeometryView() {
  var d = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
  var t = cadTehsilSelect.value || "";
  var v = cadVillageSelect.value || "";
  var mur = cadMurabaSelect.value || "";
  var kha = cadKhasraSelect.value || "";
  if (!d || !t || !v || !mur || !kha) {
    return Promise.resolve(null);
  }
  var opt = cadDistrictSelect.options[cadDistrictSelect.selectedIndex];
  var dName = (opt && opt.getAttribute("data-dname")) || opt.text || "";
  var lid = getCadastralLayerIdForDistrictName(dName);
  if (lid == null) return Promise.resolve(null);
  var w = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) +
    " AND n_murr_no = " + sqlQuote(mur) + " AND n_khas_no = " + sqlQuote(kha);
  return queryLayer(CAD_MS, lid, {
    where: w,
    outFields: "*",
    returnGeometry: true,
    outSR: wkidValue(view && view.spatialReference) || 3857,
    resultRecordCount: 5
  }).then(function (data) {
    if (!data.features || !data.features.length) return null;
    return { lid: lid, feature: data.features[0] };
  });
}

/** One cadastral polygon for a muraba (for zoom extent). */
function queryCadMurabaExtentGeometry(d, t, v, mur) {
  if (!d || !t || !v || mur == null || mur === "") return Promise.resolve(null);
  var opt = cadDistrictSelect.options[cadDistrictSelect.selectedIndex];
  var dName = (opt && opt.getAttribute("data-dname")) || opt.text || "";
  var lid = getCadastralLayerIdForDistrictName(dName);
  if (lid == null) return Promise.resolve(null);
  var w = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) +
    " AND n_murr_no = " + sqlQuote(mur);
  return queryLayer(CAD_MS, lid, {
    where: w,
    outFields: "OBJECTID",
    returnGeometry: true,
    resultRecordCount: 80
  }).then(function (data) {
    var feats = data.features || [];
    var polys = [];
    var unionExt = null;
    var i;
    for (i = 0; i < feats.length; i++) {
      var g0 = ensureSR32643(geomFromJSON(feats[i].geometry));
      if (!geometryIsUsable(g0)) continue;
      if (g0.type === "polygon") polys.push(g0);
      var ext0 = g0.type === "extent" ? g0 : g0.extent;
      if (!ext0) continue;
      if (!unionExt) unionExt = ext0.clone ? ext0.clone() : ext0;
      else if (typeof unionExt.union === "function") unionExt = unionExt.union(ext0);
    }
    if (polys.length === 1) return polys[0];
    if (polys.length > 1) {
      try {
        var merged = geometryEngine.union(polys);
        if (geometryIsUsable(merged)) return ensureSR32643(merged);
      } catch (e) {
        console.warn("[cad] muraba union failed, using extent fallback", e);
      }
    }
    return unionExt;
  });
}

function queryCadMurabaViewGeometries(d, t, v, mur) {
  if (!d || !t || !v || mur == null || mur === "") return Promise.resolve([]);
  var opt = cadDistrictSelect.options[cadDistrictSelect.selectedIndex];
  var dName = (opt && opt.getAttribute("data-dname")) || opt.text || "";
  var lid = getCadastralLayerIdForDistrictName(dName);
  if (lid == null) return Promise.resolve([]);
  var w = "n_d_code = " + sqlQuote(d) + " AND n_t_code = " + sqlQuote(t) + " AND n_v_code = " + sqlQuote(v) +
    " AND n_murr_no = " + sqlQuote(mur);
  return queryLayer(CAD_MS, lid, {
    where: w,
    outFields: "OBJECTID,n_khas_no,n_murr_no",
    returnGeometry: true,
    outSR: wkidValue(view && view.spatialReference) || 3857,
    resultRecordCount: 200
  }).then(function (data) {
    return (data.features || []).map(function (f) {
      var g = geomFromJSON(f.geometry);
      if (!g) return null;
      coerceMissingSpatialReference(g, view.spatialReference || SR_WEB);
      return { geometry: g, attributes: f.attributes || {} };
    }).filter(function (x) {
      return x && geometryIsUsable(x.geometry);
    });
  });
}

function resolveParcel32643() {
  return queryCadParcelGeometry().then(function (res) {
    if (res && res.feature) {
      return ensureSR32643(geomFromJSON(res.feature.geometry));
    }
    return lastCadParcel32643 ? ensureSR32643(lastCadParcel32643) : null;
  });
}

function getMergedFlatForHighlight(currentFlat, selectionSource) {
  if (selectionSource !== "map-click" || !mapSelectionAccumulateMode) {
    return currentFlat || [];
  }
  var merged = [];
  mapIdentifyClickSessions.forEach(function (s) {
    merged = merged.concat(s.flat || []);
  });
  return merged.concat(currentFlat || []);
}

/**
 * After identify: anchor ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œparcelÃƒÂ¢Ã¢â€šÂ¬Ã‚Â for downstream tools ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â cad highlight, else smallest polygon hit, else small buffer at click.
 */
function ensureParcelAnchorFromIdentify(flat, anchorPoint32643) {
  if (lastCadParcel32643) return;
  var poly = pickSmallestPolygonFromIdentifyFlat(flat);
  if (poly) {
    lastCadParcel32643 = poly;
    return;
  }
  if (anchorPoint32643 && anchorPoint32643.type === "point") {
    var buf = geometryEngine.buffer(anchorPoint32643, 200, "meters");
    if (buf) lastCadParcel32643 = ensureSR32643(buf);
  }
}

function queryNearbyRowsFromPoint(anchor32643Point, radiusM) {
  var layers = nearbyDistanceLayers && nearbyDistanceLayers.length ? nearbyDistanceLayers : mergeNearbyLayerLists([]);
  var buf = geometryEngine.buffer(anchor32643Point, radiusM, "meters");
  if (!buf) return Promise.resolve([]);
  ensureSR32643(buf);
  var qp = geometryToQueryParams(buf);
  var tasks = layers.map(function (p) {
    return queryLayer(p.url, p.layerId, Object.assign({
      where: "1=1",
      returnGeometry: true,
      outFields: "OBJECTID",
      resultRecordCount: 200
    }, qp)).catch(function () { return { features: [] }; });
  });
  return Promise.all(tasks).then(function (all) {
    var rows = [];
    all.forEach(function (data, idx) {
      var label = layers[idx].label;
      (data.features || []).forEach(function (f) {
        var raw = geomFromJSON(f.geometry);
        coerceMissingSpatialReference(raw, SR_METER);
        var fg = toEngineSR(raw);
        if (!fg) return;
        var dM = geometryEngine.distance(anchor32643Point, fg, "meters");
        if (dM == null || !isFinite(dM)) {
          dM = geodesicDistanceMetersFallback(anchor32643Point, fg);
        }
        if (dM == null || !isFinite(dM)) return;
        rows.push({
          label: label,
          dM: Math.round(dM),
          geomJson: f.geometry || null,
          theme: themeKeyFromUrl(layers[idx].url)
        });
      });
    });
    rows.sort(function (a, b) { return a.dM - b.dM; });
    return rows.slice(0, 200);
  });
}

function buildMapIdentificationPopupHtml(lat, lon, atClickRows, nearbyRows, radiusM) {
  var h = "<div style=\"font-size:12px;max-width:380px;max-height:320px;overflow:auto;line-height:1.35;\">";
  h += "<p style=\"margin:0 0 8px;color:#5f6368;\"><strong>Selected location</strong><br/>Lat " + lat.toFixed(5) + "Ãƒâ€šÃ‚Â°, Lon " + lon.toFixed(5) + "Ãƒâ€šÃ‚Â°<br/>";
  h += "Distances are straight-line (meters) from this map click.</p>";
  h += "<h4 style=\"margin:10px 0 6px;font-size:13px;\">Features at click</h4>";
  if (!atClickRows.length) {
    h += "<p style=\"margin:0;color:#5f6368;\">No features returned ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â zoom in or try another spot.</p>";
  } else {
    h += "<table style=\"width:100%;border-collapse:collapse;font-size:11px;\"><tr style=\"text-align:left;border-bottom:1px solid #dadce0;\"><th>Layer</th><th>Distance</th></tr>";
    atClickRows.forEach(function (r) {
      h += "<tr><td style=\"padding:4px 6px 4px 0;vertical-align:top;\">" + escapeHtml(r.layer) + "</td><td style=\"padding:4px 0;\">" + (r.dM != null ? r.dM + " m" : "n/a") + "</td></tr>";
    });
    h += "</table>";
  }
  h += "<h4 style=\"margin:10px 0 6px;font-size:13px;\">Nearby (within " + radiusM + " m)</h4>";
  if (!nearbyRows.length) {
    h += "<p style=\"margin:0;color:#5f6368;\">No features in buffer (or layers off ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â we still query servers).</p>";
  } else {
    h += "<table style=\"width:100%;border-collapse:collapse;font-size:11px;\"><tr style=\"text-align:left;border-bottom:1px solid #dadce0;\"><th>Feature class</th><th>Distance</th></tr>";
    nearbyRows.forEach(function (r) {
      h += "<tr><td style=\"padding:4px 6px 4px 0;\">" + escapeHtml(r.label) + "</td><td style=\"padding:4px 0;\">" + r.dM + " m</td></tr>";
    });
    h += "</table>";
  }
  h += "</div>";
  return h;
}

/** Zoom target when cadastral parcel has no geometry: finest admin boundary matching dropdowns. */
function queryAdminGeometryForCadZoom(dCode, tCode, vCode) {
  if (!dCode) return Promise.resolve(null);
  var layerId = LAYER_DISTRICT;
  var where = "n_d_code = " + sqlQuote(dCode);
  if (vCode && tCode) {
    layerId = LAYER_VILLAGE;
    where += " AND n_t_code = " + sqlQuote(tCode) + " AND n_v_code = " + sqlQuote(vCode);
  } else if (tCode) {
    layerId = LAYER_TEHSIL;
    where += " AND n_t_code = " + sqlQuote(tCode);
  }
  return queryAdministrativeGeometryForZoom(layerId, where, "OBJECTID").then(function (res) {
    return res && res.geometry ? res.geometry : null;
  });
}

function performCadParcelShowZoom() {
  cadParcelLayer.removeAll();
  cadNearbyLayer.removeAll();
  clearCadSelectionLayer();
  var dSel = cadDistrictSelect.value ? String(cadDistrictSelect.value).trim() : "";
  var tSel = cadTehsilSelect.value || "";
  var vSel = cadVillageSelect.value || "";
  var murSel = cadMurabaSelect.value ? String(cadMurabaSelect.value).trim() : "";
  var khaSel = cadKhasraSelect.value ? String(cadKhasraSelect.value).trim() : "";

  if (!dSel) {
    setStatus("Cadastral: choose District, then Tehsil ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Village ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Muraba (and Khasra for a specific parcel).");
    return;
  }
  if (!tSel || !vSel) {
    setStatus("Cadastral: select Tehsil and Village.");
    return;
  }
  if (!murSel) {
    setStatus("Cadastral: select a Muraba, then optionally a Khasra / parcel from the list.");
    return;
  }

  function getCadFitOptions(geom32643) {
    var ext = geom32643 && (geom32643.type === "extent" ? geom32643 : geom32643.extent);
    var width = ext && isFinite(ext.width) ? ext.width : null;
    var height = ext && isFinite(ext.height) ? ext.height : null;
    var span = Math.max(width || 0, height || 0);
    if (!span || !isFinite(span)) {
      return { expandFactor: 1.2 };
    }
    if (span <= 25) return { expandFactor: 1.15 };
    if (span <= 50) return { expandFactor: 1.12 };
    if (span <= 100) return { expandFactor: 1.1 };
    if (span <= 250) return { expandFactor: 1.08 };
    if (span <= 500) return { expandFactor: 1.06 };
    if (span <= 1000) return { expandFactor: 1.04 };
    return { expandFactor: 1.03 };
  }

  function getExtentFromViewGeometries(viewGeoms) {
    var unionExt = null;
    (viewGeoms || []).forEach(function (item) {
      var g = item && item.geometry ? item.geometry : item;
      if (!g || !geometryIsUsable(g)) return;
      var ext = g.type === "extent" ? g : g.extent;
      if (!ext) return;
      if (!unionExt) unionExt = ext.clone ? ext.clone() : ext;
      else if (typeof unionExt.union === "function") unionExt = unionExt.union(ext);
    });
    return unionExt;
  }

  function zoomToCadViewGeometries(viewGeoms, opts) {
    var ext = getExtentFromViewGeometries(viewGeoms);
    if (extentLooksEmpty(ext)) return Promise.resolve(false);
    opts = opts || {};
    var expandFactor = opts.expandFactor != null ? opts.expandFactor : 1.06;
    var expanded = typeof ext.expand === "function" ? ext.expand(expandFactor) : ext;
    var span = Math.max(expanded.width || 0, expanded.height || 0);
    var ctr = expanded.center || null;
    var targetScale = null;
    if (span > 0 && isFinite(span)) {
      if (span <= 40) targetScale = 1200;
      else if (span <= 80) targetScale = 1800;
      else if (span <= 150) targetScale = 2500;
      else if (span <= 300) targetScale = 4000;
      else if (span <= 600) targetScale = 7000;
      else if (span <= 1200) targetScale = 12000;
      else if (span <= 2500) targetScale = 20000;
      else targetScale = 35000;
    }
    if (ctr && targetScale) {
      return view.goTo({ center: ctr, scale: targetScale }).then(function () {
        return true;
      }).catch(function (err0) {
        console.warn("[cad] center+scale goTo failed, extent fallback", err0);
        return view.goTo(expanded).then(function () {
          return true;
        }).catch(function (err1) {
          console.warn("[cad] extent fallback failed", err1);
          return false;
        });
      });
    }
    return view.goTo(expanded).then(function () {
      return true;
    }).catch(function (err) {
      console.warn("[cad] view-geometry goTo failed", err);
      return false;
    });
  }

  function addCadViewGraphics(viewGeoms, fallbackGeom32643, attrForGraphic) {
    var added = false;
    (viewGeoms || []).forEach(function (item) {
      var g = item && item.geometry ? item.geometry : item;
      var attrs = item && item.attributes ? item.attributes : attrForGraphic;
      if (!g || !geometryIsUsable(g)) return;
      cadParcelLayer.add(new Graphic({ geometry: g, symbol: symCadParcel, attributes: attrs || {} }));
      added = true;
    });
    if (added) return true;
    if (!fallbackGeom32643) return false;
    var gWeb = projection.project(fallbackGeom32643, SR_WEB);
    if (!gWeb || !geometryIsUsable(gWeb)) return false;
    cadParcelLayer.add(new Graphic({ geometry: gWeb, symbol: symCadParcel, attributes: attrForGraphic || {} }));
    return true;
  }

  function zoomToCadSelectionExtent(ext) {
    if (extentLooksEmpty(ext)) return Promise.resolve(false);
    var span = Math.max(ext.width || 0, ext.height || 0);
    var ctr = ext.center || null;
    var targetScale = null;
    if (span > 0 && isFinite(span)) {
      if (span <= 40) targetScale = 1200;
      else if (span <= 80) targetScale = 1800;
      else if (span <= 150) targetScale = 2500;
      else if (span <= 300) targetScale = 4000;
      else if (span <= 600) targetScale = 7000;
      else if (span <= 1200) targetScale = 12000;
      else if (span <= 2500) targetScale = 20000;
      else targetScale = 35000;
    }
    if (ctr && targetScale) {
      return view.goTo({ center: ctr, scale: targetScale }).then(function () {
        return true;
      }).catch(function (err0) {
        console.warn("[cad] selection extent center+scale failed", err0);
        return view.goTo(ext).then(function () {
          return true;
        }).catch(function (err1) {
          console.warn("[cad] selection extent goTo failed", err1);
          return false;
        });
      });
    }
    return view.goTo(ext).then(function () {
      return true;
    }).catch(function (err) {
      console.warn("[cad] selection extent goTo failed", err);
      return false;
    });
  }

  function doZoomCad(geom32643, statusMsg, attrForGraphic, viewGeoms) {
    lastCadParcel32643 = geom32643;
    lastCadHierarchyGeom32643 = geom32643;
    attrForGraphic = attrForGraphic || {};
    return projection.load().then(function () {
      var cadSel = getCurrentCadSelectionInfo();
      return showCadSelectionLayer(cadSel.lid, cadSel.murWhere).then(function (selExt) {
        if (selExt) {
          cadParcelLayer.removeAll();
          return zoomToCadSelectionExtent(selExt).then(function (usedSelectionExtent) {
            if (usedSelectionExtent) return;
            addCadViewGraphics(viewGeoms, geom32643, attrForGraphic);
            return zoomToCadViewGeometries(viewGeoms, getCadFitOptions(geom32643)).then(function (usedViewGeom) {
              if (usedViewGeom) return;
              return zoomToGeometry(geom32643, getCadFitOptions(geom32643));
            });
          });
        }
        addCadViewGraphics(viewGeoms, geom32643, attrForGraphic);
        return zoomToCadViewGeometries(viewGeoms, getCadFitOptions(geom32643)).then(function (usedViewGeom) {
          if (usedViewGeom) return;
          return zoomToGeometry(geom32643, getCadFitOptions(geom32643));
        });
      });
    }).then(function () {
var ctr = getGeometryCentroid(geom32643);
var anch = ctr || (geom32643.type === "point" ? geom32643 : null);

if (anch) {
  lastIdentifyAnchor32643 = anch;
  var anch32643 = toEngineSR(ensureSR32643(anch));
  var aoiWgs = anch32643 ? projection.project(anch32643, SR4326) : null;
  if (aoiWgs && isValidWgsLatLon(Number(aoiWgs.y), Number(aoiWgs.x))) {
    lastAoiLocationWgs = { lat: Number(aoiWgs.y), lon: Number(aoiWgs.x) };
  }
}

return publishInvestorSnapshot(anch || geom32643, "admin-aoi");
    }).then(function () {
      setStatus(statusMsg || "Cadastral area shown. Use ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œNearby + distancesÃƒÂ¢Ã¢â€šÂ¬Ã‚Â for infrastructure.");
    });
  }

  /** Khasra dropdown still on placeholder (ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œParcelÃƒÂ¢Ã¢â€šÂ¬Ã‚Â) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â zoom to whole muraba, not a single parcel polygon. */
  if (!khaSel) {
    setStatus("Loading muraba " + murSel + "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦");
    ensureCadastralMapVisible()
      .then(function () {
        return Promise.all([
          queryCadMurabaExtentGeometry(dSel, tSel, vSel, murSel),
          queryCadMurabaViewGeometries(dSel, tSel, vSel, murSel)
        ]);
      })
      .then(function (results) {
        var gMur = results[0];
        var murViewGeoms = results[1] || [];
        if (gMur && geometryIsUsable(gMur)) {
          return doZoomCad(
            gMur,
            "Muraba " + murSel + " ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â pick a Khasra / parcel from the list to outline one parcel, or use ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œNearby + distancesÃƒÂ¢Ã¢â€šÂ¬Ã‚Â here.",
            {},
            murViewGeoms
          );
        }
        return queryAdminGeometryForCadZoom(dSel, tSel, vSel).then(function (adm) {
          if (adm && geometryIsUsable(adm)) {
            return doZoomCad(
              adm,
              "Muraba outline not in service response ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â zoomed to village/admin boundary. Choose Khasra when listed."
            );
          }
          return ensureCadastralMapVisible().then(function () {
            return zoomGoToApproxSelection(dSel, "muraba");
          }).then(function () {
            setStatus("Approximate zoom ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â geometry was not returned; try again or use map identify.");
          });
        });
      })
      .catch(function (e) {
        console.error(e);
        setStatus("Muraba zoom failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â check connection or pick another muraba.");
      });
    return;
  }

  queryCadParcelGeometry().then(function (res) {
    if (!res || !res.feature) {
      setStatus("No parcel polygon for this khasra ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â trying murabaÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦");
      return ensureCadastralMapVisible()
        .then(function () {
          return queryCadMurabaExtentGeometry(dSel, tSel, vSel, murSel);
        })
        .then(function (gMur) {
          if (gMur && geometryIsUsable(gMur)) {
            return doZoomCad(gMur, "Parcel row not found ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â showing muraba " + murSel + ".");
          }
          return queryAdminGeometryForCadZoom(dSel, tSel, vSel).then(function (adm) {
            if (adm && geometryIsUsable(adm)) {
              return doZoomCad(
                adm,
                "Parcel geometry unavailable ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â zoomed to village/admin boundary."
              );
            }
            if (!dSel) {
              setStatus("Could not zoom ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â no district for fallback.");
              return;
            }
            return ensureCadastralMapVisible().then(function () {
              return zoomGoToApproxSelection(dSel, "khasra");
            }).then(function () {
              setStatus("Approximate zoom ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â refine selection or use identify on the map.");
            });
          });
        });
    }
    var gj = res.feature.geometry;
    var gParsed = gj ? geomFromJSON(gj) : null;
    var g = gParsed && geometryIsUsable(gParsed) ? ensureSR32643(gParsed) : null;
    function doZoom(geom32643, statusMsg) {
      lastCadParcel32643 = geom32643;
      lastCadHierarchyGeom32643 = geom32643;
      return Promise.all([
        projection.load(),
        queryCadParcelGeometryView().catch(function () { return null; })
      ]).then(function (parts) {
        var viewRes = parts[1];
        var viewGeoms = [];
        if (viewRes && viewRes.feature && viewRes.feature.geometry) {
          var gView = geomFromJSON(viewRes.feature.geometry);
          if (gView) {
            coerceMissingSpatialReference(gView, view.spatialReference || SR_WEB);
            viewGeoms.push({ geometry: gView, attributes: viewRes.feature.attributes || {} });
          }
        }
        var cadSel = getCurrentCadSelectionInfo();
        return showCadSelectionLayer(cadSel.lid, cadSel.khasraWhere).then(function (selExt) {
          if (selExt) {
            cadParcelLayer.removeAll();
            return zoomToCadSelectionExtent(selExt).then(function (usedSelectionExtent) {
              if (usedSelectionExtent) return;
              addCadViewGraphics(viewGeoms, g, res.feature.attributes || {});
              return zoomToCadViewGeometries(viewGeoms, getCadFitOptions(geom32643)).then(function (usedViewGeom) {
                if (usedViewGeom) return;
                return zoomToGeometry(geom32643, getCadFitOptions(geom32643));
              });
            });
          }
          addCadViewGraphics(viewGeoms, g, res.feature.attributes || {});
          return zoomToCadViewGeometries(viewGeoms, getCadFitOptions(geom32643)).then(function (usedViewGeom) {
            if (usedViewGeom) return;
            return zoomToGeometry(geom32643, getCadFitOptions(geom32643));
          });
        });
      }).then(function () {
        var ctr = getGeometryCentroid(geom32643);
        var anch = ctr || (geom32643.type === "point" ? geom32643 : null);
        if (anch) lastIdentifyAnchor32643 = anch;
        return publishInvestorSnapshot(anch || geom32643, "cad-parcel");
      }).then(function () {
        setStatus(statusMsg || "Cadastral parcel shown. Use ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œNearby + distancesÃƒÂ¢Ã¢â€šÂ¬Ã‚Â for infrastructure.");
      });
    }
    if (g) {
      return doZoom(g);
    }
    return queryAdminGeometryForCadZoom(dSel, tSel, vSel).then(function (adm) {
      if (!adm) {
        if (!dSel) {
          setStatus("Could not zoom ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â no district selected for fallback.");
          return;
        }
        return ensureCadastralMapVisible().then(function () {
          return zoomGoToApproxSelection(dSel, "khasra");
        }).then(function () {
          setStatus("Approximate zoom ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â khasra / parcel level (services omit polygon geometry in REST). Use map identify for exact shapes.");
        });
      }
      return doZoom(adm, "Zoomed to selected village / admin boundary (cadastral parcel outline not returned by server). ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œNearbyÃƒÂ¢Ã¢â€šÂ¬Ã‚Â uses this area until parcel geometry is available.");
    });
  }).catch(function (e) {
    console.error(e);
    setStatus("Could not load parcel ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â check selections.");
  });
}

var btnCadShow = document.getElementById("btnCadShow");
if (btnCadShow) btnCadShow.addEventListener("click", performCadParcelShowZoom);

var btnCadNearby = document.getElementById("btnCadNearby");
if (btnCadNearby) {
  btnCadNearby.addEventListener("click", function () {
    runCadNearbyDistances();
  });
}

var btnCadRoute = document.getElementById("btnCadRoute");
if (btnCadRoute) btnCadRoute.addEventListener("click", function () {
  if (!lastCadCenterWgs || !lastNearestPoiWgs) {
    setStatus("Run \"Nearby + distances\" first to set centres.");
    return;
  }
  Promise.all([
    coerceLocationToWgs(lastCadCenterWgs),
    coerceLocationToWgs(lastNearestPoiWgs)
  ]).then(function (pair) {
    var centerWgs = pair[0];
    var poiWgs = pair[1];
    if (!centerWgs || !poiWgs) {
      setStatus("Parcel/POI route points are invalid. Run Nearby + distances again.");
      return;
    }
    lastCadCenterWgs = centerWgs;
    lastNearestPoiWgs = poiWgs;

    var solveUrl = getEsriRouteSolveUrl();
    if (!hasArcGisRoutingApiKey() && routeServiceNeedsApiKey(solveUrl)) {
      setStatus("ArcGIS API key not configured - showing approximate parcel to POI route.");
      drawBestAvailableFallbackRoute(centerWgs, poiWgs, {
        fromLabel: "Parcel centre",
        toLabel: "Nearest POI"
      }).then(function (approx) {
        var el0 = document.getElementById("cadResults");
        if (el0) el0.textContent = approx.summary + "\n\n" + approx.steps.join("\n");
      });
      return;
    }

    var p0 = new Point({
      x: centerWgs.lon,
      y: centerWgs.lat,
      spatialReference: SR4326
    });
    var p1 = new Point({
      x: poiWgs.lon,
      y: poiWgs.lat,
      spatialReference: SR4326
    });
    var fs = new FeatureSet({
      features: [
        new Graphic({ geometry: p0, attributes: { Name: "Parcel centre" } }),
        new Graphic({ geometry: p1, attributes: { Name: "Nearest POI" } })
      ]
    });
    var rparams = new RouteParameters({
      stops: fs,
      returnDirections: true,
      directionsLengthUnits: "esriKilometers",
      returnRoutes: true
    });
    if (esriConfig.apiKey) rparams.apiKey = esriConfig.apiKey;

    routeLineLayer.removeAll();
    setStatus("Computing Esri driving route...");
    solve(solveUrl, rparams, { apiKey: esriConfig.apiKey }).then(function (res) {
      var rr = res.routeResults && res.routeResults[0];
      var routeFeat = rr && rr.route;
      var altFeat = null;
      var geom = routeFeat && (routeFeat.geometry || routeFeat);
      if (!geom || !geom.type) {
        altFeat = res.routes && res.routes.features && res.routes.features[0];
        geom = altFeat && altFeat.geometry;
      }
      if (!geom) {
        setStatus("Esri route returned no line - check API key and stops.");
        return;
      }
      return projection.load().then(function () {
        var gLine = geom.spatialReference && geom.spatialReference.wkid === 3857 ? geom : projection.project(geom, SR_WEB);
        routeLineLayer.add(new Graphic({
          geometry: gLine,
          symbol: new SimpleLineSymbol({ color: [0, 92, 230, 1], width: 4 })
        }));
        addRouteEndpointMarkers(centerWgs, poiWgs, "Parcel centre", "Nearest POI", gLine);
        return view.goTo(gLine, { padding: getUiZoomPadding() });
      }).then(function () {
        var lines = [];
        if (rr.directions && rr.directions.features) {
          rr.directions.features.slice(0, 30).forEach(function (df) {
            var a = df.attributes || {};
            var tx = a.text || a.Text || a.narrative || "";
            if (tx) lines.push(tx);
          });
        }
        var attrs = (routeFeat && routeFeat.attributes) || (altFeat && altFeat.attributes) || {};
        var km = attrs.Total_Kilometers != null ? attrs.Total_Kilometers : attrs.Shape_Length;
        var mins = attrs.Total_Minutes;
        var head = "Esri driving route - " +
          (km != null ? Number(km).toFixed(2) + " km" : "") +
          (mins != null ? " Â· ~" + Math.round(mins) + " min" : "");
        var body = lines.length ? "\n\n" + lines.join("\n") : "";
        var el = document.getElementById("cadResults");
        if (el) el.textContent = head + body;
        setStatus("Driving route shown (Esri World Route service).");
      });
    }).catch(function (err) {
      console.error(err);
      if (isRoutingAuthError(err)) {
        setStatus("ArcGIS route authorization failed - showing approximate parcel to POI route.");
        drawBestAvailableFallbackRoute(centerWgs, poiWgs, {
          fromLabel: "Parcel centre",
          toLabel: "Nearest POI"
        }).then(function (approx) {
          var el1 = document.getElementById("cadResults");
          if (el1) el1.textContent = approx.summary + "\n\n" + approx.steps.join("\n");
        });
        return;
      }
      setStatus("Esri routing failed - service unavailable.");
    });
  });
});

var btnCadClear = document.getElementById("btnCadClear");
if (btnCadClear) {
  btnCadClear.addEventListener("click", function () {
    cadParcelLayer.removeAll();
    cadNearbyLayer.removeAll();
    routeLineLayer.removeAll();
    lastCadParcel32643 = null;
    lastCadCenterWgs = null;
    lastNearestPoiWgs = null;
    var cr = document.getElementById("cadResults");
    if (cr) cr.textContent = "";
    setStatus("Cadastral graphics cleared.");
  });
}

function runNavigate() {
  if (!districtSelect || !tehsilSelect || !villageSelect) {
    console.warn("[GIS] runNavigate: AOI selects not available.");
    return Promise.resolve();
  }
  var dCode = districtSelect.value ? String(districtSelect.value).trim() : "";
  var tCode = tehsilSelect.value || null;
  if (tCode) tCode = String(tCode).trim();
  var vCode = villageSelect.value || null;
  if (vCode) vCode = String(vCode).trim();
  if (!dCode) {
    selectedDistrictGeom = selectedTehsilGeom = selectedVillageGeom = null;
    lastAoiLocationWgs = null;
    closeAoiRoutePanel();
    return setAdminFilters(null, null, null).then(function () {
      return projection.load().then(function () {
        return zoomToGeometry(projection.project(defaultStudyExtent32643, SR_WEB));
      });
    }).then(function () { setStatus("Study area cleared."); });
  }
  var layerId = LAYER_DISTRICT;
  var where = "n_d_code = " + sqlQuote(dCode);
  if (vCode && tCode) { layerId = LAYER_VILLAGE; where += " AND n_t_code = " + sqlQuote(tCode) + " AND n_v_code = " + sqlQuote(vCode); }
  else if (tCode) { layerId = LAYER_TEHSIL; where += " AND n_t_code = " + sqlQuote(tCode); }
  return setAdminFilters(dCode, tCode, vCode).then(function () {
    return zoomToAdminFeatureExtent(view, layerId, where, getUiZoomPadding(), 1000);
  }).then(function (extentZoomed) {
    return queryAdministrativeGeometryForZoom(layerId, where, "*").then(function (res) {
      return { extentZoomed: extentZoomed, res: res };
    });
  }).then(function (pair) {
    var extentZoomed = pair.extentZoomed;
    var res = pair.res;
    var g32643 = res && res.geometry;
    var a = res && res.attributes;
    if (!g32643) {
      if (!a) {
        alertNoData("geometry");
        return;
      }
      var nameFallback = (a && (a.n_v_name || a.n_t_name || a.n_d_name)) || "selection";
      return zoomGoToApproxSelection(dCode, approxModeFromAdminLayerId(layerId)).then(function () {
        setStatus("Approximate zoom ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â " + nameFallback + " (no usable boundary geometry in query; using district centre).");
      });
    }
    selectedDistrictGeom = selectedTehsilGeom = selectedVillageGeom = null;
    if (layerId === LAYER_DISTRICT) selectedDistrictGeom = g32643;
    else if (layerId === LAYER_TEHSIL) selectedTehsilGeom = g32643;
    else selectedVillageGeom = g32643;
    var doAfterZoom = function () {
      var viewLabel = (a && (a.n_v_name || a.n_t_name || a.n_d_name)) || "area";
      setStatus("View: " + viewLabel);
      var ctr = getGeometryCentroid(g32643);
      var anch = ctr || (g32643.type === "point" ? g32643 : null);
      if (anch) {
        lastIdentifyAnchor32643 = anch;
        return projection.load().then(function () {
          var anch32643 = toEngineSR(ensureSR32643(anch));
          var aoiWgs = anch32643 ? projection.project(anch32643, SR4326) : null;
          if (aoiWgs && isValidWgsLatLon(Number(aoiWgs.y), Number(aoiWgs.x))) {
            lastAoiLocationWgs = { lat: Number(aoiWgs.y), lon: Number(aoiWgs.x) };
          }
        }).catch(function () {
          return null;
        }).then(function () {
          return publishInvestorSnapshot(anch || g32643, "admin-aoi");
        });
      }
      return publishInvestorSnapshot(anch || g32643, "admin-aoi");
    };
    if (extentZoomed) return doAfterZoom();
    return zoomToGeometry(g32643).catch(function (err) {
      console.warn("[navigate zoom]", err);
      return zoomGoToApproxSelection(dCode, approxModeFromAdminLayerId(layerId));
    }).then(doAfterZoom);
  }).catch(function (e) {
    console.error("[navigate]", e);
    if (isGateway502Error(e)) {
      setStatus("Navigation failed: Administrative service/proxy is unreachable (502).");
    } else {
      setStatus("Navigation failed - see console.");
    }
  });
}

function runClearNav() {
  if (!districtSelect) return Promise.resolve();
  districtSelect.value = "";
  selectedDistrictGeom = selectedTehsilGeom = selectedVillageGeom = null;
  lastAoiLocationWgs = null;
  routeLineLayer.removeAll();
  closeAoiRoutePanel();
  resetTehsilVillage();
  return setAdminFilters(null, null, null).then(function () {
    return projection.load().then(function () {
      return zoomToGeometry(projection.project(defaultStudyExtent32643, SR_WEB));
    });
  }).then(function () { setStatus("Cleared."); });
}

var btnNavApply = document.getElementById("btnNavApply");
if (btnNavApply) {
  btnNavApply.addEventListener("click", function () {
    return runNavigate().catch(function (e) {
      console.error("[navigate click]", e);
      if (isGateway502Error(e)) {
        setStatus("Navigation failed: Administrative service/proxy is unreachable (502).");
      } else {
        setStatus("Navigation failed - see console.");
      }
    });
  });
}
var btnNavClear = document.getElementById("btnNavClear");
if (btnNavClear) btnNavClear.addEventListener("click", runClearNav);
var btnRouteFromCurrentToAoi = document.getElementById("btnRouteFromCurrentToAoi");
if (btnRouteFromCurrentToAoi) {
  btnRouteFromCurrentToAoi.addEventListener("click", routeFromCurrentLocationToAoi);
}
var btnAoiRouteClose = document.getElementById("btnAoiRouteClose");
if (btnAoiRouteClose) {
  btnAoiRouteClose.addEventListener("click", closeAoiRoutePanel);
}

function loadHsvpPlots(dCode) {
  var plotSel = document.getElementById("hsvpPlotSelect");
  if (!plotSel) return Promise.resolve();
  plotSel.innerHTML = "<option value=\"\">" + gisPh("hsvpPlot") + "</option>";
  plotSel.disabled = true;
  if (!dCode) return Promise.resolve();
  return queryLayer(INV_MS, LAYER_INVESTMENT, {
    where: "n_d_code = " + sqlQuote(dCode),
    outFields: "*",
    returnGeometry: false,
    resultRecordCount: 800
  }).then(function (data) {
    (data.features || []).forEach(function (f) {
      var a = f.attributes || {};
      var oid = a.OBJECTID != null ? a.OBJECTID : a.objectid;
      if (oid == null) return;
      var label = String(a.n_name || a.Name || a.NAME || a.PLOT_NAME || a.REMARKS || "Plot") + " Ãƒâ€šÃ‚Â· " + oid;
      var o = document.createElement("option");
      o.value = String(oid);
      o.textContent = label;
      plotSel.appendChild(o);
    });
    plotSel.disabled = false;
  }).catch(function () {
    return queryLayer(INV_MS, LAYER_INVESTMENT, {
      where: "1=1",
      outFields: "OBJECTID",
      returnGeometry: false,
      resultRecordCount: 400
    }).then(function (data2) {
      (data2.features || []).forEach(function (f) {
        var oid = f.attributes && f.attributes.OBJECTID;
        if (oid == null) return;
        var o = document.createElement("option");
        o.value = String(oid);
        o.textContent = "Industrial plot " + oid;
        plotSel.appendChild(o);
      });
      plotSel.disabled = false;
    });
  });
}

function performHsvpLandZoom() {
  var ps = document.getElementById("hsvpPlotSelect");
  if (!ps || !ps.value) {
    setStatus("Select district and an HSVP / industrial plot.");
    return Promise.resolve();
  }
  var oid = parseInt(ps.value, 10);
  if (!isFinite(oid)) return Promise.resolve();
  return invLayer.when(function () {
    invLayer.visible = true;
  }).then(function () {
    return queryLayer(INV_MS, LAYER_INVESTMENT, {
      where: "OBJECTID = " + oid,
      outFields: "*",
      returnGeometry: true,
      resultRecordCount: 2
    });
  }).then(function (data) {
    if (!data.features || !data.features.length) {
      alertNoData("HSVP / industrial plot");
      return;
    }
    var feat = data.features[0];
    var gj = feat.geometry;
    var g = gj ? geomFromJSON(gj) : null;
    if (!g || !geometryIsUsable(g)) {
      setStatus("Plot geometry missing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â choose another plot.");
      return;
    }
    coerceMissingSpatialReference(g, SR_WEB);
    var g326 = toEngineSR(g);
    var ctr = g326.type === "point" ? g326 : getGeometryCentroid(g326);
    if (!ctr && g326.extent && g326.extent.center) ctr = g326.extent.center;
    if (!ctr) {
      setStatus("Plot geometry could not anchor a report point.");
      return;
    }
    lastIdentifyAnchor32643 = ctr;
    identifyLayer.removeAll();
    sketchLayer.removeAll();
    selectionHighlightLayer.removeAll();
    connectorLayer.removeAll();
    var flat = [{
      layerName: "Industrial / HSVP",
      layerId: LAYER_INVESTMENT,
      feature: feat,
      _identifyUrl: INV_MS
    }];
    var mapPt = projection.project(ctr, SR_WEB);
    setStatus("Building investor report for selected plotÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦");
    return zoomToGeometry(g326).then(function () {
      return finalizeIdentifyResults(ctr, mapPt, flat, "hsvp");
    });
  }).catch(function (e) {
    console.error(e);
    setStatus("HSVP selection failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
  });
}

(function wireHsvpUi() {
  var hd = document.getElementById("hsvpDistrictSelect");
  if (hd) {
    hd.addEventListener("change", function () {
      loadHsvpPlots(this.value ? String(this.value).trim() : "");
    });
  }
  var hb = document.getElementById("btnHsvpApply");
  if (hb) hb.addEventListener("click", performHsvpLandZoom);
})();

function closeAoiSheet() {
  var aoi = document.getElementById("aoiPanel");
  if (!aoi || aoi.classList.contains("collapsed")) return;
  closeAoiRoutePanel();
  aoi.classList.add("collapsed");
  aoi.setAttribute("aria-hidden", "true");
  var b = document.getElementById("btnOpenNav");
  if (b) b.classList.remove("active");
  refreshMapViewPadding();
  window.setTimeout(function () { notifyViewLayoutChanged(); }, 280);
}
function closeSelectToolsSheet() {
  var el = document.getElementById("selectToolsPanel");
  if (!el || el.classList.contains("collapsed")) return;
  el.classList.add("collapsed");
  el.setAttribute("aria-hidden", "true");
  var bs = document.getElementById("btnSelectTool");
  if (bs) bs.classList.remove("active");
  setSelectParcelTool(false);
  refreshMapViewPadding();
  window.setTimeout(function () { notifyViewLayoutChanged(); }, 280);
}
function openSelectToolsSheet() {
  var el = document.getElementById("selectToolsPanel");
  if (!el) return;
  var tp = document.getElementById("toolsPanel");
  if (tp && !tp.classList.contains("collapsed")) {
    tp.classList.add("collapsed");
    var btl = document.getElementById("btnTogglePanel");
    if (btl) btl.classList.remove("active");
  }
  closeAoiSheet();
  closeSpatialSheet();
  el.classList.remove("collapsed");
  el.setAttribute("aria-hidden", "false");
  var br = document.getElementById("btnSelectTool");
  if (br) br.classList.add("active");
  setSelectParcelTool(true);
  refreshMapViewPadding();
  window.setTimeout(function () { notifyViewLayoutChanged(); }, 280);
}
function toggleSelectToolsSheet() {
  var el = document.getElementById("selectToolsPanel");
  if (!el) return;
  if (el.classList.contains("collapsed")) openSelectToolsSheet();
  else closeSelectToolsSheet();
}

function openAoiSheet() {
  var aoi = document.getElementById("aoiPanel");
  if (!aoi) return;
  closeSelectToolsSheet();
  var sp = document.getElementById("spatialPanel");
  if (sp && !sp.classList.contains("collapsed")) {
    sp.classList.add("collapsed");
    sp.setAttribute("aria-hidden", "true");
    var bs = document.getElementById("btnOpenSpatial");
    if (bs) bs.classList.remove("active");
  }
  aoi.classList.remove("collapsed");
  aoi.setAttribute("aria-hidden", "false");
  document.getElementById("toolsPanel").classList.add("collapsed");
  document.getElementById("btnTogglePanel").classList.remove("active");
  document.getElementById("btnOpenNav").classList.add("active");
  refreshMapViewPadding();
  window.setTimeout(function () { notifyViewLayoutChanged(); }, 280);
}
function toggleAoiPanel() {
  var aoi = document.getElementById("aoiPanel");
  if (!aoi) return;
  if (aoi.classList.contains("collapsed")) openAoiSheet();
  else closeAoiSheet();
}
var btnOpenNavEl = document.getElementById("btnOpenNav");
if (btnOpenNavEl) btnOpenNavEl.addEventListener("click", toggleAoiPanel);
var btnNavCloseEl = document.getElementById("btnNavClose");
if (btnNavCloseEl) btnNavCloseEl.addEventListener("click", closeAoiSheet);
function msmeGisKeydownEsc(ev) {
  if (ev.key !== "Escape") return;
  var sel = document.getElementById("selectToolsPanel");
  if (sel && !sel.classList.contains("collapsed")) {
    closeSelectToolsSheet();
    return;
  }
  var aoi = document.getElementById("aoiPanel");
  if (aoi && !aoi.classList.contains("collapsed")) {
    closeAoiSheet();
    return;
  }
  var sp = document.getElementById("spatialPanel");
  if (sp && !sp.classList.contains("collapsed")) closeSpatialSheet();
}
document.addEventListener("keydown", msmeGisKeydownEsc);
(function aoiSwipeToClose() {
  var panel = document.getElementById("aoiPanel");
  if (!panel) return;
  var x0 = null;
  panel.addEventListener("touchstart", function (e) {
    if (panel.classList.contains("collapsed")) return;
    x0 = e.touches[0].clientX;
  }, { passive: true });
  panel.addEventListener("touchend", function (e) {
    if (x0 == null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (dx < -56) closeAoiSheet();
  }, { passive: true });
})();

var btnTogglePanelEl = document.getElementById("btnTogglePanel");
if (btnTogglePanelEl) btnTogglePanelEl.addEventListener("click", function () {
  var tp = document.getElementById("toolsPanel");
  if (!tp) return;
  tp.classList.toggle("collapsed");
  this.classList.toggle("active");
  if (!tp.classList.contains("collapsed")) {
    ensureOptionalOperationalLayers().catch(function (err) {
      console.warn("[layer panel] optional layer bootstrap", err);
    });
    closeSelectToolsSheet();
    var aoi = document.getElementById("aoiPanel");
    if (aoi && !aoi.classList.contains("collapsed")) {
      aoi.classList.add("collapsed");
      aoi.setAttribute("aria-hidden", "true");
      document.getElementById("btnOpenNav").classList.remove("active");
    }
    var sp = document.getElementById("spatialPanel");
    if (sp && !sp.classList.contains("collapsed")) {
      sp.classList.add("collapsed");
      sp.setAttribute("aria-hidden", "true");
      var bs = document.getElementById("btnOpenSpatial");
      if (bs) bs.classList.remove("active");
    }
  }
  refreshMapViewPadding();
  window.setTimeout(function () { notifyViewLayoutChanged(); }, 280);
});

function closeSpatialSheet() {
  var sp = document.getElementById("spatialPanel");
  if (!sp || sp.classList.contains("collapsed")) return;
  sp.classList.add("collapsed");
  sp.setAttribute("aria-hidden", "true");
  var b = document.getElementById("btnOpenSpatial");
  if (b) b.classList.remove("active");
  refreshMapViewPadding();
  window.setTimeout(function () { notifyViewLayoutChanged(); }, 280);
}
function openSpatialSheet() {
  var sp = document.getElementById("spatialPanel");
  if (!sp) return;
  closeSelectToolsSheet();
  sp.classList.remove("collapsed");
  sp.setAttribute("aria-hidden", "false");
  document.getElementById("toolsPanel").classList.add("collapsed");
  document.getElementById("btnTogglePanel").classList.remove("active");
  var aoi = document.getElementById("aoiPanel");
  if (aoi && !aoi.classList.contains("collapsed")) {
    aoi.classList.add("collapsed");
    aoi.setAttribute("aria-hidden", "true");
    document.getElementById("btnOpenNav").classList.remove("active");
  }
  var bs = document.getElementById("btnOpenSpatial");
  if (bs) bs.classList.add("active");
  refreshMapViewPadding();
  window.setTimeout(function () { notifyViewLayoutChanged(); }, 280);
}
function toggleSpatialPanel() {
  var sp = document.getElementById("spatialPanel");
  if (sp.classList.contains("collapsed")) openSpatialSheet();
  else closeSpatialSheet();
}
var btnOpenSpatial = document.getElementById("btnOpenSpatial");
if (btnOpenSpatial) btnOpenSpatial.addEventListener("click", toggleSpatialPanel);
var btnSpatialClose = document.getElementById("btnSpatialClose");
if (btnSpatialClose) btnSpatialClose.addEventListener("click", closeSpatialSheet);

(function () {
  var btnSel = document.getElementById("btnSelectTool");
  if (btnSel) {
    btnSel.addEventListener("click", function () {
      toggleSelectToolsSheet();
    });
  }
  var btnSelClose = document.getElementById("btnSelectToolsClose");
  if (btnSelClose) {
    btnSelClose.addEventListener("click", function () {
      closeSelectToolsSheet();
    });
  }
})();

document.querySelectorAll("#spatialToolbar .st-tabs .tab").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll("#spatialToolbar .st-tabs .tab").forEach(function (b) { b.classList.remove("active"); });
    document.querySelectorAll("#spatialToolbar .panel").forEach(function (p) { p.classList.remove("active"); });
    btn.classList.add("active");
    var id = btn.getAttribute("data-panel");
    var panel = document.getElementById(id);
    if (panel) panel.classList.add("active");
  });
});

var legendFabEl = document.getElementById("legendFab");
if (legendFabEl) {
  legendFabEl.addEventListener("click", function () {
    var p = document.getElementById("legendPanel");
    if (!p) return;
    var on = !p.classList.contains("visible");
    p.classList.toggle("visible", on);
    this.setAttribute("aria-expanded", on);
  });
}

function bindRange(id, outId) {
  var el = document.getElementById(id);
  var o = document.getElementById(outId);
  if (!el || !o) return;
  function upd() { o.textContent = el.value; }
  el.addEventListener("input", upd);
  upd();
}
bindRange("bufDist", "bufDistVal");
bindRange("bufMarkQueryRadius", "bufMarkQueryRadiusVal");
bindRange("proxDist", "proxDistVal");
bindRange("multiDist", "multiDistVal");
bindRange("suitDist", "suitDistVal");

(function buildChecks() {
  var pc = document.getElementById("proxCheckboxes");
  if (!pc) {
    console.warn("[GIS] proxCheckboxes missing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â skipping proximity checkboxes.");
    return;
  }
  POI_LAYERS.forEach(function (p) {
    var lab = document.createElement("label");
    lab.innerHTML = "<input type=\"checkbox\" class=\"prox-cb\" data-url=\"" + p.url + "\" data-layer=\"" + p.layerId + "\" checked /> " + p.label;
    pc.appendChild(lab);
  });
  var proxAll = document.getElementById("proxCheckAll");
  if (proxAll) {
    proxAll.addEventListener("change", function () {
      document.querySelectorAll(".prox-cb").forEach(function (c) { c.checked = this.checked; }.bind(this));
    });
  }

  var ic = document.getElementById("intCheckboxes");
  if (!ic) return;
  INT_LAYERS.forEach(function (p) {
    var lab = document.createElement("label");
    lab.innerHTML = "<input type=\"checkbox\" class=\"int-cb\" data-url=\"" + p.url + "\" data-layer=\"" + p.layerId + "\" /> " + p.label;
    ic.appendChild(lab);
  });
  var firstIntCb = document.querySelectorAll(".int-cb")[0];
  if (firstIntCb) firstIntCb.checked = true;
  var intAll = document.getElementById("intCheckAll");
  if (intAll) {
    intAll.addEventListener("change", function () {
      document.querySelectorAll(".int-cb").forEach(function (c) { c.checked = this.checked; }.bind(this));
    });
  }

  var mc = document.getElementById("multiCheckboxes");
  if (!mc) return;
  UTIL_LINES.forEach(function (p) {
    var lab = document.createElement("label");
    lab.innerHTML = "<input type=\"checkbox\" class=\"multi-cb\" data-url=\"" + p.url + "\" data-layer=\"" + p.layerId + "\" checked /> " + p.label;
    mc.appendChild(lab);
  });
  var multiAll = document.getElementById("multiCheckAll");
  if (multiAll) {
    multiAll.addEventListener("change", function () {
      document.querySelectorAll(".multi-cb").forEach(function (c) { c.checked = this.checked; }.bind(this));
    });
  }
})();

var symBuffer = new SimpleFillSymbol({
  color: [26, 115, 232, 0.2],
  outline: new SimpleLineSymbol({ color: [26, 115, 232, 0.85], width: 1 })
});
var symVillage = new SimpleFillSymbol({
  color: [52, 168, 83, 0.35],
  outline: new SimpleLineSymbol({ color: [30, 142, 62, 1], width: 1 })
});
var symPoint = new SimpleMarkerSymbol({
  style: "circle", color: [234, 67, 53, 0.95], size: 9,
  outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1 })
});
var symSuitable = new SimpleFillSymbol({
  color: [52, 168, 83, 0.45],
  outline: new SimpleLineSymbol({ color: [30, 142, 62, 1.5], width: 1.5 })
});
var symLineHit = new SimpleLineSymbol({ color: [251, 140, 0, 1], width: 2 });
var symCadNearBuffer = new SimpleFillSymbol({
  color: [0, 188, 212, 0.1],
  outline: new SimpleLineSymbol({ color: [0, 150, 136, 1], width: 2 })
});
var symBufferMark = new SimpleMarkerSymbol({
  style: "diamond",
  color: [176, 32, 93, 0.95],
  size: 12,
  outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1.5 })
});

function clearResults() { resultsLayer.removeAll(); }

msmeBind("runBuffer", "click", function () {
  clearResults();
  var roadLayerId = parseInt(document.getElementById("bufRoadLayer").value, 10);
  var distM = parseFloat(document.getElementById("bufDist").value) || 1000;
  var qg = activeQueryGeometry();
  queryLayer(TRANS_MS, roadLayerId, Object.assign({
    where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 100
  }, geometryToQueryParams(qg))).then(function (data) {
    if (!data.features || !data.features.length) { alertNoData("features in area"); return; }
    var n = 0;
    var skipped = 0;
    data.features.forEach(function (f) {
      var raw = geomFromJSON(f.geometry);
      // Query responses often keep SR only at top-level; assume requested outSR (32643) when missing.
      coerceMissingSpatialReference(raw, SR_METER);
      var g = toEngineSR(raw);
      if (!g) return;
      var buf = geometryEngine.buffer(g, distM, "meters");
      if (buf) {
        resultsLayer.add(new Graphic({ geometry: projection.project(buf, SR_WEB), symbol: symBuffer, attributes: f.attributes }));
        n++;
      } else {
        skipped++;
      }
    });
    if (!n) {
      setStatus("Buffer could not be created from selected features. Try another road source or zoom area.");
      alertNoData("buffer");
    }
    else {
      var msg = "Buffer: " + n + " feature(s), " + distM + " m.";
      if (skipped) msg += " (" + skipped + " skipped invalid geometry)";
      setStatus(msg);
      publishAnalysisToolResult("buffer", msg, { count: n, distanceM: distM });
    }
  }).catch(function (e) { console.error(e); setStatus("Buffer failed."); });
});

msmeBind("runProximity", "click", function () {
  clearResults();
  var maxD = parseFloat(document.getElementById("proxDist").value) || 2000;
  var qg = activeQueryGeometry();
  var checks = Array.prototype.slice.call(document.querySelectorAll(".prox-cb")).filter(function (c) { return c.checked; });
  if (!checks.length) { alertNoData("select POI layer"); return; }
  var qV = queryLayer(ADMIN_MS, LAYER_VILLAGE, Object.assign({
    where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 600
  }, geometryToQueryParams(qg)));
  var qPois = checks.map(function (c) {
    return queryLayer(c.getAttribute("data-url"), parseInt(c.getAttribute("data-layer"), 10), Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 400
    }, geometryToQueryParams(qg))).catch(function () { return { features: [] }; });
  });
  Promise.all([qV].concat(qPois)).then(function (results) {
    var villages = results[0].features || [];
    var poiGeoms = [];
    for (var i = 1; i < results.length; i++) {
      (results[i].features || []).forEach(function (f) {
        var g = toEngineSR(geomFromJSON(f.geometry));
        if (g) poiGeoms.push(g);
      });
    }
    if (!villages.length || !poiGeoms.length) { alertNoData("villages or POI"); return; }
    var hits = 0;
    villages.forEach(function (vf) {
      var vg = toEngineSR(geomFromJSON(vf.geometry));
      if (!vg) return;
      var ok = false;
      for (var j = 0; j < poiGeoms.length && !ok; j++) {
        if (geometryEngine.distance(vg, poiGeoms[j], "meters") <= maxD) ok = true;
      }
      if (ok) {
        resultsLayer.add(new Graphic({
          geometry: projection.project(vg, SR_WEB),
          symbol: symVillage,
          attributes: vf.attributes
        }));
        hits++;
      }
    });
    if (!hits) alertNoData("proximity");
    else {
      var msgP = "Proximity: " + hits + " villages within " + maxD + " m of selected POI.";
      setStatus(msgP);
      publishAnalysisToolResult("proximity", msgP, { count: hits, maxDistanceM: maxD });
    }
  }).catch(function (e) {
    console.error(e);
    setStatus("Proximity analysis failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
  });
});

msmeBind("runIntersect", "click", function () {
  clearResults();
  var qg = activeQueryGeometry();
  var checks = Array.prototype.slice.call(document.querySelectorAll(".int-cb")).filter(function (c) { return c.checked; });
  if (!checks.length) { alertNoData("select constraint layer"); return; }
  var qInv = queryLayer(INV_MS, LAYER_INVESTMENT, Object.assign({
    where: "1=1", returnGeometry: true, outFields: "*", resultRecordCount: 800
  }, geometryToQueryParams(qg)));
  var qPolys = checks.map(function (c) {
    return queryLayer(c.getAttribute("data-url"), parseInt(c.getAttribute("data-layer"), 10), Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 300
    }, geometryToQueryParams(qg))).catch(function () { return { features: [] }; });
  });
  Promise.all([qInv].concat(qPolys)).then(function (results) {
    var pts = results[0].features || [];
    var polyGroups = [];
    for (var i = 1; i < results.length; i++) {
      polyGroups.push((results[i].features || []).map(function (f) {
        return toEngineSR(geomFromJSON(f.geometry));
      }).filter(Boolean));
    }
    if (!pts.length) { alertNoData("industrial sites"); return; }
    var polyGroupsOk = polyGroups.every(function (g) { return g.length > 0; });
    if (!polyGroupsOk) { alertNoData("constraint polygons"); return; }
    var n = 0;
    pts.forEach(function (pf) {
      var pg = toEngineSR(geomFromJSON(pf.geometry));
      if (!pg) return;
      var pass = true;
      for (var gi = 0; gi < polyGroups.length && pass; gi++) {
        var hit = false;
        for (var pi = 0; pi < polyGroups[gi].length; pi++) {
          if (geometryEngine.intersects(pg, polyGroups[gi][pi])) { hit = true; break; }
        }
        if (!hit) pass = false;
      }
      if (pass) {
        resultsLayer.add(new Graphic({
          geometry: projection.project(pg, SR_WEB),
          symbol: symPoint,
          attributes: pf.attributes
        }));
        n++;
      }
    });
    if (!n) alertNoData("intersection");
    else {
      var msgI = "Intersect: " + n + " industrial site(s) inside all selected layers.";
      setStatus(msgI);
      publishAnalysisToolResult("intersect", msgI, { count: n });
    }
  }).catch(function (e) {
    console.error(e);
    setStatus("Intersect analysis failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
  });
});

msmeBind("runMulti", "click", function () {
  clearResults();
  var maxD = parseFloat(document.getElementById("multiDist").value) || 2000;
  var incRoads = document.getElementById("multiIncRoads").checked;
  var qg = activeQueryGeometry();
  var uchecks = Array.prototype.slice.call(document.querySelectorAll(".multi-cb")).filter(function (c) { return c.checked; });
  if (!incRoads && !uchecks.length) { alertNoData("roads or utilities"); return; }
  var qV = queryLayer(ADMIN_MS, LAYER_VILLAGE, Object.assign({
    where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 500
  }, geometryToQueryParams(qg)));
  var tasks = [qV];
  if (incRoads) {
    tasks.push(queryLayer(TRANS_MS, LAYER_ROADS_LINE, Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 250
    }, geometryToQueryParams(qg))));
  }
  uchecks.forEach(function (c) {
    tasks.push(queryLayer(c.getAttribute("data-url"), parseInt(c.getAttribute("data-layer"), 10), Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 200
    }, geometryToQueryParams(qg))).catch(function () { return { features: [] }; }));
  });
  Promise.all(tasks).then(function (results) {
    var villages = results[0].features || [];
    var idx = 1;
    var roadGeoms = [];
    if (incRoads) {
      (results[idx].features || []).forEach(function (f) {
        var g = toEngineSR(geomFromJSON(f.geometry));
        if (g) roadGeoms.push(g);
      });
      idx++;
    }
    var utilGeoms = [];
    for (var u = idx; u < results.length; u++) {
      (results[u].features || []).forEach(function (f) {
        var g = toEngineSR(geomFromJSON(f.geometry));
        if (g) utilGeoms.push(g);
      });
    }
    if (!villages.length) { alertNoData("villages"); return; }
    var okc = 0;
    villages.forEach(function (vf) {
      var vg = toEngineSR(geomFromJSON(vf.geometry));
      if (!vg) return;
      var pass = true;
      if (incRoads) {
        if (!roadGeoms.length) { pass = false; }
        else {
          var minR = Infinity;
          for (var r = 0; r < roadGeoms.length; r++) {
            var dr = geometryEngine.distance(vg, roadGeoms[r], "meters");
            if (dr < minR) minR = dr;
          }
          if (minR > maxD) pass = false;
        }
      }
      for (var ui = 0; ui < utilGeoms.length && pass; ui++) {
        if (geometryEngine.distance(vg, utilGeoms[ui], "meters") > maxD) pass = false;
      }
      if (pass && (incRoads || utilGeoms.length)) {
        resultsLayer.add(new Graphic({ geometry: projection.project(vg, SR_WEB), symbol: symVillage, attributes: vf.attributes }));
        okc++;
      }
    });
    if (!okc) alertNoData("multi-layer");
    else {
      var msgM = "Multi-layer: " + okc + " villages within " + maxD + " m of selected networks.";
      setStatus(msgM);
      publishAnalysisToolResult("multi-layer", msgM, { count: okc, maxDistanceM: maxD });
    }
  }).catch(function (e) {
    console.error(e);
    setStatus("Multi-layer analysis failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
  });
});

msmeBind("runSuitability", "click", function () {
  clearResults();
  var maxD = parseFloat(document.getElementById("suitDist").value) || 2000;
  var qg = activeQueryGeometry();
  Promise.all([
    queryLayer(ADMIN_MS, LAYER_VILLAGE, Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 500
    }, geometryToQueryParams(qg))),
    queryLayer(TRANS_MS, LAYER_ROADS_LINE, Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 250
    }, geometryToQueryParams(qg))),
    queryLayer(ENV_MS, LAYER_FOREST, Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: 200
    }, geometryToQueryParams(qg)))
  ]).then(function (results) {
    var villages = results[0].features || [];
    var roads = (results[1].features || []).map(function (f) { return toEngineSR(geomFromJSON(f.geometry)); }).filter(Boolean);
    var forests = (results[2].features || []).map(function (f) { return toEngineSR(geomFromJSON(f.geometry)); }).filter(Boolean);
    if (!villages.length || !roads.length) { alertNoData("villages or roads"); return; }
    var out = 0;
    villages.forEach(function (vf) {
      var vg = toEngineSR(geomFromJSON(vf.geometry));
      if (!vg) return;
      var minR = Infinity;
      for (var ri = 0; ri < roads.length; ri++) {
        var d = geometryEngine.distance(vg, roads[ri], "meters");
        if (d < minR) minR = d;
      }
      if (minR > maxD) return;
      var bad = false;
      for (var fi = 0; fi < forests.length; fi++) {
        if (geometryEngine.intersects(vg, forests[fi])) { bad = true; break; }
      }
      if (!bad) {
        resultsLayer.add(new Graphic({ geometry: projection.project(vg, SR_WEB), symbol: symSuitable, attributes: vf.attributes }));
        out++;
      }
    });
    if (!out) alertNoData("suitability");
    else {
      var msgS = "Suitability: " + out + " village polygon(s) within " + maxD + " m of roads, excluding forest overlap.";
      setStatus(msgS);
      publishAnalysisToolResult("suitability", msgS, { count: out, maxDistanceM: maxD });
    }
  }).catch(function (e) {
    console.error(e);
    setStatus("Suitability analysis failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
  });
});

view.on("pointer-move", function (evt) {
  projection.load().then(function () {
    var p = view.toMap(evt);
    var g = projection.project(p, new SpatialReference({ wkid: 4326 }));
    var el = document.getElementById("coordBar");
    if (el && g) el.textContent = "Lat " + g.y.toFixed(5) + "Ãƒâ€šÃ‚Â° Ãƒâ€šÃ‚Â· Lon " + g.x.toFixed(5) + "Ãƒâ€šÃ‚Â°";
  });
});

var selectParcelToolActive = false;

function setSelectParcelTool(on) {
  selectParcelToolActive = !!on;
  var b = document.getElementById("btnSelectTool");
  if (b) {
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  }
  if (view && view.container) {
    view.container.style.cursor = on ? "crosshair" : "";
  }
  if (on) {
    bufferMarkModeActive = false;
    var bbm0 = document.getElementById("btnBufferMarkPoint");
    if (bbm0) bbm0.classList.remove("active");
    setStatus("Select tool ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â click the map. Results appear in the left panel with distances.");
  }
}

(function bufferMarkUi() {
  var bMark = document.getElementById("btnBufferMarkPoint");
  var bClr = document.getElementById("btnBufferClearMark");
  if (bMark) {
    bMark.addEventListener("click", function () {
      bufferMarkModeActive = !bufferMarkModeActive;
      bMark.classList.toggle("active", bufferMarkModeActive);
      if (bufferMarkModeActive) {
        setSelectParcelTool(false);
        if (view && view.container) view.container.style.cursor = "crosshair";
        setStatus("Click the map to place the buffer anchor point.");
      } else if (view && view.container) view.container.style.cursor = "";
    });
  }
  if (bClr) {
    bClr.addEventListener("click", function () {
      bufferMarkPoint32643 = null;
      bufferMarkLayer.removeAll();
      bufferMarkModeActive = false;
      if (bMark) bMark.classList.remove("active");
      if (view && view.container) view.container.style.cursor = "";
      setStatus("Buffer anchor cleared.");
    });
  }
})();

/**
 * When identify returns cadastral polygon(s), prefer the smallest polygon (usually parcel vs village/district).
 * Sets lastCadParcel32643 so ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œNearby + distancesÃƒÂ¢Ã¢â€šÂ¬Ã‚Â works without using the dropdowns.
 */
window.msmeGisZoomToGeometry = function (geomJson) {
  if (!geomJson) return Promise.resolve();
  try {
    var g = jsonUtils.fromJSON(geomJson);
    if (!g) return Promise.resolve();
    coerceMissingSpatialReference(g, SR_WEB);
    return zoomToGeometry(g);
  } catch (e) {
    console.error(e);
    return Promise.resolve();
  }
};
window.msmeGisMeasureToGeometry = function (geomJson) {
  if (!geomJson) {
    window.alert("No feature geometry for measure.");
    return;
  }
  if (!lastIdentifyAnchor32643) {
    window.alert("Click the map to identify first. Distance is from that click to the feature (straight-line, meters).");
    return;
  }
  try {
    var g = jsonUtils.fromJSON(geomJson);
    var g326 = toEngineSR(g);
    if (!g326) return;
    var d = geometryEngine.distance(lastIdentifyAnchor32643, g326, "meters");
    window.alert("Straight-line distance from last identify point: " + Math.round(d) + " m");
  } catch (e2) {
    console.error(e2);
  }
};

function applyCadastralIdentifyToParcelWorkflow(cadResults) {
  if (!cadResults || !cadResults.length) return false;
  var candidates = [];
  cadResults.forEach(function (res) {
    var gj = res.feature && res.feature.geometry;
    var g = gj ? geomFromJSON(gj) : null;
    if (!geometryIsUsable(g)) return;
    var g32643 = toEngineSR(g);
    if (!g32643) return;
    var ext = g32643.extent;
    var area = ext ? Math.abs(ext.width * ext.height) : Infinity;
    candidates.push({ g: g32643, area: area, attrs: (res.feature && res.feature.attributes) || {} });
  });
  if (!candidates.length) return false;
  candidates.sort(function (a, b) { return a.area - b.area; });
  var pick = candidates[0];
  lastCadParcel32643 = pick.g;
  cadParcelLayer.removeAll();
  projection.load().then(function () {
    var gWeb = projection.project(pick.g, SR_WEB);
    cadParcelLayer.add(new Graphic({ geometry: gWeb, symbol: symCadParcel, attributes: pick.attrs }));
  });
  ensureCadastralMapVisible();
  return true;
}

var sketchVM = null;
var __leafLayerCache = {};

function clearConnectorGraphics() {
  connectorLayer.removeAll();
}

function getLeafFeatureLayersForSketch(url) {
  if (__leafLayerCache[url]) return Promise.resolve(__leafLayerCache[url]);
  return requestArcGisJson(url + "?f=json", { responseType: "json" }).then(function (res) {
    var layers = (res.data && res.data.layers) || [];
    var out = layers.filter(function (ly) {
      if (ly.subLayerIds && ly.subLayerIds.length) return false;
      return ly.type === "Feature Layer" && ly.geometryType && String(ly.geometryType).indexOf("esriGeometry") === 0;
    }).slice(0, 5);
    __leafLayerCache[url] = out;
    return out;
  }).catch(function () { return []; });
}

function querySketchIntersection(g32643) {
  if (!g32643) return Promise.resolve([]);
  var urls = IDENTIFY_URLS.slice();
  return Promise.all(urls.map(function (url) {
    return getLeafFeatureLayersForSketch(url).then(function (lyList) {
      return Promise.all(lyList.map(function (ly) {
        return queryLayer(url, ly.id, Object.assign({
          where: "1=1",
          outFields: "*",
          returnGeometry: true,
          resultRecordCount: 20
        }, geometryToQueryParams(g32643))).then(function (data) {
          return (data.features || []).map(function (f) {
            var oid = (f.attributes && (f.attributes.OBJECTID != null ? f.attributes.OBJECTID : f.attributes.FID)) || "";
            return {
              layerName: (ly.name || "Layer") + (oid !== "" ? " #" + oid : ""),
              layerId: ly.id,
              feature: f,
              _identifyUrl: url
            };
          });
        }).catch(function () { return []; });
      })).then(function (chunks) { return [].concat.apply([], chunks); });
    });
  })).then(function (parts) {
    return [].concat.apply([], parts);
  });
}

function drawConnectorBetweenFeatures(anchor32643, targetGeom32643) {
  connectorLayer.removeAll();
  if (!anchor32643 || !targetGeom32643) return;
  try {
    var dest = targetGeom32643.type === "point" ? targetGeom32643 : getGeometryCentroid(targetGeom32643);
    if (!dest) return;
    var dM = Math.round(geometryEngine.distance(anchor32643, dest, "meters"));
    var line = new Polyline({
      paths: [[[anchor32643.x, anchor32643.y], [dest.x, dest.y]]],
      spatialReference: SR_METER
    });
    var lineW = projection.project(line, SR_WEB);
    connectorLayer.add(new Graphic({
      geometry: lineW,
      symbol: new SimpleLineSymbol({ color: [200, 100, 0, 0.95], width: 2, style: "short-dash" })
    }));
    var midPt = new Point({
      x: (anchor32643.x + dest.x) / 2,
      y: (anchor32643.y + dest.y) / 2,
      spatialReference: SR_METER
    });
    var midW = projection.project(midPt, SR_WEB);
    connectorLayer.add(new Graphic({
      geometry: midW,
      symbol: new TextSymbol({
        text: String(dM) + " m",
        color: [20, 20, 20, 1],
        font: { size: 11, weight: "bold" },
        haloColor: [255, 255, 255, 0.95],
        haloSize: 1
      })
    }));
  } catch (eC) {
    console.warn("[connector]", eC);
  }
}

function maybeDrawConnectorFromFlat(anchor32643, flat) {
  if (!flat || !flat.length) return;
  var hit = flat.find(function (r) {
    var gj = r.feature && r.feature.geometry;
    var g = gj ? geomFromJSON(gj) : null;
    return g && geometryIsUsable(g);
  });
  if (!hit) return;
  var g = geomFromJSON(hit.feature.geometry);
  coerceMissingSpatialReference(g, SR_WEB);
  var g326 = toEngineSR(g);
  drawConnectorBetweenFeatures(anchor32643, g326);
}

function highlightSketchSelection(flat) {
  selectionHighlightLayer.removeAll();
  if (!flat || !flat.length) return;
  var prim = pickIdentifyHitsForHighlight(flat, 12);
  (prim.length ? prim : flat.filter(function (r) { return !isBoundaryLayerName(r.layerName); }).slice(0, 3)).forEach(function (res) {
    var gj = res.feature && res.feature.geometry;
    var g = gj ? geomFromJSON(gj) : null;
    if (!g) return;
    var gView = g.spatialReference && g.spatialReference.wkid === 3857 ? g : projection.project(g, SR_WEB);
    var sym = symBuffer;
    if (g.type === "point") sym = symPoint;
    else if (g.type === "polyline") sym = symLineHit;
    selectionHighlightLayer.add(new Graphic({ geometry: gView, symbol: sym, attributes: res.feature.attributes || {} }));
  });
}

function finalizeIdentifyResults(anchor32643, mapPoint, flat, selectionSource) {
  if (selectionSource === "sketch" || selectionSource === "hsvp") {
    mapIdentifyClickSessions = [];
  } else if (selectionSource === "map-click" && !mapSelectionAccumulateMode) {
    mapIdentifyClickSessions = [];
  }

  var cadHits = flat.filter(function (r) { return r._identifyUrl === CAD_MS; });
  var cadParcelPicked = false;
  if (!(mapSelectionAccumulateMode && selectionSource === "map-click")) {
    cadParcelPicked = applyCadastralIdentifyToParcelWorkflow(cadHits);
  }
  ensureParcelAnchorFromIdentify(flat, anchor32643.type === "point" ? anchor32643 : null);

  identifyLayer.removeAll();
  var mergedForHi = getMergedFlatForHighlight(flat, selectionSource);
  var toHighlight = pickIdentifyHitsForHighlight(mergedForHi, 28);
  toHighlight.forEach(function (res) {
    if (cadParcelPicked && res._identifyUrl === CAD_MS) return;
    var gj = res.feature && res.feature.geometry;
    var g = gj ? geomFromJSON(gj) : null;
    if (!g) return;
    var gView = g.spatialReference && g.spatialReference.wkid === 3857 ? g : projection.project(g, SR_WEB);
    var sym = symBuffer;
    if (g.type === "point") sym = symPoint;
    else if (g.type === "polyline") sym = symLineHit;
    identifyLayer.add(new Graphic({
      geometry: gView,
      symbol: sym,
      attributes: res.feature.attributes || {}
    }));
  });

  var ll = projection.project(mapPoint, SR4326);
  var lat = ll.y;
  var lon = ll.x;
  var atClickRows = [];
  flat.slice(0, 64).forEach(function (res) {
    if (isBoundaryLayerName(res.layerName)) return;
    var layerLabel = res.layerName || ("Layer " + (res.layerId != null ? res.layerId : ""));
    var gj = res.feature && res.feature.geometry;
    var g = gj ? geomFromJSON(gj) : null;
    var th = themeKeyFromUrl(res._identifyUrl);
    if (!g || !geometryIsUsable(g)) {
      atClickRows.push({ layer: layerLabel, dM: null, geomJson: gj || null, theme: th });
      return;
    }
    coerceMissingSpatialReference(g, SR_WEB);
    var g32643 = toEngineSR(g);
    var dM = distanceFromPointToGeometry(anchor32643, g32643);
    if (dM != null && dM > 5e6) dM = null;
    atClickRows.push({ layer: layerLabel, dM: dM, geomJson: gj, theme: th });
  });

  var radiusM = 3000;
  try {
    var elR = document.getElementById("cadNearM");
    if (elR) radiusM = parseInt(elR.value, 10) || 3000;
  } catch (e2) {}

  return queryNearbyRowsFromPoint(anchor32643, radiusM).then(function (nearbyRows) {
    mapIdentifyClickSessions.push({
      flat: flat,
      anchor32643: anchor32643,
      mapPoint: mapPoint,
      lat: lat,
      lon: lon,
      radiusM: radiusM,
      atClickRows: atClickRows,
      nearbyRows: nearbyRows
    });
    var clicksPayload = mapIdentifyClickSessions.map(function (s, idx) {
      return {
        clickIndex: idx + 1,
        lat: s.lat,
        lon: s.lon,
        radiusM: s.radiusM,
        atClickRows: s.atClickRows,
        nearbyRows: s.nearbyRows
      };
    });
    publishMapSelectionReportSnapshot({
      generatedAt: new Date().toISOString(),
      reportKind: "map-selection",
      selectionSource: selectionSource || "map-click",
      accumulate: mapSelectionAccumulateMode,
      clicks: clicksPayload,
      lat: lat,
      lon: lon,
      radiusM: radiusM,
      atClickRows: atClickRows,
      nearbyRows: nearbyRows,
      domContext: {}
    });
    try {
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("gis-identify-table", {
          detail: {
            lat: lat,
            lon: lon,
            atClickRows: atClickRows,
            nearbyRows: nearbyRows,
            radiusM: radiusM,
            clicks: clicksPayload,
            accumulate: mapSelectionAccumulateMode
          }
        }));
      }
    } catch (e3) { console.warn(e3); }
    try {
      var primaryNb = flat.filter(function (r) { return !isBoundaryLayerName(r.layerName); });
      var popName = "";
      var popDist = null;
      if (primaryNb.length) {
        var pr = primaryNb[0];
        popName = pr.layerName || "";
        var gjp = pr.feature && pr.feature.geometry;
        var gp = gjp ? geomFromJSON(gjp) : null;
        if (gp && geometryIsUsable(gp)) {
          coerceMissingSpatialReference(gp, SR_WEB);
          var gp326 = toEngineSR(gp);
          popDist = distanceFromPointToGeometry(anchor32643, gp326);
          if (popDist != null && popDist > 5e6) popDist = null;
        }
      } else if (flat.length) {
        popName = "Administrative boundary";
      }
      var popupHtml = buildSimpleIdentifyPopupHtml(lat, lon, popName, popDist, gisPh("mapPopupTitle"));
      if (view.popup && mapPoint) {
        view.popup.open({
          title: "",
          content: popupHtml,
          location: mapPoint
        });
      }
    } catch (ePop) {
      console.warn("[popup]", ePop);
    }
    var flatConn = flat.filter(function (r) { return !isBoundaryLayerName(r.layerName); });
    maybeDrawConnectorFromFlat(anchor32643, flatConn.length ? flatConn : flat);
    if (selectionSource === "sketch") {
      highlightSketchSelection(flat);
    }
    var accHint = mapSelectionAccumulateMode ? " Multi-select on ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â click again to add, then ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œUse map selection for analysisÃƒÂ¢Ã¢â€šÂ¬Ã‚Â." : "";
    setStatus("Identified " + flat.length + " hit(s); distances in the results panel (within " + radiusM + " m nearby)." + accHint);
    if (selectParcelToolActive) {
      setSelectParcelTool(false);
    }
  });
}

function initSketchViewModel() {
  if (sketchVM) return;
  sketchVM = new SketchViewModel({
    view: view,
    layer: sketchLayer,
    polygonSymbol: new SimpleFillSymbol({
      color: [40, 120, 220, 0.22],
      outline: new SimpleLineSymbol({ color: [0, 90, 200, 1], width: 2 })
    }),
    polylineSymbol: new SimpleLineSymbol({ color: [0, 90, 200, 1], width: 3 }),
    pointSymbol: new SimpleMarkerSymbol({
      style: "circle",
      size: 11,
      color: [0, 90, 200, 1],
      outline: { color: [255, 255, 255], width: 1 }
    })
  });
  sketchVM.on("create", function (ev) {
    if (ev.state !== "complete" || !ev.graphic) return;
    var geom = ev.graphic.geometry;
    projection.load().then(function () {
      var g326 = toEngineSR(geom);
      if (!g326) {
        setStatus("Could not use sketch geometry.");
        return;
      }
      var anchor32643 = g326.type === "point" ? g326 : getGeometryCentroid(g326);
      if (!anchor32643) {
        setStatus("Sketch has no usable anchor.");
        return;
      }
      lastIdentifyAnchor32643 = anchor32643;
      identifyLayer.removeAll();
      selectionHighlightLayer.removeAll();
      connectorLayer.removeAll();
      var mapPointW = projection.project(anchor32643, SR_WEB);
      setStatus("Finding features in your sketchÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦");
      return querySketchIntersection(g326).then(function (flat) {
        if (!flat.length) {
          setStatus("No features intersect the sketch ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â try a larger shape or zoom.");
          return;
        }
        return finalizeIdentifyResults(anchor32643, mapPointW, flat, "sketch");
      });
    }).catch(function (e) {
      console.error(e);
      setStatus("Sketch processing failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
    });
  });
}

window.msmeGisStartSketch = function (mode) {
  initSketchViewModel();
  setSelectParcelTool(false);
  bufferMarkModeActive = false;
  var bbm = document.getElementById("btnBufferMarkPoint");
  if (bbm) bbm.classList.remove("active");
  if (view && view.container) view.container.style.cursor = "";
  var tool = "polygon";
  if (mode === "point") tool = "point";
  else if (mode === "polyline" || mode === "line") tool = "polyline";
  else if (mode === "rectangle") tool = "rectangle";
  else if (mode === "circle") tool = "circle";
  else if (mode === "polygon" || mode === "free") tool = "polygon";
  sketchLayer.removeAll();
  sketchVM.create(tool);
  setStatus("Draw on the map to finish (" + tool + "). Results + connector will update when complete.");
};

window.msmeGisActivateIdentifyMode = function () {
  if (sketchVM) sketchVM.cancel();
  setSelectParcelTool(true);
  setStatus("Identify mode ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â click the map for features.");
};

window.msmeGisSetMapMultiSelectMode = function (on) {
  mapSelectionAccumulateMode = !!on;
  var b = document.getElementById("btnMapMultiSelect");
  if (b) {
    b.classList.toggle("active", mapSelectionAccumulateMode);
    b.setAttribute("aria-pressed", mapSelectionAccumulateMode ? "true" : "false");
  }
  setStatus(
    mapSelectionAccumulateMode
      ? "Multi-select on ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â each click adds features. Use ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œApply map selection to analysisÃƒÂ¢Ã¢â€šÂ¬Ã‚Â when ready."
      : "Multi-select off ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â the next identify replaces the previous."
  );
};

window.msmeGisApplyMapSelectionToAnalysis = function () {
  var merged = [];
  mapIdentifyClickSessions.forEach(function (s) {
    merged = merged.concat(s.flat || []);
  });
  userMapAnalysisGeometry32643 = computeUnionGeometryFromFlats(merged);
  if (!userMapAnalysisGeometry32643) {
    setStatus("No usable feature geometry in the map selection ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â identify features first.");
    publishAnalysisReportSnapshot({
      generatedAt: new Date().toISOString(),
      reportKind: "analysis",
      tool: "map-selection-pin",
      summary: "Could not build study geometry from map selection."
    });
    return;
  }
  var nFeat = 0;
  merged.forEach(function (r) {
    if (!isBoundaryLayerName(r.layerName)) nFeat++;
  });
  publishAnalysisReportSnapshot({
    generatedAt: new Date().toISOString(),
    reportKind: "analysis",
    tool: "map-selection-pin",
    summary: "Buffer / proximity / intersect tools now use the union of " + nFeat + " map hit(s).",
    featureCount: nFeat
  });
  setStatus("Spatial analysis tools will use your combined map selection ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â run buffer, proximity, or other tools.");
};

window.msmeGisClearMapSelection = function () {
  if (sketchVM) sketchVM.cancel();
  sketchLayer.removeAll();
  selectionHighlightLayer.removeAll();
  connectorLayer.removeAll();
  identifyLayer.removeAll();
  mapIdentifyClickSessions = [];
  userMapAnalysisGeometry32643 = null;
  lastCadHierarchyGeom32643 = null;
  mapSelectionAccumulateMode = false;
  var bMs = document.getElementById("btnMapMultiSelect");
  if (bMs) {
    bMs.classList.remove("active");
    bMs.setAttribute("aria-pressed", "false");
  }
  setStatus("Selection graphics cleared.");
};

(function wireMapSelectionRailButtons() {
  var bM = document.getElementById("btnMapMultiSelect");
  var bA = document.getElementById("btnMapSelToAnalysis");
  if (bM) {
    bM.addEventListener("click", function () {
      window.msmeGisSetMapMultiSelectMode(!mapSelectionAccumulateMode);
    });
  }
  if (bA) {
    bA.addEventListener("click", function () {
      window.msmeGisApplyMapSelectionToAnalysis();
    });
  }
})();

view.on("click", function (event) {
  if (sketchVM && sketchVM.state === "active") return;
  if (bufferMarkModeActive) {
    projection.load().then(function () {
      bufferMarkPoint32643 = projection.project(event.mapPoint, SR_METER);
      bufferMarkModeActive = false;
      var bbm = document.getElementById("btnBufferMarkPoint");
      if (bbm) bbm.classList.remove("active");
      bufferMarkLayer.removeAll();
      var gw = projection.project(bufferMarkPoint32643, SR_WEB);
      bufferMarkLayer.add(new Graphic({ geometry: gw, symbol: symBufferMark }));
      setStatus("Buffer anchor point set ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â adjust search radius, then Run buffer.");
      if (view && view.container) view.container.style.cursor = "";
    }).catch(function (err) { console.error(err); });
    return;
  }
  if (!mapSelectionAccumulateMode) {
    identifyLayer.removeAll();
    lastCadParcel32643 = null;
    cadParcelLayer.removeAll();
    mapIdentifyClickSessions = [];
  }
  var mapPoint = event.mapPoint;
  var identifyTolerance = selectParcelToolActive ? 10 : 8;

  projection.load().then(function () {
    var anchor32643 = projection.project(mapPoint, SR_METER);
    lastIdentifyAnchor32643 = anchor32643;
    return Promise.all(IDENTIFY_URLS.map(function (url) {
      var params = new IdentifyParameters();
      params.geometry = mapPoint;
      params.mapExtent = view.extent;
      params.width = view.width;
      params.height = view.height;
      params.tolerance = identifyTolerance;
      params.layerOption = "all";
      params.returnGeometry = true;
      params.spatialReference = view.spatialReference;
      return identify(url, params).catch(function () { return { results: [] }; }).then(function (identifyResult) {
        var arr = [];
        if (Array.isArray(identifyResult)) arr = identifyResult;
        else if (identifyResult && identifyResult.results) arr = identifyResult.results;
        arr.forEach(function (r) { r._identifyUrl = url; });
        return arr;
      });
    })).then(function (all) {
      var flat = [];
      all.forEach(function (arr) {
        if (arr && arr.length) flat = flat.concat(arr);
      });
      return finalizeIdentifyResults(anchor32643, mapPoint, flat, "map-click");
    });
  }).catch(function (e) {
    console.error(e);
    setStatus("Identify failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
  });
});

/** Full teardown for React remount / HMR: widgets + sketch VM, then MapView (partial destroy left tools broken). */
if (typeof window !== "undefined") {
  window.__msmeGisCleanup = function () {
    window.__msmeGisInitialized = false;
    window.__msmeGisInitInProgress = false;
    try {
      document.removeEventListener("keydown", msmeGisKeydownEsc);
    } catch (eK) {}
    try {
      if (sketchVM && typeof sketchVM.destroy === "function") sketchVM.destroy();
    } catch (e0) {}
    sketchVM = null;
    try {
      if (basemapGallery && typeof basemapGallery.destroy === "function") basemapGallery.destroy();
    } catch (eG) {}
    try {
      if (bgExpand && typeof bgExpand.destroy === "function") bgExpand.destroy();
    } catch (eE) {}
    try {
      if (layerList && typeof layerList.destroy === "function") layerList.destroy();
    } catch (e1) {}
    try {
      if (legend && typeof legend.destroy === "function") legend.destroy();
    } catch (e2) {}
    try {
      if (view && typeof view.destroy === "function" && !view.destroyed) view.destroy();
    } catch (e3) {}
  };
}

projection.load().then(function () {
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  return fixAdminScales();
}).then(function () {
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  return buildCadastralLayerIndex();
}).then(function () {
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  return loadDistricts();
}).then(function () {
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  view.extent = getInitialMapExtent();
  refreshMapViewPadding();
  view.when(function () {
    if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
    refreshMapViewPadding();
    initSketchViewModel();
  });
  if (typeof window !== "undefined" && window.__msmeGisBootId === myBootId) {
    window.__msmeGisInitialized = true;
    window.__msmeGisInitInProgress = false;
  }
  setStatus("Ready. Haryana administrative boundaries are loaded; open Layers to load additional map services.");
}).catch(function (e) {
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  if (typeof window !== "undefined" && window.__msmeGisBootId === myBootId) {
    window.__msmeGisInitialized = false;
    window.__msmeGisInitInProgress = false;
  }
  console.error(e);
  if (isGateway502Error(e)) {
    setStatus("Load error: ArcGIS service/proxy unreachable (502). Check server/proxy.");
  } else {
    setStatus("Load error - see console.");
  }
});
}



