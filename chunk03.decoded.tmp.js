p.classList.contains("collapsed")) return;
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
bindRange("closestDist", "closestDistVal");
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
  color: [33, 150, 243, 0.18],
  outline: new SimpleLineSymbol({ color: [13, 71, 161, 1], width: 3 })
});
var symBufferMark = new SimpleMarkerSymbol({
  style: "diamond",
  color: [176, 32, 93, 0.95],
  size: 12,
  outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1.5 })
});
var symCommunityZoomMark = new SimpleMarkerSymbol({
  style: "circle",
  color: [20, 104, 170, 0.95],
  size: 14,
  outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 2 })
});
var communityZoomMarkGraphic = null;
var communityZoomLabelGraphic = null;

function clearResults() { resultsLayer.removeAll(); }

function clearCommunityZoomGraphic() {
  try {
    if (communityZoomMarkGraphic) identifyLayer.remove(communityZoomMarkGraphic);
  } catch (e0) {}
  try {
    if (communityZoomLabelGraphic) identifyLayer.remove(communityZoomLabelGraphic);
  } catch (e1) {}
  communityZoomMarkGraphic = null;
  communityZoomLabelGraphic = null;
}

function addCommunityZoomGraphic(ptWeb, labelText) {
  if (!ptWeb) return;
  clearCommunityZoomGraphic();
  communityZoomMarkGraphic = new Graphic({
    geometry: ptWeb,
    symbol: symCommunityZoomMark
  });
  identifyLayer.add(communityZoomMarkGraphic);

  var txt = String(labelText || "").trim();
  if (!txt) return;
  communityZoomLabelGraphic = new Graphic({
    geometry: ptWeb,
    symbol: new TextSymbol({
      text: txt,
      color: "#0f3b63",
      haloColor: "#ffffff",
      haloSize: 1.3,
      yoffset: -18,
      font: { size: 11, family: "Segoe UI", weight: "700" }
    })
  });
  identifyLayer.add(communityZoomLabelGraphic);
}

function resolveBufferCenterPoint32643() {
  if (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") {
    return bufferMarkPoint32643;
  }
  var ctx = lastBufferExportContext || {};
  var candidates = [ctx.summaryGeometryJson, ctx.queryGeometryJson];
  for (var i = 0; i < candidates.length; i++) {
    var gj = candidates[i];
    if (!gj) continue;
    try {
      var g = geomFromJSON(gj);
      if (!g) continue;
      var g326 = to32643WithSmartFallback(g, g.spatialReference || SR_METER);
      if (!g326) continue;
      if (g326.type === "point") return g326;
      var ctr = getGeometryCentroid(g326);
      if (ctr && ctr.type === "point") return ctr;
    } catch (e0) {}
  }
  return null;
}

function resolveCommunityConnectorAnchor32643() {
  var anchor = resolveBufferCenterPoint32643();
  if (anchor && anchor.type === "point") return anchor;

  var areaCandidates = [
    userMapAnalysisGeometry32643,
    lastCadParcel32643,
    lastCadHierarchyGeom32643,
    selectedVillageGeom,
    selectedTehsilGeom,
    selectedDistrictGeom
  ];
  for (var i = 0; i < areaCandidates.length; i++) {
    var g0 = areaCandidates[i];
    if (!g0 || !geometryIsUsable(g0)) continue;
    var g326 = toEngineSR(ensureSR32643(g0));
    if (!g326) continue;
    if (g326.type === "point") return g326;
    var ctr = getGeometryCentroid(g326);
    if (ctr && ctr.type === "point") return ctr;
  }

  if (view && view.center) {
    try {
      var c326 = to32643WithSmartFallback(view.center, view.center.spatialReference || SR_WEB);
      if (c326 && c326.type === "point") return c326;
    } catch (e0) {}
  }
  return null;
}

