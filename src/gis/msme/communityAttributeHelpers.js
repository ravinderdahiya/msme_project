export function isMainRoadFeature(attrs) {
  var a = attrs || {};
  var cat = String(a.road_catog != null ? a.road_catog : (a.ROAD_CATOG != null ? a.ROAD_CATOG : "")).toUpperCase();
  var nm = String(a.rd_name != null ? a.rd_name : (a.RD_NAME != null ? a.RD_NAME : "")).toUpperCase();
  if (!cat && !nm) return false;
  if (cat.indexOf("NH") >= 0 || cat.indexOf("SH") >= 0 || cat.indexOf("MDR") >= 0 || cat.indexOf("MAJOR") >= 0 || cat.indexOf("MAIN") >= 0) return true;
  if (nm.indexOf("NH") >= 0 || nm.indexOf("SH") >= 0 || nm.indexOf("HIGHWAY") >= 0) return true;
  return false;
}

export function featureOid(attrs) {
  var a = attrs || {};
  if (a.OBJECTID != null) return String(a.OBJECTID);
  if (a.objectid != null) return String(a.objectid);
  return null;
}

export function extractCommunityPlaceNameFromAttributes(attrs, categoryKey, fallbackIndex) {
  var a = attrs || {};
  var key = String(categoryKey || "").toLowerCase();
  var hospitalFirst = [
    a.hospital_name, a.HOSPITAL_NAME,
    a.hospitalName, a.HOSPITALNAME,
    a.health_centre, a.HEALTH_CENTRE,
    a.phc_name, a.PHC_NAME
  ];
  var schoolFirst = [
    a.school_name, a.SCHOOL_NAME,
    a.schoolName, a.SCHOOLNAME,
    a.sch_name, a.SCH_NAME
  ];
  var itiFirst = [
    a.iti_name, a.ITI_NAME,
    a.itiName, a.ITI_NAME_EN,
    a.institute_name, a.INSTITUTE_NAME,
    a.instituteName
  ];
  var candidates = [
    a.name, a.NAME,
    a.title, a.TITLE,
    a.place_name, a.PLACE_NAME,
    a.facility_name, a.FACILITY_NAME
  ];
  var ordered = candidates;
  if (key === "schools") ordered = schoolFirst.concat(itiFirst, hospitalFirst, candidates);
  else if (key === "iti") ordered = itiFirst.concat(schoolFirst, hospitalFirst, candidates);
  else if (key === "hospitals") ordered = hospitalFirst.concat(schoolFirst, itiFirst, candidates);
  else ordered = hospitalFirst.concat(schoolFirst, itiFirst, candidates);
  for (var i = 0; i < ordered.length; i++) {
    var val = ordered[i];
    if (val != null) {
      var txt = String(val).trim();
      if (txt) return txt;
    }
  }
  if (key === "schools") return "School " + String((fallbackIndex || 0) + 1);
  if (key === "iti") return "ITI " + String((fallbackIndex || 0) + 1);
  if (key === "hospitals") return "Hospital " + String((fallbackIndex || 0) + 1);
  return "Location " + String((fallbackIndex || 0) + 1);
}
