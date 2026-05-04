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
export const SELECT_LAND_PATH = "/newmainmap/select-land";
export const BASE_MAP_PATH = "/newmainmap";

export const LAYER_ITEMS = [
  { id: "schools", label: "Schools", defaultOn: true },
  { id: "hospitals", label: "Hospitals", defaultOn: true },
  { id: "bus", label: "Bus Stands", defaultOn: true },
  { id: "railway", label: "Railway Stations", defaultOn: true },
  { id: "power", label: "Power Stations", defaultOn: true },
  { id: "roads", label: "Roads", defaultOn: true },
  { id: "police", label: "Police Stations", defaultOn: false },
  { id: "industrial", label: "Industrial Areas", defaultOn: false },
  { id: "water", label: "Water Bodies", defaultOn: false },
  { id: "other", label: "Other Layers", defaultOn: false },
];

export function buildDefaultSelection() {
  return Object.fromEntries(LAYER_ITEMS.map((l) => [l.id, l.defaultOn]));
}

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

export const AOI_LAND_OPTIONS = [
  { id: "administrative-aoi", label: "Administrative AOI" },
  { id: "parliamentary-boundary", label: "Parliamentary Boundary" },
  { id: "assembly-boundary", label: "Assembly Boundary" },
  { id: "department-cadastral", label: "Department cadastral" },
  { id: "hsvp-land", label: "HSVP Land" },
];
