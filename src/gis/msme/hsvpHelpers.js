export function normalizeDistrictName(v) {
  return String(v == null ? "" : v).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Investment dataset still carries older district names in some rows.
 * Use aliases so newly carved districts can still resolve sectors.
 */
export var HSVP_DISTRICT_ALIASES = {
  charkhidadri: ["Bhiwani"],
  nuh: ["Mewat"]
};

export function getHsvpDistrictNameByCode(dCode) {
  var hd = document.getElementById("hsvpDistrictSelect");
  if (!hd || !dCode || !hd.options) return "";
  var code = String(dCode).trim();
  for (var i = 0; i < hd.options.length; i++) {
    var opt = hd.options[i];
    if (String(opt.value || "").trim() === code) {
      return String(opt.text || "").trim();
    }
  }
  return "";
}

export function hsvpPlotOid(attrs) {
  var a = attrs || {};
  var oid = a.objectid != null ? a.objectid : (a.OBJECTID != null ? a.OBJECTID : null);
  if (oid == null) return null;
  var n = Number(oid);
  return isFinite(n) ? n : null;
}

export function hsvpPlotNo(attrs, oid) {
  var a = attrs || {};
  var plotNo =
    a.alloted_reg_num != null ? a.alloted_reg_num :
    (a.ALLOTED_REG_NUM != null ? a.ALLOTED_REG_NUM :
    (a.reg_no != null ? a.reg_no :
    (a.REG_NO != null ? a.REG_NO : "")));
  var clean = String(plotNo || "").trim();
  if (clean) return clean;
  return String(oid);
}

export function hsvpPlotName(attrs, oid) {
  var a = attrs || {};
  var nm =
    a.firm_name != null ? a.firm_name :
    (a.FIRM_NAME != null ? a.FIRM_NAME :
    (a.n_name != null ? a.n_name :
    (a.Name != null ? a.Name :
    (a.NAME != null ? a.NAME :
    (a.PLOT_NAME != null ? a.PLOT_NAME :
    (a.REMARKS != null ? a.REMARKS : ""))))));
  var clean = String(nm || "").trim();
  if (clean) return clean;
  return "Industrial plot " + String(oid);
}

export function hsvpSectorAreaLabel(attrs) {
  var a = attrs || {};
  var addr = String(a.address != null ? a.address : (a.ADDRESS != null ? a.ADDRESS : "")).trim();
  if (addr) {
    var m = addr.match(/\bsector\s*[- ]*\s*([a-z0-9]+)/i);
    if (m && m[1]) return "Sector " + String(m[1]).toUpperCase();
    var first = addr.split(",")[0];
    if (first) {
      var cleanFirst = String(first).trim();
      if (cleanFirst) return cleanFirst;
    }
  }
  var cls = String(
    a.classification_of_area != null
      ? a.classification_of_area
      : (a.CLASSIFICATION_OF_AREA != null ? a.CLASSIFICATION_OF_AREA : "")
  ).trim();
  if (cls) return cls;
  return "Other area";
}

export function hsvpSectorKey(label) {
  var s = String(label || "").trim();
  if (!s) return "otherarea";
  var key = normalizeDistrictName(s);
  return key || "otherarea";
}