function drawCommunityCategoryConnectors(detail) {
  if (!detail) return Promise.resolve(false);
  var category = String(detail.category || "locations").toLowerCase();
  var label = String(detail.label || category);
  var allItems = Array.isArray(detail.items) ? detail.items : [];
  var anchor = resolveCommunityConnectorAnchor32643();

  if (!anchor || anchor.type !== "point") {
    setStatus("Center point available nahi hai. Pehle buffer ya area select karein.");
    return Promise.resolve(false);
  }

  if (!allItems.length) {
    clearConnectorGraphics();
    setStatus("No " + label + " locations available for center connection.");
    return Promise.resolve(false);
  }

  function toPointFromItem(item) {
    if (!item) return null;
    var lat = Number(item.lat);
    var lng = Number(item.lng);
    if (!isFinite(lat) || !isFinite(lng)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    var p4326 = new Point({ x: lng, y: lat, spatialReference: SR4326 });
    var p326 = projection.project(p4326, SR_METER) || null;
    var pWeb = projection.project(p4326, SR_WEB) || null;
    if (!p326 || !pWeb) return null;
    return { p326: p326, pWeb: pWeb };
  }
  function resolveItemLabelText(item, fallbackIndex) {
    var src = (item && item.item) ? item.item : item;
    var raw =
      (item && (item.name || item.label || item.title || item.Name)) ||
      (src && (src.name || src.Name || src.label || src.title || src.itiName || src.iti_name)) ||
      ("Location " + String((fallbackIndex || 0) + 1));
    return shortRouteLabelText(raw, 34);
  }

  function resolveConnectorStyle(catKey) {
    var cat = String(catKey || "").toLowerCase();
    if (cat === "hospitals") {
      return {
        markerColor: [239, 68, 68, 0.95],
        lineColor: [220, 38, 38, 0.9]
      };
    }
    if (cat === "schools") {
      return {
        markerColor: [59, 130, 246, 0.95],
        lineColor: [37, 99, 235, 0.9]
      };
    }
    return {
      markerColor: [103, 80, 164, 0.95],
      lineColor: [124, 58, 237, 0.9]
    };
  }
  function polylineLengthMetersFromCoords(pathCoords) {
    if (!Array.isArray(pathCoords) || pathCoords.length < 2) return 0;
    var sum = 0;
    for (var i = 1; i < pathCoords.length; i++) {
      var a = pathCoords[i - 1];
      var b = pathCoords[i];
      if (!a || !b || a.length < 2 || b.length < 2) continue;
      var dx = Number(b[0]) - Number(a[0]);
      var dy = Number(b[1]) - Number(a[1]);
      if (!isFinite(dx) || !isFinite(dy)) continue;
      sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
  }
  function getDistanceTextForItem(v) {
    if (!v) return "";
    var m = Number(v.routeMeters);
    if (!isFinite(m) || m <= 0) m = Number(v.directMeters);
    if (!isFinite(m) || m <= 0) return "";
    return "Radius: " + formatDistanceLabel(m);
  }
  var markerSymbolCache = {};
  function getMarkerSymbolForCategory(catKey) {
    var k = String(catKey || "default").toLowerCase();
    if (markerSymbolCache[k]) return markerSymbolCache[k];
    var style = resolveConnectorStyle(k);
    markerSymbolCache[k] = new SimpleMarkerSymbol({
      style: "circle",
      color: style.markerColor,
      size: 8,
      outline: new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 1.5 })
    });
    return markerSymbolCache[k];
  }

  clearConnectorGraphics();
  clearCommunityZoomGraphic();
  routeLineLayer.removeAll();

  var minX = anchor.x;
  var minY = anchor.y;
  var maxX = anchor.x;
  var maxY = anchor.y;
  var validItems = [];
  var validCount = 0;
  var skipped = 0;
  var maxRender = 80;
  var limit = Math.min(allItems.length, maxRender);

  for (var i = 0; i < limit; i++) {
    var item = allItems[i];
    var itemCategory = String((item && item.category) || category || "locations").toLowerCase();
    var itemStyle = resolveConnectorStyle(itemCategory);
    var pt = toPointFromItem(item);
    if (!pt) {
      skipped++;
      continue;
    }
    var dest = pt.p326;
    var dM = geometryEngine.distance(anchor, dest, "meters");
    if (!isFinite(dM)) {
      skipped++;
      continue;
    }
    validItems.push({
      item: item,
      category: itemCategory,
      style: itemStyle,
      p326: dest,
      pWeb: pt.pWeb,
      labelText: resolveItemLabelText(item, i),
      directMeters: dM,
      routeMeters: dM
    });

    minX = Math.min(minX, dest.x);
    minY = Math.min(minY, dest.y);
    maxX = Math.max(maxX, dest.x);
    maxY = Math.max(maxY, dest.y);
    validCount++;
  }

  if (!validCount) {
    setStatus("No valid " + label + " coordinates found for center connection.");
    return Promise.resolve(false);
  }

  if (validItems.length === 1) {
    var onlyItem = validItems[0];
    var onlyLabel = deriveCommunityZoomLabel({ item: onlyItem.item });
    return routeFromAnchorToTarget(anchor, onlyItem.p326, {
      fromLabel: "Selected area",
      toLabel: onlyLabel
    }).then(function (routed) {
      if (routed) {
        addPoiEndpointGraphic(onlyItem);
        setStatus("Showing " + label + " route from center.");
        return true;
      }
      drawStraightFallback(onlyItem);
      addAnchorStartGraphic();
      addPoiEndpointGraphic(onlyItem);
      setStatus("Route not available, showing direct line for " + label + ".");
      return true;
    });
  }

  var maxDirectMeters = 0;
  validItems.forEach(function (v) {
    if (isFinite(v.directMeters) && v.directMeters > maxDirectMeters) maxDirectMeters = v.directMeters;
  });
  var padM = Math.max(3000, Math.min(32000, (isFinite(maxDirectMeters) ? maxDirectMeters : 2500) * 1.2));
  var routeQueryExtent = new Extent({
    xmin: minX - padM,
    ymin: minY - padM,
    xmax: maxX + padM,
    ymax: maxY + padM,
    spatialReference: SR_METER
  });

  function drawStraightFallback(targetItem) {
    var line = new Polyline({
      paths: [[[anchor.x, anchor.y], [targetItem.p326.x, targetItem.p326.y]]],
      spatialReference: SR_METER
    });
    var lineW = projection.project(line, SR_WEB);
    if (!lineW) return false;
    connectorLayer.add(new Graphic({
      geometry: lineW,
      symbol: new SimpleLineSymbol({
        color: targetItem.style.lineColor,
        width: 1.6,
        style: "short-dash"
      })
    }));
    targetItem.routeMeters = targetItem.directMeters;
    return true;
  }

  function addAnchorStartGraphic() {
    var aWeb = projection.project(anchor, SR_WEB) || null;
    if (!aWeb) return;
    connectorLayer.add(new Graphic({
      geometry: aWeb,
      symbol: {
        type: "picture-marker",
        url: routeStartMarkerUrl,
        width: "24px",
        height: "30px",
        yoffset: "15px"
      }
    }));
  }

  function addPoiEndpointGraphic(v) {
    if (!v || !v.pWeb) return;
    connectorLayer.add(new Graphic({
      geometry: v.pWeb,
      symbol: {
        type: "picture-marker",
        url: routeEndMarkerUrl,
        width: "24px",
        height: "30px",
        yoffset: "15px"
      }
    }));
    var distTxt = getDistanceTextForItem(v);
    if (v.labelText || distTxt) {
      var txt = String(v.labelText || "");
      if (distTxt) txt = txt ? (txt + "\n" + distTxt) : distTxt;
      connectorLayer.add(new Graphic({
        geometry: v.pWeb,
        symbol: new TextSymbol({
          text: txt,
          color: [12, 42, 84, 1],
          haloColor: [255, 255, 255, 0.98],
          haloSize: 1.4,
          xoffset: 18,
          yoffset: -28,
          horizontalAlignment: "left",
          verticalAlignment: "bottom",
          font: { size: 11, family: "Segoe UI", weight: "700" }
        })
      }));
    }
  }

  function drawStraightFallbackForAll(itemsList) {
    var items = Array.isArray(itemsList) ? itemsList : validItems;
    var count = 0;
    items.forEach(function (v) {
      if (drawStraightFallback(v)) count++;
    });
    return count;
  }

  function finalizeGraphics(routeStats) {
    routeStats = routeStats || { routed: 0, fallback: 0 };
    addAnchorStartGraphic();
    validItems.forEach(function (v) {
      addPoiEndpointGraphic(v);
    });
    var extra = allItems.length > maxRender ? (" (showing first " + maxRender + ")") : "";
    var skipMsg = skipped > 0 ? (", " + skipped + " skipped") : "";
    setStatus(
      "Connected " + validCount + " " + label +
      " from center. Route paths: " + routeStats.routed +
      ", fallback lines: " + routeStats.fallback + skipMsg + extra + "."
    );
    return true;
  }

  function drawFromRoadGraph(graph, itemsList, routedSeed) {
    var items = Array.isArray(itemsList) ? itemsList : validItems;
    var startNode = findNearestGraphNode(graph, anchor, 7000);
    var routedCount = Number(routedSeed) || 0;
    var fallbackCount = 0;

    items.forEach(function (v) {
      var routed = false;
      if (startNode) {
        var maxSnapM = Math.max(900, Math.min(7000, Number(v.directMeters || 0) * 0.75));
        var endNode = findNearestGraphNode(graph, v.p326, maxSnapM);
        if (endNode) {
          var path = shortestPathRoadGraph(graph, startNode.node.key, endNode.node.key);
          if (path && path.nodeKeys && path.nodeKeys.length) {
            var pathCoords = [[anchor.x, anchor.y]];
            path.nodeKeys.forEach(function (k) {
              var n = graph.nodesByKey[k];
              if (n) pathCoords.push([n.x, n.y]);
            });
            pathCoords.push([v.p326.x, v.p326.y]);
            pathCoords = compactPathCoords(pathCoords);
            if (pathCoords.length >= 2) {
              var line326 = new Polyline({
                paths: [pathCoords],
                spatialReference: SR_METER
              });
              var lineW = projection.project(line326, SR_WEB);
              if (lineW) {
                connectorLayer.add(new Graphic({
                  geometry: lineW,
                  symbol: new SimpleLineSymbol({
                    color: v.style.lineColor,
                    width: 2.6,
                    style: "solid"
                  })
                }));
                v.routeMeters = polylineLengthMetersFromCoords(pathCoords);
                routed = true;
                routedCount++;
              }
            }
          }
        }
      }

      if (!routed) {
        if (drawStraightFallback(v)) fallbackCount++;
      }
    });

    return finalizeGraphics({ routed: routedCount, fallback: fallbackCount });
  }

  function drawOsrmRouteForItem(v) {
    if (!v || !v.p326) return Promise.resolve(false);
    var a4326 = projection.project(anchor, SR4326);
    var b4326 = projection.project(v.p326, SR4326);
    if (!a4326 || !b4326) return Promise.resolve(false);
    var fromWgs = { lat: Number(a4326.y), lon: Number(a4326.x) };
    var toWgs = { lat: Number(b4326.y), lon: Number(b4326.x) };
    if (!isValidWgsLatLon(fromWgs.lat, fromWgs.lon) || !isValidWgsLatLon(toWgs.lat, toWgs.lon)) {
      return Promise.resolve(false);
    }
    var url =
      "https://router.project-osrm.org/route/v1/driving/" +
      encodeURIComponent(fromWgs.lon + "," + fromWgs.lat) + ";" +
      encodeURIComponent(toWgs.lon + "," + toWgs.lat) +
      "?overview=full&geometries=geojson";
    return fetch(url).then(function (res) {
      if (!res || !res.ok) return null;
      return res.json();
    }).then(function (json) {
      if (!json || json.code !== "Ok" || !json.routes || !json.routes.length) return false;
      var route0 = json.routes[0] || null;
      var coords = route0 && route0.geometry && route0.geometry.coordinates;
      if (!coords || coords.length < 2) return false;
      var line4326 = new Polyline({
        paths: [coords.map(function (xy) { return [xy[0], xy[1]]; })],
        spatialReference: SR4326
      });
      var lineWeb = projection.project(line4326, SR_WEB);
      if (!lineWeb) return false;
      connectorLayer.add(new Graphic({
        geometry: lineWeb,
        symbol: new SimpleLineSymbol({
          color: v.style.lineColor,
          width: 2.6,
          style: "solid"
        })
      }));
      var routeDistM = Number(route0 && route0.distance);
      if (isFinite(routeDistM) && routeDistM > 0) v.routeMeters = routeDistM;
      return true;
    }).catch(function () {
      return false;
    });
  }

  function drawOsrmRoutesBatch(itemsList) {
    var items = Array.isArray(itemsList) ? itemsList.slice() : [];
    if (!items.length) return Promise.resolve({ routed: 0, unresolved: [] });
    var maxOsrm = Math.min(items.length, 20);
    var head = items.slice(0, maxOsrm);
    var tail = items.slice(maxOsrm);
    return Promise.all(head.map(function (v) {
      return drawOsrmRouteForItem(v);
    })).then(function (oks) {
      var unresolved = tail.slice();
      var routed = 0;
      for (var i = 0; i < head.length; i++) {
        if (oks[i]) routed++;
        else unresolved.push(head[i]);
      }
      return { routed: routed, unresolved: unresolved };
    }).catch(function () {
      return { routed: 0, unresolved: items };
    });
  }

  var ext = new Extent({
    xmin: minX,
    ymin: minY,
    xmax: maxX,
    ymax: maxY,
    spatialReference: SR_METER
  });
  var doneZoom = zoomToGeometry(ext, { expandFactor: 1.2 }).catch(function () {
    var cWeb = projection.project(anchor, SR_WEB) || null;
    if (!cWeb) return Promise.resolve();
    return view.goTo({ center: cWeb, zoom: 12, padding: getUiZoomPadding() }).catch(function () {
      return Promise.resolve();
    });
  });

  return drawOsrmRoutesBatch(validItems).then(function (osrmState) {
    if (!osrmState || !osrmState.unresolved || !osrmState.unresolved.length) {
      return finalizeGraphics({ routed: (osrmState && osrmState.routed) || 0, fallback: 0 });
    }
    return queryLayer(TRANS_MS, LAYER_ROADS_LINE, Object.assign({
      where: "1=1",
      returnGeometry: true,
      outFields: "OBJECTID",
      resultRecordCount: 2200
    }, geometryToQueryParams(routeQueryExtent))).then(function (data) {
      var roads = (data && data.features) || [];
      if (!roads.length) {
        return finalizeGraphics({
          routed: osrmState.routed || 0,
          fallback: drawStraightFallbackForAll(osrmState.unresolved)
        });
      }
      var graph = buildRoadGraph(roads, 8);
      if (!graph || !graph.keys || !graph.keys.length) {
        return finalizeGraphics({
          routed: osrmState.routed || 0,
          fallback: drawStraightFallbackForAll(osrmState.unresolved)
        });
      }
      return drawFromRoadGraph(graph, osrmState.unresolved, osrmState.routed || 0);
    }).catch(function () {
      return finalizeGraphics({
        routed: osrmState.routed || 0,
        fallback: drawStraightFallbackForAll(osrmState.unresolved)
      });
    });
  }).catch(function () {
    return finalizeGraphics({ routed: 0, fallback: drawStraightFallbackForAll(validItems) });
  }).then(function () {
    return doneZoom.then(function () { return true; });
  });
}

