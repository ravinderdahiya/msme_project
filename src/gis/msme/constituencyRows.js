export function constituencyRowsFromFeatures(features, codeField, nameField) {
  var rows = [];
  var seen = {};
  (features || []).forEach(function (f) {
    var attrs = f && f.attributes ? f.attributes : {};
    var code = attrs[codeField];
    if (code == null || code === "") return;
    var key = String(code).trim();
    if (!key || seen[key]) return;
    seen[key] = true;
    var oidRaw = attrs.objectid != null ? attrs.objectid : attrs.OBJECTID;
    var oidNum = Number(oidRaw);
    rows.push({
      code: key,
      name: String(attrs[nameField] || key).trim() || key,
      oid: isFinite(oidNum) ? Math.trunc(oidNum) : null
    });
  });
  rows.sort(function (a, b) {
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  return rows;
}
