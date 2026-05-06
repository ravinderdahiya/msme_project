import { BASE_MS, SOC_MS, TRANS_MS, UTIL_MS, LAYER_ROADS_LINE } from "./serviceUrlsAndLayers.js";

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
    key: "electricPoles",
    label: "Electric poles",
    layers: [{ url: UTIL_MS, layerId: 14 }]
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
    key: "canals",
    label: "Canals",
    layers: [{ url: BASE_MS, layerId: 2 }]
  },
  {
    key: "entertainment",
    label: "Entertainment",
    layers: []
  }
];
