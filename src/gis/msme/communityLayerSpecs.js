import { BASE_MS, INV_MS, SOC_MS, TRANS_MS, UTIL_MS, LAYER_ROADS_LINE } from "./serviceUrlsAndLayers.js";

export var SCHOOL_LAYER_DEFS = [
  { url: SOC_MS, layerId: 0 },
  { url: SOC_MS, layerId: 1 },
  { url: SOC_MS, layerId: 2 },
  { url: SOC_MS, layerId: 19 }
];

export var COMMUNITY_SUMMARY_LAYER_SPECS = [
  {
    key: "schools",
    label: "Schools",
    layers: SCHOOL_LAYER_DEFS
  },
  {
    key: "iti",
    label: "ITI",
    layers: [{ url: SOC_MS, layerId: 3 }]
  },
  {
    key: "hospitals",
    label: "Hospitals",
    layers: [
      { url: SOC_MS, layerId: 5 },
      { url: SOC_MS, layerId: 6 },
      { url: SOC_MS, layerId: 7 },
      { url: SOC_MS, layerId: 8 }
    ]
  },
  {
    key: "governmentHospitals",
    label: "Government Hospital",
    layers: [{ url: SOC_MS, layerId: 5 }]
  },
  {
    key: "phcChc",
    label: "PHC & CHC",
    layers: [{ url: SOC_MS, layerId: 6 }]
  },
  {
    key: "aayushBharatFacilities",
    label: "Aayush Bharat Facilites",
    layers: [{ url: SOC_MS, layerId: 7 }]
  },
  {
    key: "privateHospitals",
    label: "Private Hospital",
    layers: [{ url: SOC_MS, layerId: 8 }]
  },
  {
    key: "electricPoles",
    label: "Electric poles",
    layers: [{ url: UTIL_MS, layerId: 14 }]
  },
  {
    key: "electricStations",
    label: "Electric Station",
    layers: [{ url: UTIL_MS, layerId: 36 }]
  },
  {
    key: "secUgElectricLineSegments",
    label: "SecUG Electric Line Segment",
    layers: [{ url: UTIL_MS, layerId: 29 }]
  },
  {
    key: "roads",
    label: "Roads",
    layers: [{ url: TRANS_MS, layerId: LAYER_ROADS_LINE }]
  },
  {
    key: "airports",
    label: "Airports",
    layers: [{ url: TRANS_MS, layerId: 0 }]
  },
  {
    key: "mobileTowers",
    label: "Mobile towers",
    layers: [{ url: UTIL_MS, layerId: 0 }]
  },
  {
    key: "policeStations",
    label: "Police Station",
    layers: [{ url: SOC_MS, layerId: 26 }]
  },
  {
    key: "industrialSites",
    label: "Industrial Sites",
    layers: [{ url: INV_MS, layerId: 0 }]
  },
  {
    key: "proposedMetroStations",
    label: "Proposed Metro Station",
    layers: [{ url: TRANS_MS, layerId: 7 }]
  },
  {
    key: "canals",
    label: "Canals",
    layers: [{ url: BASE_MS, layerId: 2 }]
  },
  {
    key: "hsvpPlots",
    label: "HSVP Plots",
    layers: [{ url: SOC_MS, layerId: 15 }]
  },
  {
    key: "hsvpSectorBoundary",
    label: "HSVP Sector Boundary",
    layers: [{ url: SOC_MS, layerId: 16 }]
  },
  {
    key: "entertainment",
    label: "Entertainment",
    layers: []
  }
];
