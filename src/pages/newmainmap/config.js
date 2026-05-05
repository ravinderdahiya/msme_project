import {
  BarChart3,
  BookOpen,
  Bookmark,
  Clock3,
  FileText,
  HelpCircle,
  Layers3,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export const LAYERS_PATH = "/newmainmap/layers";
export const BUFFER_PATH = "/newmainmap/buffer";
export const ANALYSIS_PATH = "/newmainmap/analysis";
export const NEARBY_PLACES_PATH = "/newmainmap/nearby-places";
export const SELECT_LAND_PATH = "/newmainmap/select-land";
export const BASE_MAP_PATH = "/newmainmap";

/** Parent layer groups; each contains `sublayers` toggled independently on the map. */
export const LAYER_GROUPS = [
  {
    id: "social-civic",
    label: "Social & civic",
    sublayers: [
      { id: "schools", label: "Schools", defaultOn: true },
      { id: "hospitals", label: "Hospitals", defaultOn: true },
      { id: "police", label: "Police Stations", defaultOn: false },
    ],
  },
  {
    id: "transport",
    label: "Transport",
    sublayers: [
      { id: "bus", label: "Bus Stands", defaultOn: true },
      { id: "railway", label: "Railway Stations", defaultOn: true },
      { id: "roads", label: "Roads", defaultOn: true },
    ],
  },
  {
    id: "utilities-environment",
    label: "Utilities & environment",
    sublayers: [
      { id: "power", label: "Power Stations", defaultOn: true },
      { id: "water", label: "Water Bodies", defaultOn: false },
    ],
  },
  {
    id: "land-use",
    label: "Land use",
    sublayers: [
      { id: "industrial", label: "Industrial Areas", defaultOn: false },
      { id: "other", label: "Other Layers", defaultOn: false },
    ],
  },
];

export function getAllSublayerEntries() {
  return LAYER_GROUPS.flatMap((g) => g.sublayers.map((s) => ({ ...s, groupId: g.id })));
}

export function buildDefaultSelection() {
  return Object.fromEntries(getAllSublayerEntries().map((s) => [s.id, s.defaultOn]));
}

/** @deprecated Use LAYER_GROUPS; kept for buffer summary keys etc. */
export const LAYER_ITEMS = getAllSublayerEntries();

export const sidebarMenu = [
  {
    key: "select-land",
    title: "Select Land",
    subtitle: "Choose & select land",
    icon: MapPin,
    route: SELECT_LAND_PATH,
  },
  {
    key: "layers",
    title: "Layers",
    subtitle: "View and manage layers",
    icon: Layers3,
    route: LAYERS_PATH,
  },
  {
    key: "analysis",
    title: "Analysis",
    subtitle: "Distance & proximity",
    icon: BarChart3,
    route: ANALYSIS_PATH,
  },
  {
    key: "buffer",
    title: "Buffer Tool",
    subtitle: "Create buffer zones",
    icon: ShieldCheck,
    route: BUFFER_PATH,
  },
  {
    key: "land-details",
    title: "Land Details",
    subtitle: "View land information",
    icon: FileText,
  },
  {
    key: "suitability",
    title: "Suitability Score",
    subtitle: "Check land suitability",
    icon: MapPin,
  },
  {
    key: "reports",
    title: "Reports",
    subtitle: "Generate reports",
    icon: BookOpen,
  },
];

export const otherMenu = [
  { title: "Bookmarks", subtitle: "Saved locations", icon: Bookmark },
  { title: "History", subtitle: "Recent activities", icon: Clock3 },
  { title: "Help & Support", subtitle: "Get help", icon: HelpCircle },
];

export const BUFFER_PRESETS = ["1 km", "5 km", "10 km", "Custom"];
export const BUFFER_SUMMARY = [
  { id: "schools", label: "Schools", count: 8 },
  { id: "hospitals", label: "Hospitals", count: 3 },
  { id: "bus", label: "Bus Stands", count: 5 },
  { id: "railway", label: "Railway Stations", count: 2 },
  { id: "power", label: "Power Stations", count: 2 },
];

export const ANALYSIS_AMENITIES = [
  { id: "school", label: "Govt. High School", type: "School", distance: "1.2 km", color: "#2a6ee8" },
  { id: "hospital", label: "City Hospital", type: "Hospital", distance: "2.5 km", color: "#ef4444" },
  { id: "bus", label: "New Bus Stand", type: "Bus Stand", distance: "3.0 km", color: "#a855f7" },
  { id: "railway", label: "Railway Station", type: "Railway Station", distance: "3.8 km", color: "#22c55e" },
  { id: "power", label: "Power Grid Station", type: "Power Station", distance: "4.2 km", color: "#10b981" },
  { id: "police", label: "Police Station", type: "Police Station", distance: "4.5 km", color: "#4f46e5" },
];

/** Sample rows for the map “Nearby Places” right panel (replace with API results later). */
export const NEARBY_PLACES_RESULTS = [
  { id: "np1", name: "Govt. Senior Secondary School", category: "School", categoryKey: "school", distanceLabel: "1.2 km", distanceKm: 1.2, status: "Open", color: "#2a6ee8" },
  { id: "np2", name: "City Civil Hospital", category: "Hospital", categoryKey: "hospital", distanceLabel: "1.8 km", distanceKm: 1.8, status: "Open", color: "#ef4444" },
  { id: "np3", name: "Indian Oil Petrol Pump", category: "Petrol Pump", categoryKey: "petrol", distanceLabel: "2.1 km", distanceKm: 2.1, status: "Open", color: "#16a34a" },
  { id: "np4", name: "SBI ATM — Sector 12", category: "ATM", categoryKey: "atm", distanceLabel: "2.4 km", distanceKm: 2.4, status: "Open", color: "#a855f7" },
  { id: "np5", name: "New Bus Stand", category: "Bus Stand", categoryKey: "bus", distanceLabel: "2.9 km", distanceKm: 2.9, status: "Open", color: "#f97316" },
  { id: "np6", name: "District Library", category: "School", categoryKey: "school", distanceLabel: "3.2 km", distanceKm: 3.2, status: "Open", color: "#2a6ee8" },
  { id: "np7", name: "HP Fuel Station", category: "Petrol Pump", categoryKey: "petrol", distanceLabel: "3.6 km", distanceKm: 3.6, status: "Open", color: "#16a34a" },
  { id: "np8", name: "Community Health Centre", category: "Hospital", categoryKey: "hospital", distanceLabel: "4.1 km", distanceKm: 4.1, status: "Open", color: "#ef4444" },
];

export const AOI_LAND_OPTIONS = [
  { id: "administrative-aoi", label: "Administrative AOI" },
  { id: "parliamentary-boundary", label: "Parliamentary Boundary" },
  { id: "assembly-boundary", label: "Assembly Boundary" },
  { id: "department-cadastral", label: "Department cadastral" },
  { id: "hsvp-land", label: "HSVP Land" },
];
