export function readLandReportDomContext() {
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
      sector: tx("hsvpSectorSelect"),
      plot: tx("hsvpPlotSelect")
    }
  };
}
