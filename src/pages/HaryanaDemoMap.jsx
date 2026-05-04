import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./HaryanaDemoMap.css";

const haryanaCenter = [29.0, 76.0];
const haryanaZoom = 7;
const fallbackBounds = [
  [27.6, 74.4],
  [30.98, 77.63],
];

const quickFocus = [
  {
    id: "state",
    label: "Full Haryana",
    description: "Fit the statewide administrative extent",
    bounds: fallbackBounds,
  },
  {
    id: "ncr",
    label: "NCR Belt",
    description: "Gurugram, Faridabad, Sonipat growth edge",
    bounds: [
      [28.15, 76.7],
      [29.2, 77.45],
    ],
  },
  {
    id: "north",
    label: "Northern Belt",
    description: "Ambala, Panchkula, Yamunanagar corridor",
    bounds: [
      [29.7, 76.45],
      [30.65, 77.5],
    ],
  },
];

const industrialNodes = [
  {
    id: "imt-manesar",
    name: "IMT Manesar",
    position: [28.36, 76.94],
    category: "Automotive Cluster",
  },
  {
    id: "kundli",
    name: "Kundli",
    position: [28.99, 77.05],
    category: "Logistics Hub",
  },
  {
    id: "panipat-refinery",
    name: "Panipat Refinery",
    position: [29.42, 76.96],
    category: "Energy Corridor",
  },
  {
    id: "hisar-steel",
    name: "Hisar Industrial Belt",
    position: [29.13, 75.74],
    category: "Metals and Fabrication",
  },
];

const connectivityCorridor = [
  [28.41, 77.32],
  [28.46, 77.03],
  [28.99, 77.02],
  [29.39, 76.96],
  [29.69, 76.99],
  [30.38, 76.78],
];

// Layer data URLs - Update these paths to your actual data
const layerDataUrls = {
  roads: "/data/haryana-roads.geojson",
  buildings: "/data/haryana-buildings.geojson",
  rivers: "/data/haryana-rivers.geojson",
  elevation: "/data/haryana-elevation.geojson",
  landuse: "/data/haryana-landuse.geojson",
  vegetation: "/data/haryana-vegetation.geojson",
  soil: "/data/haryana-soil.geojson",
  population: "/data/haryana-population.geojson",
  transport: "/data/haryana-transport.geojson",
  boundaries: "/data/haryana-admin-boundaries.geojson",
};