function routeFromAnchorToTarget(anchor32643, target32643, opts) {
  opts = opts || {};
  var fromLabel = String(opts.fromLabel || "Selected area");
  var toLabel = String(opts.toLabel || "Selected location");

  return projection.load().then(function () {
    var start = anchor32643 && anchor32643.type === "point" ? anchor32643 : getGeometryCentroid(anchor32643);
    var end = target32643 && target32643.type === "point" ? target32643 : getGeometryCentroid(target32643);
    if (!start || !end) return false;

    var startWgsPt = projection.project(start, SR4326);
    var endWgsPt = projection.project(end, SR4326);
    if (!startWgsPt || !endWgsPt) return false;

    var fromWgs = { lat: Number(startWgsPt.y), lon: Number(startWgsPt.x) };
    var toWgs = { lat: Number(endWgsPt.y), lon: Number(endWgsPt.x) };
    if (!isValidWgsLatLon(fromWgs.lat, fromWgs.lon) || !isValidWgsLatLon(toWgs.lat, toWgs.lon)) {
      return false;
    }

    var solveUrl = getEsriRouteSolveUrl();
    function drawFallback() {
      return drawBestAvailableFallbackRoute(fromWgs, toWgs, {
        fromLabel: fromLabel,
        toLabel: toLabel
      }).then(function (res) {
        return !!res;
      }).catch(function () {
        return false;
      });
    }

    if (!hasArcGisRoutingApiKey() && routeServiceNeedsApiKey(solveUrl)) {
      return drawFallback();
    }

    var p0 = new Point({ x: fromWgs.lon, y: fromWgs.lat, spatialReference: SR4326 });
    var p1 = new Point({ x: toWgs.lon, y: toWgs.lat, spatialReference: SR4326 });
    var fs = new FeatureSet({
      features: [
        new Graphic({ geometry: p0, attributes: { Name: fromLabel } }),
        new Graphic({ geometry: p1, attributes: { Name: toLabel } })
      ]
    });
    var rparams = new RouteParameters({
      stops: fs,
      returnDirections: false,
      returnRoutes: true
    });
    if (esriConfig.apiKey) rparams.apiKey = esriConfig.apiKey;

    routeLineLayer.removeAll();
    return solve(solveUrl, rparams, { apiKey: esriConfig.apiKey }).then(function (res) {
      var rr = res.routeResults && res.routeResults[0];
      var routeFeat = rr && rr.route;
      var altFeat = null;
      var geom = routeFeat && (routeFeat.geometry || routeFeat);
      if (!geom || !geom.type) {
        altFeat = res.routes && res.routes.features && res.routes.features[0];
        geom = altFeat && altFeat.geometry;
      }
      if (!geom) return drawFallback();

      var gLine = geom.spatialReference && geom.spatialReference.wkid === 3857
        ? geom
        : projection.project(geom, SR_WEB);
      if (!gLine) return drawFallback();

      routeLineLayer.add(new Graphic({
        geometry: gLine,
        symbol: new SimpleLineSymbol({ color: [0, 92, 230, 1], width: 4 })
      }));
      addRouteEndpointMarkers(fromWgs, toWgs, fromLabel, toLabel, gLine);
      return view.goTo(gLine, { padding: getUiZoomPadding() }).catch(function () {
        return null;
      }).then(function () {
        return true;
      });
    }).catch(function (err) {
      if (isRoutingAuthError(err)) return drawFallback();
      return drawFallback();
    });
  }).catch(function () {
    return false;
  });
}

function createSafeBuffer32643(geom, distM) {
  var d = Number(distM);
  if (!geom || !isFinite(d) || d <= 0) return null;

  var g = toEngineSR(ensureSR32643(geom));
  if (!g) return null;

  function firstPoly(x) {
    if (!x) return null;
    if (Array.isArray(x)) return x.length ? x[0] : null;
    return x;
  }

  function usablePoly(x) {
    var p = firstPoly(x);
    return geometryIsUsable(p) ? ensureSR32643(p) : null;
  }

  var out = null;
  try {
    out = usablePoly(geometryEngine.buffer(g, d, "meters"));
    if (out) return out;
  } catch (e0) {}

  try {
    var gs = geometryEngine.simplify(g) || g;
    out = usablePoly(geometryEngine.buffer(gs, d, "meters"));
    if (out) return out;
  } catch (e1) {}

  try {
    var g4326 = projection.project(g, SR4326);
    if (g4326) {
      var geo = usablePoly(geometryEngine.geodesicBuffer(g4326, d, "meters"));
      if (geo) {
        var back = projection.project(geo, SR_METER);
        if (geometryIsUsable(back)) return ensureSR32643(back);
      }
    }
  } catch (e2) {}

  return null;
}

