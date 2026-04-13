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

function FitToStateBounds({ stateGeoJson }) {
  const map = useMap();

  useEffect(() => {
    if (!stateGeoJson) {
      return;
    }

    const layer = new L.GeoJSON(stateGeoJson);
    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, stateGeoJson]);

  return null;
}

function MapViewport({
  activeFocus,
  selectedLocation,
  stateGeoJson,
}) {
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

  const focusSelected = () => {
    if (!selectedLocation) {
      return;
    }

    map.flyTo(selectedLocation.position, 10, { duration: 1.1 });
  };

  const goToZone = () => {
    if (!activeFocus) {
      fitState();
      return;
    }

    map.fitBounds(activeFocus.bounds, { padding: [20, 20] });
  };

  return (
    <div className="demo-map-controls">
      <button onClick={zoomIn} type="button">+</button>
      <button onClick={zoomOut} type="button">-</button>
      <button onClick={fitState} type="button">State</button>
      <button onClick={focusSelected} disabled={!selectedLocation} type="button">
        Focus
      </button>
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
  const [showStateBoundary, setShowStateBoundary] = useState(true);
  const [showDistrictBoundaries, setShowDistrictBoundaries] = useState(true);
  const [showDistrictLabels, setShowDistrictLabels] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [showCorridor, setShowCorridor] = useState(true);
  const [pickedPoint, setPickedPoint] = useState(null);
  const [stateGeoJson, setStateGeoJson] = useState(null);
  const [districtGeoJson, setDistrictGeoJson] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadLayers() {
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

        if (!isMounted) {
          return;
        }

        setStateGeoJson(stateData);
        setDistrictGeoJson(districtData);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load Haryana boundary data."
        );
      }
    }

    loadLayers();

    return () => {
      isMounted = false;
    };
  }, []);

  const districtLocations = useMemo(() => {
    if (!districtGeoJson?.features) {
      return [];
    }

    return districtGeoJson.features.map((feature) => {
      const districtName = feature.properties?.district || "Unknown district";
      const center = getFeatureCenter(feature);

      return {
        id: toDistrictId(districtName),
        name: districtName,
        district: districtName,
        note: `${districtName} district boundary from Haryana GeoJSON`,
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

    if (!normalized) {
      return searchableLocations;
    }

    return searchableLocations.filter((item) => {
      const haystack =
        `${item.name} ${item.district || ""} ${item.category || ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, searchableLocations]);

  const activeFocus =
    quickFocus.find((item) => item.id === activeFocusId) || quickFocus[0];

  const districtLabelLayer = useMemo(() => {
    if (!showDistrictLabels) {
      return null;
    }

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

  return (
    <div className="demo-map-page">
      <header className="demo-map-topbar">
        <div className="demo-map-brand">
          <div className="demo-map-brand__seal">H</div>
          <div>
            <p className="demo-map-brand__title">Digital Land Record, Haryana</p>
            <p className="demo-map-brand__subtitle">
              Demo GIS workspace with real Haryana GeoJSON boundaries
            </p>
          </div>
        </div>

        <div className="demo-map-topbar__actions">
          <Link className="demo-map-topbar__link" to="/dashboard">
            Dashboard
          </Link>
          <button
            className="demo-map-topbar__button"
            onClick={handleLogout}
            type="button"
          >
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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Address or district name"
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
            <p className="demo-map-panel__eyebrow">Map Layers</p>
            <label><input checked={showStateBoundary} onChange={() => setShowStateBoundary((value) => !value)} type="checkbox" /> Haryana boundary</label>
            <label><input checked={showDistrictBoundaries} onChange={() => setShowDistrictBoundaries((value) => !value)} type="checkbox" /> District boundaries</label>
            <label><input checked={showDistrictLabels} onChange={() => setShowDistrictLabels((value) => !value)} type="checkbox" /> District labels</label>
            <label><input checked={showNodes} onChange={() => setShowNodes((value) => !value)} type="checkbox" /> Industrial nodes</label>
            <label><input checked={showCorridor} onChange={() => setShowCorridor((value) => !value)} type="checkbox" /> Logistics corridor</label>
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
            <p>{selectedLocation?.note || selectedLocation?.category || "Administrative boundary layer"}</p>
            <div className="demo-map-meta">
              <span>
                Coordinates:{" "}
                {selectedLocation
                  ? `${selectedLocation.position[0].toFixed(4)}, ${selectedLocation.position[1].toFixed(4)}`
                  : "29.0000, 76.0000"}
              </span>
              <span>
                Clicked point:{" "}
                {pickedPoint
                  ? `${pickedPoint.lat.toFixed(4)}, ${pickedPoint.lng.toFixed(4)}`
                  : "Tap map to inspect"}
              </span>
              <span>Integration path: GeoJSON today, PostGIS and QGIS next</span>
              {error ? <span>{error}</span> : null}
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
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution='Labels &copy; Esri'
              opacity={0.45}
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />

            {stateGeoJson ? <FitToStateBounds stateGeoJson={stateGeoJson} /> : null}

            <LayersControl position="topright">
              <LayersControl.Overlay checked={showStateBoundary} name="Haryana Boundary">
                {showStateBoundary && stateGeoJson ? (
                  <GeoJSON
                    data={stateGeoJson}
                    style={{
                      color: "red",
                      weight: 3,
                      fillOpacity: 0,
                    }}
                  />
                ) : (
                  <></>
                )}
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={showDistrictBoundaries} name="District Boundaries">
                {showDistrictBoundaries && districtGeoJson ? (
                  <GeoJSON
                    data={districtGeoJson}
                    onEachFeature={(feature, layer) => {
                      const districtName =
                        feature.properties?.district || "Unknown district";
                      const districtId = toDistrictId(districtName);

                      layer.bindPopup(`<strong>${districtName}</strong>`);
                      layer.bindTooltip(districtName, { sticky: true });

                      layer.on({
                        click: () => setSelectedId(districtId),
                        mouseover: () => {
                          layer.setStyle({
                            color: "blue",
                            weight: 2,
                            fillColor: "orange",
                            fillOpacity: 0.18,
                          });

                          if (layer.bringToFront) {
                            layer.bringToFront();
                          }
                        },
                        mouseout: () => {
                          const isSelected = districtId === selectedId;

                          layer.setStyle({
                            color: isSelected ? "#fde68a" : "orange",
                            weight: isSelected ? 2 : 1,
                            fillColor: "orange",
                            fillOpacity: isSelected ? 0.18 : 0.1,
                          });
                        },
                      });
                    }}
                    style={(feature) => {
                      const districtId = toDistrictId(
                        feature.properties?.district || ""
                      );
                      const isSelected = districtId === selectedId;

                      return {
                        color: isSelected ? "#fde68a" : "orange",
                        weight: isSelected ? 2 : 1,
                        fillColor: "orange",
                        fillOpacity: isSelected ? 0.18 : 0.1,
                      };
                    }}
                  />
                ) : (
                  <></>
                )}
              </LayersControl.Overlay>
            </LayersControl>

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

            {showNodes &&
              industrialNodes.map((item) => (
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

            {selectedLocation ? (
              <CircleMarker
                center={selectedLocation.position}
                pathOptions={{
                  color: "#22c55e",
                  fillColor: "#86efac",
                  fillOpacity: 0.4,
                }}
                radius={18}
              />
            ) : null}

            <MapViewport
              activeFocus={activeFocus}
              selectedLocation={selectedLocation}
              stateGeoJson={stateGeoJson}
            />
            <MapClickReader onPickPoint={setPickedPoint} />
          </MapContainer>

          <div className="demo-map-overlay demo-map-overlay--top-right">
            <div className="demo-map-toolbar">
              <span className="demo-map-toolbar__title">Map Actions</span>
              <button onClick={() => setSelectedId("gurugram")} type="button">
                Demo Focus
              </button>
              <button onClick={() => setActiveFocusId("state")} type="button">
                Reset Zone
              </button>
            </div>
          </div>

          <div className="demo-map-overlay demo-map-overlay--bottom-right">
            <div className="demo-map-grid-chip">
              <span>GIS</span>
            </div>
          </div>

          <footer className="demo-map-footer">
            Disclaimer Note: This demo Haryana GIS view keeps the original demo
            map features while using real state and district GeoJSON boundaries.
          </footer>
        </main>
      </div>
    </div>
  );
}

export default HaryanaDemoMap;