const demoIcon = new L.DivIcon({
  className: "demo-map-pin",
  html: '<span class="demo-map-pin__core"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function toDistrictId(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getFeatureCenter(feature) {
  const layer = L.geoJSON(feature);
  return layer.getBounds().getCenter();
}

function getAssemblyFeatureId(feature, index = 0) {
  const props = feature?.properties || {};
  const rawId =
    props.ac_no ??
    props.AC_NO ??
    props.const_id ??
    props.CONST_ID ??
    props.objectid ??
    props.OBJECTID ??
    props.id ??
    props.ID ??
    index;
  return String(rawId);
}

function getAssemblyFeatureName(feature) {
  const props = feature?.properties || {};
  return (
    props.ac_name ??
    props.AC_NAME ??
    props.const_name ??
    props.CONST_NAME ??
    props.constituency ??
    props.CONSTITUENCY ??
    props.vidhan_sabha ??
    props.VIDHAN_SABHA ??
    props.name ??
    props.NAME ??
    "Assembly Constituency"
  );
}

function FitToStateBounds({ stateGeoJson }) {
  const map = useMap();

  useEffect(() => {
    if (!stateGeoJson) return;
    const layer = new L.GeoJSON(stateGeoJson);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, stateGeoJson]);

  return null;
}

function MapViewport({ activeFocus, selectedLocation, stateGeoJson }) {
  const map = useMap();

  const fitState = () => {
    if (stateGeoJson) {
      const layer = new L.GeoJSON(stateGeoJson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
        return;
      }
    }
    map.fitBounds(fallbackBounds, { padding: [20, 20] });
  };

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();
  const focusSelected = () => selectedLocation && map.flyTo(selectedLocation.position, 10, { duration: 1.1 });
  const goToZone = () => activeFocus ? map.fitBounds(activeFocus.bounds, { padding: [20, 20] }) : fitState();

  return (
    <div className="demo-map-controls">
      <button onClick={zoomIn} type="button">+</button>
      <button onClick={zoomOut} type="button">-</button>
      <button onClick={fitState} type="button">State</button>
      <button onClick={focusSelected} disabled={!selectedLocation} type="button">Focus</button>
      <button onClick={goToZone} type="button">Zone</button>
    </div>
  );
}

function MapClickReader({ onPickPoint }) {
  useMapEvents({
    click(event) {
      onPickPoint(event.latlng);
    },
  });
  return null;
}

function HaryanaDemoMap() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("gurugram");
  const [activeFocusId, setActiveFocusId] = useState("state");

  // Core layer toggles
  const [showStateBoundary, setShowStateBoundary] = useState(true);
  const [showDistrictBoundaries, setShowDistrictBoundaries] = useState(true);
  const [showDistrictLabels, setShowDistrictLabels] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [showCorridor, setShowCorridor] = useState(true);

  // New thematic layer toggles
  const [showRoads, setShowRoads] = useState(false);
  const [showBuildings, setShowBuildings] = useState(false);
  const [showRivers, setShowRivers] = useState(false);
  const [showElevation, setShowElevation] = useState(false);
  const [showLandUse, setShowLandUse] = useState(false);
  const [showVegetation, setShowVegetation] = useState(false);
  const [showSoil, setShowSoil] = useState(false);
  const [showPopulation, setShowPopulation] = useState(false);
  const [showTransport, setShowTransport] = useState(false);
  const [showAdditionalBoundaries, setShowAdditionalBoundaries] = useState(false);

  const [pickedPoint, setPickedPoint] = useState(null);
  const [stateGeoJson, setStateGeoJson] = useState(null);
  const [districtGeoJson, setDistrictGeoJson] = useState(null);

  // Thematic layer GeoJSON states
  const [roadsGeoJson, setRoadsGeoJson] = useState(null);
  const [buildingsGeoJson, setBuildingsGeoJson] = useState(null);
  const [riversGeoJson, setRiversGeoJson] = useState(null);
  const [elevationGeoJson, setElevationGeoJson] = useState(null);
  const [landuseGeoJson, setLanduseGeoJson] = useState(null);
  const [vegetationGeoJson, setVegetationGeoJson] = useState(null);
  const [soilGeoJson, setSoilGeoJson] = useState(null);
  const [populationGeoJson, setPopulationGeoJson] = useState(null);
  const [transportGeoJson, setTransportGeoJson] = useState(null);
  const [boundariesGeoJson, setBoundariesGeoJson] = useState(null);
  const [selectedAssemblyBoundaryId, setSelectedAssemblyBoundaryId] = useState(null);

  const [error, setError] = useState("");

  const clearAssemblySelection = () => {
    setSelectedAssemblyBoundaryId(null);
  };

  // Load core layers
  useEffect(() => {
    let isMounted = true;

    async function loadCoreLayers() {
      try {
        const [stateResponse, districtResponse] = await Promise.all([
          fetch("/data/haryana-state.geojson"),
          fetch("/data/haryana-districts.geojson"),
        ]);

        if (!stateResponse.ok || !districtResponse.ok) {
          throw new Error("Unable to load Haryana boundary data.");
        }

        const [stateData, districtData] = await Promise.all([
          stateResponse.json(),
          districtResponse.json(),
        ]);

        if (isMounted) {
          setStateGeoJson(stateData);
          setDistrictGeoJson(districtData);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load Haryana boundary data."
          );
        }
      }
    }

    loadCoreLayers();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load thematic layers on demand
  const loadLayerData = async (layerKey, setter) => {
    if (!layerDataUrls[layerKey]) return;
    try {
      const response = await fetch(layerDataUrls[layerKey]);
      if (response.ok) {
        const data = await response.json();
        setter(data);
      }
    } catch (e) {
      console.warn(`Failed to load ${layerKey}:`, e.message);
      setError(`${layerKey} data unavailable`);
    }
  };

  const districtLocations = useMemo(() => {
    if (!districtGeoJson?.features) return [];
    return districtGeoJson.features.map((feature) => {
      const districtName = feature.properties?.district || "Unknown district";
      const center = getFeatureCenter(feature);
      return {
        id: toDistrictId(districtName),
        name: districtName,
        district: districtName,
        note: `${districtName} district boundary`,
        position: [center.lat, center.lng],
      };
    });
  }, [districtGeoJson]);

  const searchableLocations = useMemo(
    () => [...districtLocations, ...industrialNodes],
    [districtLocations]
  );

  const selectedLocation = useMemo(
    () =>
      searchableLocations.find((item) => item.id === selectedId) ||
      districtLocations[0] ||
      industrialNodes[0],
    [districtLocations, searchableLocations, selectedId]
  );

  const filteredLocations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchableLocations;
    return searchableLocations.filter((item) => {
      const haystack = `${item.name} ${item.district || ""} ${item.category || ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, searchableLocations]);

  const activeFocus = quickFocus.find((item) => item.id === activeFocusId) || quickFocus[0];

  const districtLabelLayer = useMemo(() => {
    if (!showDistrictLabels) return null;
    return districtLocations.map((item) => (
      <CircleMarker
        key={item.id}
        center={item.position}
        eventHandlers={{ click: () => setSelectedId(item.id) }}
        pathOptions={{
          color: item.id === selectedId ? "#fde68a" : "#f59e0b",
          fillColor: "#f59e0b",
          fillOpacity: 0.75,
        }}
        radius={item.id === selectedId ? 6 : 4}
      >
        <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
          <span className="demo-map-label">{item.name}</span>
        </Tooltip>
      </CircleMarker>
    ));
  }, [districtLocations, selectedId, showDistrictLabels]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Layer styles
  const layerStyles = {
    roads: { color: "#ff6b35", weight: 2, opacity: 0.9 },
    buildings: { color: "#4ecdc4", weight: 1, fillColor: "#4ecdc4", fillOpacity: 0.3 },
    rivers: { color: "#2196f3", weight: 3, opacity: 0.8 },
    elevation: { color: "#ffeb3b", weight: 1, fillColor: "#ffeb3b", fillOpacity: 0.4 },
    landuse: { color: "#8bc34a", weight: 1, fillColor: "#8bc34a", fillOpacity: 0.3 },
    vegetation: { color: "#4caf50", weight: 1, fillColor: "#4caf50", fillOpacity: 0.4 },
    soil: { color: "#795548", weight: 1, fillColor: "#795548", fillOpacity: 0.3 },
    population: { color: "#e91e63", weight: 1, fillColor: "#e91e63", fillOpacity: 0.4 },
    transport: { color: "#ff9800", weight: 2, opacity: 0.9 },
    boundaries: { color: "#9c27b0", weight: 2, fillOpacity: 0 },
  };

  return (
    <div className="demo-map-page">
      <header className="demo-map-topbar">
        <div className="demo-map-brand">
          <div className="demo-map-brand__seal">H</div>
          <div>
            <p className="demo-map-brand__title">MSME, Haryana GIS</p>
            <p className="demo-map-brand__subtitle">
              Complete GIS workspace with 10+ thematic layers
            </p>
          </div>
        </div>
        <div className="demo-map-topbar__actions">
          <Link className="demo-map-topbar__link" to="/dashboard">Dashboard</Link>
          <button className="demo-map-topbar__button" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      <div className="demo-map-shell">
        <aside className="demo-map-sidebar">
          <section className="demo-map-panel">
            <p className="demo-map-panel__eyebrow">Search</p>
            <input
              className="demo-map-search"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="District, node, or address"
              type="text"
              value={query}
            />
            <div className="demo-map-list">
              {filteredLocations.map((item) => (
                <button
                  key={item.id}
                  className={item.id === selectedId ? "is-active" : ""}
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                >
                  <strong>{item.name}</strong>
                  <span>{item.category || item.note}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="demo-map-panel">
            <p className="demo-map-panel__eyebrow">Core Layers</p>
            <label>
              <input 
                checked={showStateBoundary} 
                onChange={(e) => setShowStateBoundary(e.target.checked)}
                type="checkbox" 
              /> 
              Haryana boundary
            </label>
            <label>
              <input 
                checked={showDistrictBoundaries} 
                onChange={(e) => setShowDistrictBoundaries(e.target.checked)}
                type="checkbox" 
              /> 
              District boundaries
            </label>
            <label>
              <input 
                checked={showDistrictLabels} 
                onChange={(e) => setShowDistrictLabels(e.target.checked)}
                type="checkbox" 
              /> 
              District labels
            </label>
            <label>
              <input 
                checked={showNodes} 
                onChange={(e) => setShowNodes(e.target.checked)}
                type="checkbox" 
              /> 
              Industrial nodes
            </label>
            <label>
              <input 
                checked={showCorridor} 
                onChange={(e) => setShowCorridor(e.target.checked)}
                type="checkbox" 
              /> 
              Logistics corridor
            </label>
          </section>

          <section className="demo-map-panel">
            <p className="demo-map-panel__eyebrow">Thematic Layers</p>
            <label>
              <input 
                checked={showRoads} 
                onChange={(e) => {
                  setShowRoads(e.target.checked);
                  if (e.target.checked && !roadsGeoJson) loadLayerData('roads', setRoadsGeoJson);
                }}
                type="checkbox" 
              /> 
              🛣️ Roads
            </label>
            <label>
              <input 
                checked={showBuildings} 
                onChange={(e) => {
                  setShowBuildings(e.target.checked);
                  if (e.target.checked && !buildingsGeoJson) loadLayerData('buildings', setBuildingsGeoJson);
                }}
                type="checkbox" 
              /> 
              🏢 Buildings
            </label>
            <label>
              <input 
                checked={showRivers} 
                onChange={(e) => {
                  setShowRivers(e.target.checked);
                  if (e.target.checked && !riversGeoJson) loadLayerData('rivers', setRiversGeoJson);
                }}
                type="checkbox" 
              /> 
              🌊 Rivers
            </label>
            <label>
              <input 
                checked={showElevation} 
                onChange={(e) => {
                  setShowElevation(e.target.checked);
                  if (e.target.checked && !elevationGeoJson) loadLayerData('elevation', setElevationGeoJson);
                }}
                type="checkbox" 
              /> 
              ⛰️ Elevation
            </label>
            <label>
              <input 
                checked={showLandUse} 
                onChange={(e) => {
                  setShowLandUse(e.target.checked);
                  if (e.target.checked && !landuseGeoJson) loadLayerData('landuse', setLanduseGeoJson);
                }}
                type="checkbox"
                />
                🌾 Land Use
            </label>
            <label>
              <input 
                checked={showVegetation} 
                onChange={(e) => {
                  setShowVegetation(e.target.checked);
                  if (e.target.checked && !vegetationGeoJson) loadLayerData('vegetation', setVegetationGeoJson);
                }}
                type="checkbox" 
              /> 
              🌳 Vegetation
            </label>
            <label>
              <input 
                checked={showSoil} 
                onChange={(e) => {
                  setShowSoil(e.target.checked);
                  if (e.target.checked && !soilGeoJson) loadLayerData('soil', setSoilGeoJson);
                }}
                type="checkbox" 
              /> 
              🟤 Soil
            </label>
            <label>
              <input 
                checked={showPopulation} 
                onChange={(e) => {
                  setShowPopulation(e.target.checked);
                  if (e.target.checked && !populationGeoJson) loadLayerData('population', setPopulationGeoJson);
                }}
                type="checkbox" 
              /> 
              👥 Population
            </label>
            <label>
              <input 
                checked={showTransport} 
                onChange={(e) => {
                  setShowTransport(e.target.checked);
                  if (e.target.checked && !transportGeoJson) loadLayerData('transport', setTransportGeoJson);
                }}
                type="checkbox" 
              /> 
              🚂 Transport
            </label>
            <div className="demo-map-layer-row">
              <label>
                <input 
                  checked={showAdditionalBoundaries} 
                  onChange={(e) => {
                    setShowAdditionalBoundaries(e.target.checked);
                    if (e.target.checked && !boundariesGeoJson) loadLayerData('boundaries', setBoundariesGeoJson);
                    if (!e.target.checked) setSelectedAssemblyBoundaryId(null);
                  }}
                  type="checkbox" 
                /> 
                🗺️ Assembly Boundaries
              </label>
              <button
                className="demo-map-clear-layer"
                disabled={!selectedAssemblyBoundaryId}
                onClick={clearAssemblySelection}
                type="button"
              >
                Clear
              </button>
            </div>
          </section>

          <section className="demo-map-panel">
            <p className="demo-map-panel__eyebrow">Quick Zones</p>
            <div className="demo-map-zones">
              {quickFocus.map((item) => (
                <button
                  key={item.id}
                  className={item.id === activeFocusId ? "is-active" : ""}
                  onClick={() => setActiveFocusId(item.id)}
                  type="button"
                >
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="demo-map-panel">
            <p className="demo-map-panel__eyebrow">Inspector</p>
            <h2>{selectedLocation?.name || "Haryana"}</h2>
            <p>{selectedLocation?.note || selectedLocation?.category || "State GIS layers"}</p>
            <div className="demo-map-meta">
              <span>📍 Coordinates: {selectedLocation ? `${selectedLocation.position[0].toFixed(4)}, ${selectedLocation.position[1].toFixed(4)}` : "29.0000, 76.0000"}</span>
              <span>🎯 Clicked: {pickedPoint ? `${pickedPoint.lat.toFixed(4)}, ${pickedPoint.lng.toFixed(4)}` : "Click map to inspect"}</span>
              <span>🗺️ Layers: {Object.values({showRoads, showBuildings, showRivers, showElevation, showLandUse, showVegetation, showSoil, showPopulation, showTransport, showAdditionalBoundaries}).filter(Boolean).length} active</span>
              {error && <span className="error">⚠️ {error}</span>}
            </div>
          </section>
        </aside>

        <main className="demo-map-stage">
          <MapContainer
            center={haryanaCenter}
            className="demo-map-canvas"
            zoom={haryanaZoom}
            zoomControl={false}
          >
            {/* Base Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution='Labels &copy; Esri'
              opacity={0.45}
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />

            {/* Auto-fit to state bounds */}
            {stateGeoJson && <FitToStateBounds stateGeoJson={stateGeoJson} />}

            {/* LayersControl with all layers */}
            <LayersControl position="topright">
              {/* Core Layers */}
              <LayersControl.Overlay checked={showStateBoundary} name="🇮🇳 Haryana Boundary">
                {showStateBoundary && stateGeoJson && (
                  <GeoJSON
                    data={stateGeoJson}
                    style={{
                      color: "red",
                      weight: 4,
                      fillOpacity: 0.1,
                    }}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showDistrictBoundaries} name="🏛️ District Boundaries">
                {showDistrictBoundaries && districtGeoJson && (
                  <GeoJSON
                    data={districtGeoJson}
                    onEachFeature={(feature, layer) => {
                      const districtName = feature.properties?.district || "Unknown";
                      const districtId = toDistrictId(districtName);
                      layer.bindPopup(`<strong>${districtName}</strong>`);
                      layer.bindTooltip(districtName, { sticky: true });
                      layer.on({
                        click: () => setSelectedId(districtId),
                        mouseover: () => {
                          layer.setStyle({ color: "blue", weight: 3, fillOpacity: 0.2 });
                          layer.bringToFront?.();
                        },
                        mouseout: () => {
                          const isSelected = districtId === selectedId;
                          layer.setStyle({
                            color: isSelected ? "#fde68a" : "orange",
                            weight: isSelected ? 3 : 2,
                            fillOpacity: isSelected ? 0.2 : 0.1,
                          });
                        },
                      });
                    }}
                    style={(feature) => {
                      const districtId = toDistrictId(feature.properties?.district || "");
                      return {
                        color: districtId === selectedId ? "#fde68a" : "orange",
                        weight: districtId === selectedId ? 3 : 2,
                        fillOpacity: districtId === selectedId ? 0.2 : 0.1,
                      };
                    }}
                  />
                )}
              </LayersControl.Overlay>

              {/* Thematic Layers */}
              <LayersControl.Overlay checked={showRoads} name="🛣️ Roads">
                {showRoads && roadsGeoJson && (
                  <GeoJSON
                    data={roadsGeoJson}
                    style={layerStyles.roads}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showBuildings} name="🏢 Buildings">
                {showBuildings && buildingsGeoJson && (
                  <GeoJSON
                    data={buildingsGeoJson}
                    style={layerStyles.buildings}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showRivers} name="🌊 Rivers">
                {showRivers && riversGeoJson && (
                  <GeoJSON
                    data={riversGeoJson}
                    style={layerStyles.rivers}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showElevation} name="⛰️ Elevation">
                {showElevation && elevationGeoJson && (
                  <GeoJSON
                    data={elevationGeoJson}
                    style={layerStyles.elevation}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showLandUse} name="🌾 Land Use">
                {showLandUse && landuseGeoJson && (
                  <GeoJSON
                    data={landuseGeoJson}
                    style={layerStyles.landuse}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showVegetation} name="🌳 Vegetation">
                {showVegetation && vegetationGeoJson && (
                  <GeoJSON
                    data={vegetationGeoJson}
                    style={layerStyles.vegetation}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showSoil} name="🟤 Soil">
                {showSoil && soilGeoJson && (
                  <GeoJSON
                    data={soilGeoJson}
                    style={layerStyles.soil}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showPopulation} name="👥 Population">
                {showPopulation && populationGeoJson && (
                  <GeoJSON
                    data={populationGeoJson}
                    style={layerStyles.population}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showTransport} name="🚂 Transport">
                {showTransport && transportGeoJson && (
                  <GeoJSON
                    data={transportGeoJson}
                    style={layerStyles.transport}
                  />
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showAdditionalBoundaries} name="🗺️ Assembly Boundaries">
                {showAdditionalBoundaries && boundariesGeoJson && (
                  <GeoJSON
                    data={boundariesGeoJson}
                    onEachFeature={(feature, layer) => {
                      const assemblyId = getAssemblyFeatureId(feature);
                      const assemblyName = getAssemblyFeatureName(feature);
                      layer.bindPopup(`<strong>${assemblyName}</strong>`);
                      layer.bindTooltip(assemblyName, { sticky: true });
                      layer.on({
                        click: () => setSelectedAssemblyBoundaryId(assemblyId),
                        mouseover: () => {
                          layer.setStyle({ color: "#facc15", weight: 4, fillOpacity: 0.15 });
                          layer.bringToFront?.();
                        },
                        mouseout: () => {
                          const isSelected = assemblyId === selectedAssemblyBoundaryId;
                          layer.setStyle({
                            color: isSelected ? "#facc15" : layerStyles.boundaries.color,
                            weight: isSelected ? 4 : layerStyles.boundaries.weight,
                            fillOpacity: isSelected ? 0.15 : layerStyles.boundaries.fillOpacity,
                          });
                        },
                      });
                    }}
                    style={(feature) => {
                      const assemblyId = getAssemblyFeatureId(feature);
                      const isSelected = assemblyId === selectedAssemblyBoundaryId;
                      return {
                        color: isSelected ? "#facc15" : layerStyles.boundaries.color,
                        weight: isSelected ? 4 : layerStyles.boundaries.weight,
                        fillOpacity: isSelected ? 0.15 : layerStyles.boundaries.fillOpacity,
                      };
                    }}
                  />
                )}
              </LayersControl.Overlay>
            </LayersControl>

            {/* Overlay elements */}
            {showCorridor && (
              <Polyline
                pathOptions={{
                  color: "#60a5fa",
                  dashArray: "8 6",
                  weight: 3,
                }}
                positions={connectivityCorridor}
              />
            )}

            {districtLabelLayer}

            {showNodes && industrialNodes.map((item) => (
              <Marker
                key={item.id}
                eventHandlers={{ click: () => setSelectedId(item.id) }}
                icon={demoIcon}
                position={item.position}
              >
                <Popup>
                  <strong>{item.name}</strong>
                  <div>{item.category}</div>
                </Popup>
              </Marker>
            ))}

            {selectedLocation && (
              <CircleMarker
                center={selectedLocation.position}
                pathOptions={{
                  color: "#22c55e",
                  fillColor: "#86efac",
                  fillOpacity: 0.4,
                }}
                radius={18}
              />
            )}

            {/* Map controls and interactions */}
            <MapViewport
              activeFocus={activeFocus}
              selectedLocation={selectedLocation}
              stateGeoJson={stateGeoJson}
            />
            <MapClickReader onPickPoint={setPickedPoint} />
          </MapContainer>

          {/* Toolbar overlays */}
          <div className="demo-map-overlay demo-map-overlay--top-right">
            <div className="demo-map-toolbar">
              <span className="demo-map-toolbar__title">Map Actions</span>
              <button onClick={() => setSelectedId("gurugram")} type="button">Demo Focus</button>
              <button onClick={() => setActiveFocusId("state")} type="button">Reset</button>
            </div>
          </div>

          <div className="demo-map-overlay demo-map-overlay--bottom-right">
            <div className="demo-map-grid-chip">
              <span>🌐 Haryana GIS v2.0</span>
            </div>
          </div>

          <footer className="demo-map-footer">
            Haryana GIS Demo: Real GeoJSON boundaries + 10 thematic layers. 
            Data: State portals, OpenStreetMap, NRSC. Next: PostGIS integration.
          </footer>
        </main>
      </div>
    </div>
  );
}

export default HaryanaDemoMap;
