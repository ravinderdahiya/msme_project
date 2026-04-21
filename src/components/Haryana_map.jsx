import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";

const districtCoordinates = {
ambala: [76.9422, 30.3285],
bhiwani: [76.1667, 28.75],
faridabad: [77.3132, 28.4112],
gurugram: [77.0059, 28.4389],
};

function Haryana_map({ filters = {} }) {
const mapDiv = useRef(null);
const viewRef = useRef(null);
const graphicsLayerRef = useRef(null);
const isReadyRef = useRef(false); // 🔥 important
const [status, setStatus] = useState("Loading Haryana GIS...");

// 🔥 Safe goTo
const safeGoTo = async (view, options) => {
if (!view || !isReadyRef.current) return;


try {
  await view.goTo(options);
} catch (err) {
  if (err.name !== "AbortError") {
    console.error(err);
  }
}


};

useEffect(() => {
if (!mapDiv.current) return;


const map = new Map({
  basemap: "topo-vector",
});

const view = new MapView({
  container: mapDiv.current,
  map,
  center: [76.0, 29.0],
  zoom: 7,
});

viewRef.current = view;

const graphicsLayer = new GraphicsLayer();
graphicsLayerRef.current = graphicsLayer;
map.add(graphicsLayer);

const districtLayer = new GeoJSONLayer({
  url: "/data/haryana-districts.geojson",
});

map.add(districtLayer);

// 🔥 IMPORTANT
view.when(() => {
  isReadyRef.current = true;
  setStatus("Haryana GIS loaded");
});

return () => {
  isReadyRef.current = false;
  view.destroy();
};


}, []);

useEffect(() => {
const view = viewRef.current;
if (!view || !isReadyRef.current) return;

const run = async () => {
  // 🔹 District
  if (filters?.district && typeof filters.district === "string") {
    const coords =
      districtCoordinates[filters.district.toLowerCase()];

    if (coords) {
      await safeGoTo(view, { center: coords, zoom: 11 });
    }
  }

  // 🔹 Location
  if (
    filters?.currentLocation &&
    typeof filters.currentLocation === "string"
  ) {
    const [lat, lng] = filters.currentLocation
      .split(",")
      .map(Number);

    if (!isNaN(lat) && !isNaN(lng)) {
      const point = new Graphic({
        geometry: {
          type: "point",
          longitude: lng,
          latitude: lat,
        },
        symbol: new SimpleMarkerSymbol({
          color: "blue",
          size: 10,
        }),
      });

      graphicsLayerRef.current.removeAll();
      graphicsLayerRef.current.add(point);

      await safeGoTo(view, { center: [lng, lat], zoom: 14 });
    }
  }
};

run();

}, [filters]);

return (
<div style={{ height: "100vh", width: "100%" }}>
{status && (
<div style={{ position: "absolute", top: 10, right: 10 }}>
{status} </div>
)}


  <div ref={mapDiv} style={{ height: "100%", width: "100%" }} />
</div>

);
}

export default Haryana_map;
