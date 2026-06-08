import {
  BarChart3,
  BookOpen,
  Bookmark,
  CircleDot,
  Clock3,
  FileText,
  HelpCircle,
  Home,
  Layers3,
  Map,
  MapPin,
  Navigation,
  Settings2,
  ShieldCheck,
  SquareStack,
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
      { id: "bus", label: "Bus Stands", defaultOn: false },
      { id: "railway", label: "Railway Stations", defaultOn: true },
      { id: "roads", label: "Roads", defaultOn: false },
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
      { id: "imagery", label: "Imagery", defaultOn: true },
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

/** Left rail — swap `icon` / `iconSrc` with your own assets when ready. */
export const railMenu = [
  { key: "tools", label: "Tools", icon: Settings2 },
  { key: "ministries", label: "Ministries", icon: SquareStack },
  { key: "state-layers", label: "State Layers", icon: Map },
  { key: "mandatory-layers", label: "Mandatory Layers", icon: Layers3 },
  { key: "layers", label: "Layers", icon: Layers3, route: LAYERS_PATH },
  { key: "active-layers", label: "Active layers", icon: CircleDot },
];

/** Tools grid — placeholder icons; replace with image URLs via `iconSrc` later. */
export const toolsGrid = [
  { key: "home", label: "Home", icon: Home },
  { key: "terrain", label: "ThreeDTerrain", icon: Map },
  { key: "navigation", label: "Navigation", icon: Navigation },
  { key: "select-land", label: "Select Land", icon: MapPin, route: SELECT_LAND_PATH },
  { key: "add-project", label: "Add Project", icon: CircleDot },
  { key: "water-pipeline", label: "Add Water Pipeline", icon: CircleDot },
  { key: "catchment", label: "Catchment Area", icon: CircleDot },
  { key: "gap-analyzer", label: "Dynamic Gap Analyzer", icon: CircleDot },
  { key: "bus-station", label: "Proposed Bus Station", icon: CircleDot },
  { key: "swipe-layers", label: "Swipe Layers", icon: Layers3, route: LAYERS_PATH },
  { key: "route", label: "Route", icon: CircleDot },
  { key: "permission", label: "Permission", icon: CircleDot },
  { key: "extraction", label: "Extraction", icon: CircleDot },
  { key: "find-location", label: "Find Location", icon: MapPin },
  { key: "od-tool", label: "OD Tool", icon: CircleDot },
  { key: "go-area", label: "Go Area", icon: CircleDot },
  { key: "layers", label: "Layers", icon: Layers3, route: LAYERS_PATH },
  { key: "analysis", label: "Analysis", icon: BarChart3, route: ANALYSIS_PATH },
  { key: "buffer", label: "Buffer Tool", icon: ShieldCheck, route: BUFFER_PATH },
  { key: "land-details", label: "Land Details", icon: FileText },
  { key: "reports", label: "Reports", icon: BookOpen },
];

export const MAP_LEGEND_ITEMS = [
  { id: "village", label: "Village Boundary", style: "dashed" },
  { id: "sub-district", label: "Sub-District Boundary", style: "dash-dot" },
  { id: "district", label: "District Boundary", style: "solid-bold" },
  { id: "state", label: "State Boundary", style: "solid" },
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