function to32643WithSmartFallback(geom, responseSr) {
  if (!geom) return null;

  var raw = geom;

  function firstXY(x) {
    if (!x) return null;
    if (x.type === "point") return [Number(x.x), Number(x.y)];
    if (x.type === "polyline" && x.paths && x.paths[0] && x.paths[0][0]) {
      return [Number(x.paths[0][0][0]), Number(x.paths[0][0][1])];
    }
    if (x.type === "polygon" && x.rings && x.rings[0] && x.rings[0][0]) {
      return [Number(x.rings[0][0][0]), Number(x.rings[0][0][1])];
    }
    if (x.type === "extent") return [Number(x.xmin), Number(x.ymin)];
    return null;
  }

  var xy = firstXY(raw);
  var x0 = xy ? xy[0] : NaN;
  var y0 = xy ? xy[1] : NaN;
  var srRaw = (raw && raw.spatialReference) || responseSr || null;
  var wk = wkidValue(srRaw);
  var looksLonLat = isFinite(x0) && isFinite(y0) && Math.abs(x0) <= 180 && Math.abs(y0) <= 90;

  try {
    // Service sometimes tags lon/lat coordinates with 32643/3857 (or omits SR).
    // Re-interpret these as WGS84 before any direct 32643 return path.
    if (looksLonLat) {
      raw.spatialReference = SR4326;
      var gFixWgs = projection.project(raw, SR_METER);
      if (gFixWgs) return gFixWgs;
    }
  } catch (e0) {}

  coerceMissingSpatialReference(raw, responseSr || SR_METER);
  var g = toEngineSR(raw);
  if (g) return g;

  try {
    if (looksLonLat && (wk == null || wk === 32643 || isWebMercatorWkid(wk))) {
      raw.spatialReference = SR4326;
      g = projection.project(raw, SR_METER);
      if (g) return g;
    }
  } catch (e1) {}

  try {
    raw.spatialReference = SR_WEB;
    g = projection.project(raw, SR_METER);
    if (g) return g;
  } catch (e2) {}

  return null;
}

function buildFallbackAnchorBuffer32643(qg, distM) {
  var anchor = null;
  if (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") {
    anchor = bufferMarkPoint32643;
  } else if (qg && qg.type === "point") {
    anchor = toEngineSR(ensureSR32643(qg));
  } else if (qg) {
    var qg32643 = toEngineSR(ensureSR32643(qg));
    anchor = getGeometryCentroid(qg32643);
    if (anchor && anchor.type !== "point") {
      anchor = getGeometryCentroid(anchor);
    }
  }
  if (!anchor || anchor.type !== "point") return null;
  return createSafeBuffer32643(anchor, distM);
}

