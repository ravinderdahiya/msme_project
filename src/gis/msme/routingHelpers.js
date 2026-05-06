import Point from "@arcgis/core/geometry/Point.js";
import * as projection from "@arcgis/core/geometry/projection";
import esriConfig from "@arcgis/core/config.js";

import { SR_METER, SR_WEB, SR4326 } from "./spatialRefs.js";
import { geomFromJSON, ensureSR32643, toEngineSR } from "./geometryUtils.js";

export function getEsriRouteSolveUrl() {
  var base = (esriConfig.routeServiceUrl || "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World").replace(/\/$/, "");
  return base.indexOf("solve") !== -1 ? base : base + "/solve";
}

export function hasArcGisRoutingApiKey() {
  return !!(esriConfig && esriConfig.apiKey);
}

export function routeServiceNeedsApiKey(solveUrl) {
  var u = String(solveUrl || "").toLowerCase();
  return u.indexOf("route-api.arcgis.com") >= 0;
}

export function isRoutingAuthError(err) {
  if (!err) return false;
  try {
    var d = err.details || {};
    var hs = Number(d.httpStatus || d.status || d.code);
    if (hs === 401 || hs === 403 || hs === 498 || hs === 499) return true;
  } catch (e0) {}
  var m = String((err && err.message) || "");
  return /api\s*key|token required|unauthorized|forbidden|not authorized|status:?\s*(401|403|498|499)/i.test(m);
}

export function isValidWgsLatLon(lat, lon) {
  return isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

export function coerceLocationToWgs(loc) {
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

export function planarDistanceMeters(ax, ay, bx, by) {
  var dx = Number(bx) - Number(ax);
  var dy = Number(by) - Number(ay);
  return Math.sqrt(dx * dx + dy * dy);
}

export function buildRoadGraph(features, mergeToleranceM) {
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

export function findNearestGraphNode(graph, point32643, maxSnapM) {
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

export function shortestPathRoadGraph(graph, startKey, endKey) {
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

export function compactPathCoords(pathCoords) {
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

export function buildRoutePinDataUrl(primaryHex, secondaryHex) {
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

export function shortRouteLabelText(text, maxLen) {
  var s = String(text == null ? "" : text).trim();
  if (!s) return "";
  var lim = Number(maxLen);
  if (!isFinite(lim) || lim <= 0) lim = 28;
  if (s.length <= lim) return s;
  return s.slice(0, Math.max(3, lim - 1)).trim() + "…";
}
