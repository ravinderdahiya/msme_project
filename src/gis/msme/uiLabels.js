/** Dropdown / status labels for cadastral + admin selects (updated from React i18n). */
var GIS_UI_DEFAULTS = {
  district: "District",
  tehsil: "Tehsil",
  village: "Village",
  vidhanSabha: "Vidhan Sabha constituency",
  lokSabha: "Lok Sabha constituency",
  muraba: "Muraba",
  parcel: "Parcel",
  cadKhasraPlaceholder: "Select khasra (optional ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â or zoom muraba only)",
  allTehsils: "All tehsils",
  allVillages: "All villages",
  mapPopupTitle: "Features at this location",
  hsvpSector: "Sector / area",
  hsvpPlot: "Plot no"
};

var __gisUi = Object.assign({}, GIS_UI_DEFAULTS);
var refreshGisPlaceholderLabelsImpl = function () {};

export function gisPh(key) {
  var v = __gisUi[key];
  return v != null && v !== "" ? v : GIS_UI_DEFAULTS[key] || key;
}

export function setRefreshGisPlaceholderLabelsImpl(handler) {
  refreshGisPlaceholderLabelsImpl = typeof handler === "function" ? handler : function () {};
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