msmeBind("runBuffer", "click", function () {
  clearResults();
  bufferCommunitySummaryToken++;
  var hasPointAnchor = !!(bufferMarkPoint32643 && bufferMarkPoint32643.type === "point");
  var roadLayerEl = document.getElementById("bufRoadLayer");
  var roadLayerId = parseInt(roadLayerEl.value, 10);
  var roadSourceText = roadLayerEl && roadLayerEl.selectedOptions && roadLayerEl.selectedOptions[0]
    ? String(roadLayerEl.selectedOptions[0].text || "").trim()
    : "Road source";
  var distM = parseFloat(document.getElementById("bufDist").value) || 1500;
  var searchRadiusEl = document.getElementById("bufMarkQueryRadius");
  var searchRadiusM = searchRadiusEl ? parseInt(searchRadiusEl.value, 10) || 5000 : 5000;
  var runAtIso = new Date().toISOString();
  var qGeomState = resolveBufferQueryGeometry(searchRadiusM);
  var qg = qGeomState.geometry;
  var clippedFromAdminSelection = !!qGeomState.clippedFromAdminSelection;
  var qgJson = qg && typeof qg.toJSON === "function" ? qg.toJSON() : null;
  var qp = geometryToQueryParams(qg);
  var baseQuery = {
    where: "1=1",
    returnGeometry: true,
    outFields: "OBJECTID",
    resultRecordCount: hasPointAnchor ? 140 : 220
  };
  function setBufferContextAndHydrate(ctxObj) {
    setLastBufferExportContext(ctxObj);
    hydrateNearSchoolStatsInBackground(lastBufferExportContext);
  }

  function drawBuffersFromQueryData(data) {
    var features = (data && data.features) || [];
    var responseSr = (data && data.spatialReference) || null;
    var n = 0;
    var skipped = 0;
    var withGeometry = 0;
    var objectIds = [];
    var bufferPolys32643 = [];

    features.forEach(function (f) {
      var raw = geomFromJSON(f.geometry);
      if (raw) withGeometry++;
      // Prefer response-level SR when feature-level SR is missing; then try smart SR fallback.
      var g = to32643WithSmartFallback(raw, responseSr);
      if (!g) {
        skipped++;
        return;
      }
      var buf = createSafeBuffer32643(g, distM);
      if (!buf) {
        skipped++;
        return;
      }
      var bufWeb = projection.project(buf, SR_WEB);
      if (!bufWeb) {
        skipped++;
        return;
      }
      resultsLayer.add(new Graphic({ geometry: bufWeb, symbol: symBuffer, attributes: f.attributes }));
      bufferPolys32643.push(buf);
      var attrs = f.attributes || {};
      var oid = attrs.OBJECTID != null ? attrs.OBJECTID : attrs.objectid;
      if (oid != null && objectIds.length < 120) objectIds.push(String(oid));
      n++;
    });

    var summaryGeometry32643 = null;
    if (bufferPolys32643.length === 1) {
      summaryGeometry32643 = bufferPolys32643[0];
    } else if (bufferPolys32643.length > 1) {
      try {
        summaryGeometry32643 = geometryEngine.union(bufferPolys32643);
      } catch (eUnion) {
        console.warn("[buffer summary] union failed", eUnion);
      }
      if (!summaryGeometry32643) {
        summaryGeometry32643 = bufferPolys32643[0];
      }
    }

    return {
      n: n,
      skipped: skipped,
      total: features.length,
      withGeometry: withGeometry,
      objectIds: objectIds,
      summaryGeometry32643: summaryGeometry32643
    };
  }

  function publishBufferSuccess(prefix, stats) {
    var msg = prefix + stats.n + " feature(s), " + distM + " m.";
    if (stats.skipped) msg += " (" + stats.skipped + " skipped)";
    if (clippedFromAdminSelection) {
      msg += " Search area limited to " + searchRadiusM + " m around AOI center.";
    }
    var summaryGeomJson = stats.summaryGeometry32643 && typeof stats.summaryGeometry32643.toJSON === "function"
      ? stats.summaryGeometry32643.toJSON()
      : null;
    setBufferContextAndHydrate({
      generatedAt: runAtIso,
      summary: msg,
      roadSource: roadSourceText,
      searchRadiusM: searchRadiusM,
      bufferDistanceM: distM,
      count: stats.n,
      skipped: stats.skipped || 0,
      fallback: false,
      objectIds: stats.objectIds || [],
      queryGeometryJson: qgJson,
      summaryGeometryJson: summaryGeomJson,
      communitySummary: null,
      nearSchoolsStats: null
    });
    setStatus(msg);
    var baseReport = publishAnalysisToolResult("buffer", msg, {
      count: stats.n,
      distanceM: distM,
      searchRadiusM: searchRadiusM,
      roadSource: roadSourceText
    });
    if (stats.summaryGeometry32643) {
      publishBufferCommunitySummaryInBackground(baseReport, stats.summaryGeometry32643, lastBufferExportContext);
    }
  }

  function showNoBufferError(stats, triedPolygonFallback) {
    var reason = "";
    if (!stats.total) reason = "No features found in selected search area.";
    else if (!stats.withGeometry) reason = "Features returned without geometry.";
    else reason = "Feature geometries could not be buffered at this location.";

    var suffix = triedPolygonFallback
      ? " Tried Roads (Line) and Roads (Polygon)."
      : "";
    if (clippedFromAdminSelection) {
      suffix += " Search area limited to " + searchRadiusM + " m around AOI center.";
    }
    setBufferContextAndHydrate({
      generatedAt: runAtIso,
      summary: "No buffer drawn. " + reason + suffix,
      roadSource: roadSourceText,
      searchRadiusM: searchRadiusM,
      bufferDistanceM: distM,
      count: 0,
      skipped: stats && stats.skipped != null ? stats.skipped : 0,
      fallback: false,
      objectIds: [],
      queryGeometryJson: qgJson,
      summaryGeometryJson: null,
      communitySummary: null,
      nearSchoolsStats: null
    });
    setStatus("No buffer drawn. " + reason + suffix);
    window.alert("No buffer drawn.\n" + reason + suffix + "\nTry increasing search radius or changing Road source.");
  }

  projection.load().then(function () {
    return queryLayer(TRANS_MS, roadLayerId, Object.assign({}, baseQuery, qp));
  }).then(function (data) {
    var stats = drawBuffersFromQueryData(data);
    if (stats.n > 0) {
      publishBufferSuccess("Buffer: ", stats);
      return;
    }

    // Automatic fallback: when Roads (Line) fails, try Roads (Polygon) once.
    if (roadLayerId === LAYER_ROADS_LINE) {
      return queryLayer(TRANS_MS, 5, Object.assign({}, baseQuery, qp)).then(function (polyData) {
        var polyStats = drawBuffersFromQueryData(polyData);
        if (polyStats.n > 0) {
          publishBufferSuccess("Buffer (roads polygon fallback): ", polyStats);
          return;
        }
        var fallbackBuf = buildFallbackAnchorBuffer32643(qg, distM);
        if (fallbackBuf) {
          var fbWeb = projection.project(fallbackBuf, SR_WEB);
          if (fbWeb) {
            resultsLayer.add(new Graphic({ geometry: fbWeb, symbol: symBuffer }));
            var fbMsg = "Fallback buffer shown around marked point (" + distM + " m). Roads geometry buffer was unavailable at this location.";
            setBufferContextAndHydrate({
              generatedAt: runAtIso,
              summary: fbMsg,
              roadSource: roadSourceText,
              searchRadiusM: searchRadiusM,
              bufferDistanceM: distM,
              count: 1,
              skipped: polyStats && polyStats.skipped != null ? polyStats.skipped : 0,
              fallback: true,
              objectIds: [],
              queryGeometryJson: qgJson,
              summaryGeometryJson: fallbackBuf.toJSON(),
              communitySummary: null,
              nearSchoolsStats: null
            });
            setStatus(fbMsg);
            var fbReport = publishAnalysisToolResult("buffer", fbMsg, {
              count: 1,
              distanceM: distM,
              fallback: true,
              searchRadiusM: searchRadiusM,
              roadSource: roadSourceText
            });
            publishBufferCommunitySummaryInBackground(fbReport, fallbackBuf, lastBufferExportContext);
            return;
          }
        }
        showNoBufferError(polyStats, true);
      }).catch(function (e2) {
        console.warn("[buffer] roads polygon fallback failed", e2);
        var fallbackBuf2 = buildFallbackAnchorBuffer32643(qg, distM);
        if (fallbackBuf2) {
          var fbWeb2 = projection.project(fallbackBuf2, SR_WEB);
          if (fbWeb2) {
            resultsLayer.add(new Graphic({ geometry: fbWeb2, symbol: symBuffer }));
            var fbMsg2 = "Fallback buffer shown around marked point (" + distM + " m). Roads query fallback failed.";
            setBufferContextAndHydrate({
              generatedAt: runAtIso,
              summary: fbMsg2,
              roadSource: roadSourceText,
              searchRadiusM: searchRadiusM,
              bufferDistanceM: distM,
              count: 1,
              skipped: stats && stats.skipped != null ? stats.skipped : 0,
              fallback: true,
              objectIds: [],
              queryGeometryJson: qgJson,
              summaryGeometryJson: fallbackBuf2.toJSON(),
              communitySummary: null,
              nearSchoolsStats: null
            });
            setStatus(fbMsg2);
            var fbReport2 = publishAnalysisToolResult("buffer", fbMsg2, {
              count: 1,
              distanceM: distM,
              fallback: true,
              searchRadiusM: searchRadiusM,
              roadSource: roadSourceText
            });
            publishBufferCommunitySummaryInBackground(fbReport2, fallbackBuf2, lastBufferExportContext);
            return;
          }
        }
        showNoBufferError(stats, true);
      });
    }

    var fallbackBuf3 = buildFallbackAnchorBuffer32643(qg, distM);
    if (fallbackBuf3) {
      var fbWeb3 = projection.project(fallbackBuf3, SR_WEB);
      if (fbWeb3) {
        resultsLayer.add(new Graphic({ geometry: fbWeb3, symbol: symBuffer }));
        var fbMsg3 = "Fallback buffer shown around marked point (" + distM + " m).";
        setBufferContextAndHydrate({
          generatedAt: runAtIso,
          summary: fbMsg3,
          roadSource: roadSourceText,
          searchRadiusM: searchRadiusM,
          bufferDistanceM: distM,
          count: 1,
          skipped: stats && stats.skipped != null ? stats.skipped : 0,
          fallback: true,
          objectIds: [],
          queryGeometryJson: qgJson,
          summaryGeometryJson: fallbackBuf3.toJSON(),
          communitySummary: null,
          nearSchoolsStats: null
        });
        setStatus(fbMsg3);
        var fbReport3 = publishAnalysisToolResult("buffer", fbMsg3, {
          count: 1,
          distanceM: distM,
          fallback: true,
          searchRadiusM: searchRadiusM,
          roadSource: roadSourceText
        });
        publishBufferCommunitySummaryInBackground(fbReport3, fallbackBuf3, lastBufferExportContext);
        return;
      }
    }
    showNoBufferError(stats, false);
  }).catch(function (e) { console.error(e); setStatus("Buffer failed."); });
});

window.msmeGisDownloadBufferPdf = function () {
  var report = window.msmeGisGetAnalysisReportSnapshot ? window.msmeGisGetAnalysisReportSnapshot() : null;
  if ((!report || report.tool !== "buffer") && !lastBufferExportContext) {
    window.alert("Run Buffer once, then download PDF.");
    return;
  }
  buildBufferPdfReport();
};

window.msmeGisDownloadClosestPdf = function () {
  buildClosestScreenPdfReport();
};

msmeBind("btnBufferPdf", "click", function () {
  if (window.msmeGisDownloadBufferPdf) {
    window.msmeGisDownloadBufferPdf();
  }
});

var closestPdfBtn = document.getElementById("closestPrintFab") || document.getElementById("btnClosestPdf");
if (closestPdfBtn) {
  closestPdfBtn.addEventListener("click", function () {
    if (window.msmeGisDownloadClosestPdf) {
      window.msmeGisDownloadClosestPdf();
    }
  });
}

