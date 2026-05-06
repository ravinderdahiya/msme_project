export function parseCoordTextPair(text) {
  if (text == null) return null;
  var raw = String(text).trim();
  if (!raw) return null;
  var parts = raw.split(/[,\s]+/).filter(Boolean);
  if (parts.length < 2) return null;
  var x = Number(parts[0]);
  var y = Number(parts[1]);
  if (!isFinite(x) || !isFinite(y)) return null;
  return [x, y];
}

export function normalizeEsriCoordNode(node) {
  if (Array.isArray(node)) {
    if (node.length === 2 && isFinite(Number(node[0])) && isFinite(Number(node[1]))) {
      return [Number(node[0]), Number(node[1])];
    }
    if (node.length === 1 && typeof node[0] === "string") {
      var pair = parseCoordTextPair(node[0]);
      if (pair) return pair;
    }
    var out = [];
    for (var i = 0; i < node.length; i++) {
      var child = normalizeEsriCoordNode(node[i]);
      if (child != null) out.push(child);
    }
    return out;
  }
  if (typeof node === "string") {
    var parsed = parseCoordTextPair(node);
    if (parsed) return parsed;
  }
  return node;
}

export function normalizeEsriGeometryJson(geomJson) {
  if (!geomJson || typeof geomJson !== "object") return geomJson;
  var out = Object.assign({}, geomJson);
  if (Array.isArray(geomJson.rings)) out.rings = normalizeEsriCoordNode(geomJson.rings);
  if (Array.isArray(geomJson.paths)) out.paths = normalizeEsriCoordNode(geomJson.paths);
  if (Array.isArray(geomJson.points)) out.points = normalizeEsriCoordNode(geomJson.points);
  return out;
}