msmeBind("runProximity", "click", function () {
  clearResults();
  var maxD = parseFloat(document.getElementById("proxDist").value) || 2000;
  var qg = activeQueryGeometry();
  var hasPointAnchor = !!(bufferMarkPoint32643 && bufferMarkPoint32643.type === "point");
  var villageRecordLimit = hasPointAnchor ? 260 : 600;
  var poiRecordLimit = hasPointAnchor ? 180 : 400;
  var checks = Array.prototype.slice.call(document.querySelectorAll(".prox-cb")).filter(function (c) { return c.checked; });
  if (!checks.length) { alertNoData("select POI layer"); return; }
  var qV = queryLayer(ADMIN_MS, LAYER_VILLAGE, Object.assign({
    where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: villageRecordLimit
  }, geometryToQueryParams(qg)));
  var qPois = checks.map(function (c) {
    return queryLayer(c.getAttribute("data-url"), parseInt(c.getAttribute("data-layer"), 10), Object.assign({
      where: "1=1", returnGeometry: true, outFields: "OBJECTID", resultRecordCount: poiRecordLimit
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
    var anchor32643 = resolveBufferCenterPoint32643();
    if (!anchor32643 || anchor32643.type !== "point") {
      var qg32643 = qg ? toEngineSR(ensureSR32643(qg)) : null;
      if (qg32643 && qg32643.type === "point") anchor32643 = qg32643;
      else if (qg32643) anchor32643 = getGeometryCentroid(qg32643);
    }
    if ((!anchor32643 || anchor32643.type !== "point") && view && view.center) {
      try {
        var c32643 = to32643WithSmartFallback(view.center, view.center.spatialReference || SR_WEB);
        if (c32643 && c32643.type === "point") anchor32643 = c32643;
      } catch (eCenter) {}
    }
    var nearest = null;
    var nearestDistM = null;
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
        var dM = anchor32643 && anchor32643.type === "point" ? distanceFromPointToGeometry(anchor32643, pg) : null;
        if (nearest == null) {
          nearest = { feature: pf, geometry: pg, distanceM: dM };
          nearestDistM = dM;
          return;
        }
        if (dM != null && (nearestDistM == null || dM < nearestDistM)) {
          nearest = { feature: pf, geometry: pg, distanceM: dM };
          nearestDistM = dM;
        }
      }
    });
    if (!nearest) alertNoData("closest result");
    else {
      resultsLayer.add(new Graphic({
        geometry: projection.project(nearest.geometry, SR_WEB),
        symbol: symPoint,
        attributes: nearest.feature.attributes
      }));
      var distTxt = nearest.distanceM != null ? (" Nearest distance: " + nearest.distanceM + " m.") : "";
      var msgI = "Closest: 1 industrial site inside selected layers." + distTxt;
      setStatus(msgI);
      publishAnalysisToolResult("closest", msgI, { count: 1, nearestDistanceM: nearest.distanceM });
    }
  }).catch(function (e) {
    console.error(e);
    setStatus("Closest analysis failed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â see console.");
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
    if (el && g) el.textContent = "Lat " + g.y.toFixed(5) + "°· Lon " + g.x.toFixed(5) + "°";
  });
});

var selectParcelToolActive = false;
var quickBufferAutoRunAfterAnchorPick = false;
var quickProximityAutoRunAfterAnchorPick = false;
var closestPointPickModeActive = false;
var closestPointBufferMeters = 1500;

function runClosestFromPickedPoint(anchor32643Point, radiusM) {
  var radius = Number(radiusM);
  if (!anchor32643Point || anchor32643Point.type !== "point") {
    setStatus("Closest mode failed: selected point not available.");
    return Promise.resolve(false);
  }
  if (!isFinite(radius) || radius <= 0) radius = 1500;
  radius = setBufferDistanceMeters(radius);

  clearResults();
  var summaryGeom32643 = createSafeBuffer32643(anchor32643Point, radius);
  if (!summaryGeom32643) {
    setStatus("Closest mode failed: buffer could not be created.");
    return Promise.resolve(false);
  }

  var geomWeb = projection.project(summaryGeom32643, SR_WEB);
  if (geomWeb) {
    resultsLayer.add(new Graphic({
      geometry: geomWeb,
      symbol: symBuffer,
      attributes: { type: "closest-buffer", radiusM: radius }
    }));
  }

  setStatus("Closest buffer created (" + radius + " m). Finding nearest community places...");
  return computeClosestCommunitySummaryForGeometry(anchor32643Point, summaryGeom32643, "closest-point").then(function (communitySummary) {
    var msg = "Closest point analysis complete for " + radius + " m buffer.";
    publishAnalysisToolResult("closest", msg, {
      count: communitySummary ? communitySummary.totalCount : 0,
      radiusM: radius,
      communitySummary: communitySummary,
      summaryGeometryJson: summaryGeom32643 && summaryGeom32643.toJSON ? summaryGeom32643.toJSON() : null,
      queryGeometryJson: summaryGeom32643 && summaryGeom32643.toJSON ? summaryGeom32643.toJSON() : null
    });
    if (communitySummary) {
      setStatus("Closest point analysis complete. Community panel updated.");
    } else {
      setStatus("Closest point analysis complete. Community summary unavailable.");
    }
    return true;
  }).catch(function (err) {
    console.warn("[closest point]", err);
    setStatus("Closest point analysis failed - see console.");
    return false;
  });
}

function syncBufferMapFabUi() {
  var fab = document.getElementById("bufferMapFab");
  if (!fab) return;
  fab.classList.toggle("active", !!bufferMarkModeActive);
  fab.setAttribute("aria-pressed", bufferMarkModeActive ? "true" : "false");
}

function clearBufferAnchorMarker() {
  bufferMarkPoint32643 = null;
  bufferMarkLayer.removeAll();
}

function setBufferMarkMode(on, announce) {
  bufferMarkModeActive = !!on;
  var bMark = document.getElementById("btnBufferMarkPoint");
  if (bMark) bMark.classList.toggle("active", bufferMarkModeActive);
  if (bufferMarkModeActive) {
    setSelectParcelTool(false);
    if (view && view.container) view.container.style.cursor = "crosshair";
    if (announce !== false) setStatus("Click the map to place the buffer anchor point.");
  } else if (view && view.container) {
    view.container.style.cursor = "";
  }
  syncBufferMapFabUi();
}

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
    closestPointPickModeActive = false;
    quickBufferAutoRunAfterAnchorPick = false;
    quickProximityAutoRunAfterAnchorPick = false;
    setBufferMarkMode(false, false);
    setStatus("Select tool ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â click the map. Results appear in the left panel with distances.");
  } else {
    syncBufferMapFabUi();
  }
}

(function bufferMarkUi() {
  var bMark = document.getElementById("btnBufferMarkPoint");
  var bBufferPick = document.getElementById("btnBufferPickPoint");
  var bProxPick = document.getElementById("btnProximityPickPoint");
  var bClr = document.getElementById("btnBufferClearMark");
  var bClosestPick = document.getElementById("btnClosestPickPoint");
  if (bMark) {
    bMark.addEventListener("click", function () {
      var turningOn = !bufferMarkModeActive;
      var hadAnchor = !!(bufferMarkPoint32643 && bufferMarkPoint32643.type === "point");
      closestPointPickModeActive = false;
      quickBufferAutoRunAfterAnchorPick = false;
      if (turningOn && hadAnchor) {
        clearBufferAnchorMarker();
        setBufferMarkMode(true, false);
        setStatus("Old buffer point removed. Click map to place a new buffer point.");
        return;
      }
      setBufferMarkMode(turningOn, true);
    });
  }
  if (bClr) {
    bClr.addEventListener("click", function () {
      clearBufferAnchorMarker();
      closestPointPickModeActive = false;
      quickBufferAutoRunAfterAnchorPick = false;
      quickProximityAutoRunAfterAnchorPick = false;
      setBufferMarkMode(false, false);
      setStatus("Buffer anchor cleared.");
    });
  }
  if (bBufferPick) {
    bBufferPick.addEventListener("click", function () {
      var dist = readBufferPickDistanceMetersFromUi();
      window.msmeGisStartQuickBufferWithDistance(dist);
    });
  }
  if (bProxPick) {
    bProxPick.addEventListener("click", function () {
      var dist = readProximityDistanceMetersFromUi();
      window.msmeGisStartQuickProximityWithDistance(dist);
    });
  }
  if (bClosestPick) {
    bClosestPick.addEventListener("click", function () {
      var dist = readClosestDistanceMetersFromUi();
      window.msmeGisStartClosestPointSelection(dist);
    });
  }
  syncBufferMapFabUi();
})();

window.msmeGisStartQuickBuffer = function () {
  var pickedDist = setBufferDistanceMeters(1500);
  setBufferQueryRadiusMeters(Math.round(Math.max(1200, Math.min(6000, pickedDist * 1.8))));
  closestPointPickModeActive = false;
  quickProximityAutoRunAfterAnchorPick = false;
  if (bufferMarkModeActive) {
    quickBufferAutoRunAfterAnchorPick = false;
    setBufferMarkMode(false, false);
    setStatus("Buffer mode OFF.");
    return;
  }
  if (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") {
    clearBufferAnchorMarker();
    quickBufferAutoRunAfterAnchorPick = true;
    setBufferMarkMode(true, false);
    setStatus("Old buffer point removed. Click new location to run 1500 m buffer.");
    return;
  }
  quickBufferAutoRunAfterAnchorPick = true;
  setBufferMarkMode(true, false);
  setStatus("Buffer mode active. Click the map to place anchor and run 1500 m buffer.");
};

window.msmeGisStartQuickBufferWithDistance = function (distanceM) {
  var n = Number(distanceM);
  var dist = isFinite(n) && n > 0 ? Math.round(n) : 1500;
  setBufferDistanceMeters(dist);
  setBufferQueryRadiusMeters(Math.round(Math.max(1200, Math.min(6000, dist * 1.8))));
  closestPointPickModeActive = false;
  quickProximityAutoRunAfterAnchorPick = false;
  if (bufferMarkModeActive) {
    quickBufferAutoRunAfterAnchorPick = false;
    setBufferMarkMode(false, false);
    setStatus("Buffer mode OFF.");
    return;
  }
  if (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") {
    clearBufferAnchorMarker();
    quickBufferAutoRunAfterAnchorPick = true;
    setBufferMarkMode(true, false);
    setStatus("Old buffer point removed. Click new location to run " + dist + " m buffer.");
    return;
  }
  quickBufferAutoRunAfterAnchorPick = true;
  setBufferMarkMode(true, false);
  setStatus("Buffer mode active. Click the map to place anchor and run " + dist + " m buffer.");
};

window.msmeGisStopQuickBuffer = function () {
  closestPointPickModeActive = false;
  quickBufferAutoRunAfterAnchorPick = false;
  quickProximityAutoRunAfterAnchorPick = false;
  setBufferMarkMode(false, false);
  setStatus("Buffer mode OFF.");
};

window.msmeGisStartQuickProximityWithDistance = function (distanceM) {
  var n = Number(distanceM);
  var dist = isFinite(n) && n > 0 ? Math.round(n) : readProximityDistanceMetersFromUi();
  setProximityDistanceMeters(dist);
  setBufferQueryRadiusMeters(Math.round(Math.max(1000, Math.min(5000, dist * 1.4))));
  closestPointPickModeActive = false;
  quickBufferAutoRunAfterAnchorPick = false;
  if (bufferMarkModeActive) {
    quickProximityAutoRunAfterAnchorPick = false;
    setBufferMarkMode(false, false);
    setStatus("Proximity pick mode OFF.");
    return;
  }
  if (bufferMarkPoint32643 && bufferMarkPoint32643.type === "point") {
    clearBufferAnchorMarker();
    quickProximityAutoRunAfterAnchorPick = true;
    setBufferMarkMode(true, false);
    setStatus("Old point removed. Click new location to run Proximity (" + dist + " m).");
    return;
  }
  quickProximityAutoRunAfterAnchorPick = true;
  setBufferMarkMode(true, false);
  setStatus("Proximity mode active. Click map to place point and run Proximity (" + dist + " m).");
};

window.msmeGisStartClosestPointSelection = function (distanceM) {
  var n = Number(distanceM);
  var dist = isFinite(n) && n > 0 ? Math.round(n) : readClosestDistanceMetersFromUi();
  closestPointBufferMeters = setBufferDistanceMeters(dist);
  quickBufferAutoRunAfterAnchorPick = false;
  quickProximityAutoRunAfterAnchorPick = false;
  closestPointPickModeActive = true;
  setBufferMarkMode(true, false);
  setStatus("Closest point mode active. Click map to set point and build " + closestPointBufferMeters + " m buffer.");
};

window.msmeGisSetBufferAnchorFromWgs = function (lat, lon, opts) {
  var latNum = Number(lat);
  var lonNum = Number(lon);
  if (!isFinite(latNum) || !isFinite(lonNum)) {
    setStatus("Invalid search coordinates.");
    return Promise.resolve(false);
  }
  if (Math.abs(latNum) > 90 || Math.abs(lonNum) > 180) {
    if (Math.abs(lonNum) <= 90 && Math.abs(latNum) <= 180) {
      var swap = latNum;
      latNum = lonNum;
      lonNum = swap;
    }
  }
  if (Math.abs(latNum) > 90 || Math.abs(lonNum) > 180) {
    setStatus("Search point is outside valid latitude/longitude range.");
    return Promise.resolve(false);
  }
  if (!view || !bufferMarkLayer) {
    setStatus("Map is not ready yet.");
    return Promise.resolve(false);
  }
  return projection.load().then(function () {
    var p4326 = new Point({ x: lonNum, y: latNum, spatialReference: SR4326 });
    var p32643 = projection.project(p4326, SR_METER);
    var pWeb = projection.project(p4326, SR_WEB) || p4326;
    if (!p32643 || p32643.type !== "point") {
      setStatus("Could not project searched place for buffer.");
      return false;
    }

    bufferMarkPoint32643 = p32643;
    closestPointPickModeActive = false;
    quickBufferAutoRunAfterAnchorPick = false;
    quickProximityAutoRunAfterAnchorPick = false;
    setBufferMarkMode(false, false);
    bufferMarkLayer.removeAll();
    bufferMarkLayer.add(new Graphic({ geometry: pWeb, symbol: symBufferMark }));

    var requestedDist = opts && opts.distanceM != null ? Number(opts.distanceM) : 1500;
    setBufferDistanceMeters(isFinite(requestedDist) && requestedDist > 0 ? requestedDist : 1500);

    var zoomLvl = opts && opts.zoom != null ? Number(opts.zoom) : 14;
    var targetZoom = isFinite(zoomLvl) && zoomLvl > 0 ? zoomLvl : 14;
    var placeLabel = opts && opts.label ? String(opts.label) : "searched place";
    var autoRun = !(opts && opts.autoRun === false);

    return view.goTo({ center: pWeb, zoom: targetZoom, padding: getUiZoomPadding() }).catch(function () {
      return null;
    }).then(function () {
      if (autoRun) {
        var runBtn = document.getElementById("runBuffer");
        if (runBtn) runBtn.click();
        setStatus("Buffer anchor set from search: " + placeLabel + ". Running buffer...");
      } else {
        setStatus("Buffer anchor set from search: " + placeLabel + ". Click Run buffer.");
      }
      return true;
    });
  }).catch(function (err) {
    console.error("[search buffer anchor]", err);
    setStatus("Search to buffer failed.");
    return false;
  });
};

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
    radiusM = readCadNearRadiusMeters();
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
      nearbyRows: nearbyRows,
      communitySummary: null
    });
    var clicksPayload = mapIdentifyClickSessions.map(function (s, idx) {
      return {
        clickIndex: idx + 1,
        lat: s.lat,
        lon: s.lon,
        radiusM: s.radiusM,
        atClickRows: s.atClickRows,
        nearbyRows: s.nearbyRows,
        communitySummary: s.communitySummary || null
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
      communitySummary: null,
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
      if (selectionSource !== "map-click" && view.popup && mapPoint) {
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
    publishMapPointCommunitySummaryInBackground(anchor32643, radiusM, {
      selectionSource: selectionSource || "map-click",
      lat: lat,
      lon: lon,
      atClickRows: atClickRows,
      nearbyRows: nearbyRows
    });
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
  quickBufferAutoRunAfterAnchorPick = false;
  setBufferMarkMode(false, false);
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
    summary: "Buffer / proximity / closest tools now use the union of " + nFeat + " map hit(s).",
    featureCount: nFeat
  });
  setStatus("Spatial analysis tools will use your combined map selection ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â run buffer, proximity, or other tools.");
};

window.msmeGisClearMapSelection = function () {
  if (sketchVM) sketchVM.cancel();
  mapPointCommunitySummaryToken++;
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
  publishMapSelectionReportSnapshot(null);
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

function onCommunityZoomToLocation(event) {
  if (!event || !event.detail) return;
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;

  var detail = event.detail || {};
  var zoom = Number(detail.zoom);
  var zoomLvl = isFinite(zoom) && zoom > 0 ? zoom : 16;

  projection.load().then(function () {
    var p4326 = resolveCommunityZoomPoint4326(detail, {
      Point: Point,
      SR4326: SR4326,
      geomFromJSON: geomFromJSON,
      coerceMissingSpatialReference: coerceMissingSpatialReference,
      projection: projection,
      getGeometryCentroid: getGeometryCentroid
    });
    if (!p4326) {
      console.warn("[community zoom] invalid coordinates:", detail);
      setStatus("Selected location has no valid coordinates for zoom.");
      return;
    }
    var pWeb = projection.project(p4326, SR_WEB) || p4326;
    var p32643 = projection.project(p4326, SR_METER) || null;
    if (!pWeb) return;
    addCommunityZoomGraphic(pWeb, deriveCommunityZoomLabel(detail));
    if (p32643) {
      var bufferCenter = resolveBufferCenterPoint32643();
      if (bufferCenter && bufferCenter.type === "point") {
        routeFromAnchorToTarget(bufferCenter, p32643, {
          fromLabel: "Selected area",
          toLabel: deriveCommunityZoomLabel(detail)
        }).then(function (routed) {
          if (routed) {
            clearConnectorGraphics();
            return;
          }
          drawConnectorBetweenFeatures(bufferCenter, p32643);
          var dMeters = geometryEngine.distance(bufferCenter, p32643, "meters");
          var dTxt = formatDistanceLabel(dMeters);
          var cat0 = String(detail.category || "location");
          setStatus("Zoomed to " + cat0 + ". Distance from buffer center: " + dTxt + ".");
        });
      } else {
        clearConnectorGraphics();
      }
    }
    return view.goTo({ center: pWeb, zoom: zoomLvl, padding: getUiZoomPadding() }).then(function () {
      var cat = String(detail.category || "location");
      if (!p32643) {
        setStatus("Zoomed to " + cat + " location.");
      } else {
        var center = resolveBufferCenterPoint32643();
        if (!center || center.type !== "point") {
          setStatus("Zoomed to " + cat + " location.");
        }
      }
    });
  }).catch(function (err) {
    console.warn("[community zoom] failed", err);
  });
}

function onCommunityFocusCategory(event) {
  if (!event || !event.detail) return;
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  var detail = event.detail || {};
  projection.load().then(function () {
    return drawCommunityCategoryConnectors(detail);
  }).catch(function (err) {
    console.warn("[community category focus] failed", err);
  });
}

function onCommunityClearGraphics(event) {
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  try { clearConnectorGraphics(); } catch (e0) {}
  try { clearCommunityZoomGraphic(); } catch (e1) {}
  try { clearResults(); } catch (e2) {}
  try { clearBufferAnchorMarker(); } catch (e3) {}
  try {
    closestPointPickModeActive = false;
    quickBufferAutoRunAfterAnchorPick = false;
    quickProximityAutoRunAfterAnchorPick = false;
    setBufferMarkMode(false, false);
  } catch (e4) {}
  setStatus("Community lines and buffer cleared.");
}

window.addEventListener("msme-gis-zoom-to-location", onCommunityZoomToLocation);
window.addEventListener("msme-gis-focus-community-category", onCommunityFocusCategory);
window.addEventListener("msme-gis-clear-community-graphics", onCommunityClearGraphics);

view.on("click", function (event) {
  if (view && view.popup && view.popup.visible) {
    try { view.popup.close(); } catch (eClose) {}
  }
  if (sketchVM && sketchVM.state === "active") return;
  if (bufferMarkModeActive) {
    projection.load().then(function () {
      bufferMarkPoint32643 = projection.project(event.mapPoint, SR_METER);
      var shouldRunClosestPointMode = !!closestPointPickModeActive;
      closestPointPickModeActive = false;
      setBufferMarkMode(false, false);
      bufferMarkLayer.removeAll();
      var gw = projection.project(bufferMarkPoint32643, SR_WEB);
      bufferMarkLayer.add(new Graphic({ geometry: gw, symbol: symBufferMark }));
      if (shouldRunClosestPointMode) {
        runClosestFromPickedPoint(bufferMarkPoint32643, closestPointBufferMeters);
        return;
      }
      var shouldQuickRun = !!quickBufferAutoRunAfterAnchorPick;
      quickBufferAutoRunAfterAnchorPick = false;
      var shouldProxRun = !!quickProximityAutoRunAfterAnchorPick;
      quickProximityAutoRunAfterAnchorPick = false;
      if (shouldQuickRun) {
        var curBufDist = parseInt((document.getElementById("bufDist") || {}).value, 10);
        if (!isFinite(curBufDist) || curBufDist <= 0) curBufDist = 1500;
        setStatus("Buffer anchor point set. Running " + curBufDist + " m buffer...");
        var runBtn = document.getElementById("runBuffer");
        if (runBtn) runBtn.click();
      } else if (shouldProxRun) {
        var curProxDist = parseInt((document.getElementById("proxDist") || {}).value, 10);
        if (!isFinite(curProxDist) || curProxDist <= 0) curProxDist = 2000;
        setStatus("Point set. Running Proximity analysis (" + curProxDist + " m)...");
        var proxBtn = document.getElementById("runProximity");
        if (proxBtn) proxBtn.click();
      } else {
        setStatus("Buffer anchor point set ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â adjust search radius, then Run buffer.");
      }
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
      window.removeEventListener("msme-gis-zoom-to-location", onCommunityZoomToLocation);
    } catch (eZ) {}
    try {
      window.removeEventListener("msme-gis-focus-community-category", onCommunityFocusCategory);
    } catch (eZ2) {}
    try {
      window.removeEventListener("msme-gis-clear-community-graphics", onCommunityClearGraphics);
    } catch (eZ3) {}
    try {
      if (onMsmeGisLoading) window.removeEventListener("msme-gis-loading", onMsmeGisLoading);
    } catch (eL) {}
    try {
      setGisLoadingVisible(false);
    } catch (eLH) {}
    try {
      clearCommunityZoomGraphic();
    } catch (eZG) {}
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
      if (basemapWatchHandle && typeof basemapWatchHandle.remove === "function") basemapWatchHandle.remove();
    } catch (eW) {}
    basemapWatchHandle = null;
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
  return enforceSingleDistrictLabelSource();
}).then(function () {
  if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
  view.extent = getInitialMapExtent();
  refreshMapViewPadding();
  view.when(function () {
    if (typeof window !== "undefined" && window.__msmeGisBootId !== myBootId) return;
    refreshMapViewPadding();
    initSketchViewModel();
    applyInitialRequestedLayerPreset();
    setStatus("");
  });
  // Non-blocking background warmups.
  Promise.resolve().then(function () {
    return loadDistricts();
  }).catch(function (err) {
    console.warn("[init] district list load failed", err);
  });
  Promise.resolve().then(function () {
    return buildCadastralLayerIndex();
  }).catch(function (err) {
    console.warn("[init] cadastral index load failed", err);
  });
  if (typeof window !== "undefined" && window.__msmeGisBootId === myBootId) {
    window.__msmeGisInitialized = true;
    window.__msmeGisInitInProgress = false;
  }
  setStatus("Ready. Haryana administrative boundaries are loaded.");
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



