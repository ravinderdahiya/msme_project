import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BufferPanel from "./newmainmap/BufferPanel";
import AnalysisPanel from "./newmainmap/AnalysisPanel";
import LayersPanel from "./newmainmap/LayersPanel";
import MainSidebar from "./newmainmap/MainSidebar";
import MapStage from "./newmainmap/MapStage";
import NewMainMapHeader from "./newmainmap/NewMainMapHeader";
import SelectLandPanel from "./newmainmap/SelectLandPanel";
import NearbyPlacesPanel from "./newmainmap/NearbyPlacesPanel";
import {
  AOI_LAND_OPTIONS,
  ANALYSIS_AMENITIES,
  ANALYSIS_PATH,
  BASE_MAP_PATH,
  NEARBY_PLACES_PATH,
  NEARBY_PLACES_RESULTS,
  BUFFER_PATH,
  BUFFER_PRESETS,
  BUFFER_SUMMARY,
  LAYERS_PATH,
  LAYER_GROUPS,
  getAllSublayerEntries,
  SELECT_LAND_PATH,
  buildDefaultSelection,
} from "./newmainmap/config";
import "./NewMainMap.css";
import "./newmainmap/GisDmpShell.css";

export default function NewMainMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toolSearch, setToolSearch] = useState("");
  const [activeRailKey, setActiveRailKey] = useState(null);
  const [toolsPanelOpen, setToolsPanelOpen] = useState(false);
  const [layerSearch, setLayerSearch] = useState("");
  const [draftLayers, setDraftLayers] = useState(buildDefaultSelection);
  const [appliedLayers, setAppliedLayers] = useState(buildDefaultSelection);
  const [bufferDistance, setBufferDistance] = useState("5 km");
  const [showWithinBuffer, setShowWithinBuffer] = useState(true);
  const [bufferVisible, setBufferVisible] = useState(true);
  const [bufferApplied, setBufferApplied] = useState(true);
  const selectLandOpen = location.pathname === SELECT_LAND_PATH;
  const layersOpen = location.pathname === LAYERS_PATH;
  const bufferOpen = location.pathname === BUFFER_PATH;
  const analysisOpen = location.pathname === ANALYSIS_PATH;
  const nearbyPlacesOpen = location.pathname === NEARBY_PLACES_PATH;
  const sidePanelOpen = selectLandOpen || layersOpen || bufferOpen || analysisOpen;
  const backdropOpen = sidePanelOpen || nearbyPlacesOpen;

  const openLayers = useCallback(() => navigate(LAYERS_PATH), [navigate]);
  const openBuffer = useCallback(() => navigate(BUFFER_PATH), [navigate]);
  const closeSidePanel = useCallback(() => navigate(BASE_MAP_PATH), [navigate]);

  const filteredLayerGroups = useMemo(() => {
    const q = layerSearch.trim().toLowerCase();
    if (!q) return LAYER_GROUPS;
    return LAYER_GROUPS.map((g) => {
      const gMatch = g.label.toLowerCase().includes(q);
      const matchedSublayers = g.sublayers.filter((s) => s.label.toLowerCase().includes(q));
      if (gMatch) return g;
      if (matchedSublayers.length) return { ...g, sublayers: matchedSublayers };
      return null;
    }).filter(Boolean);
  }, [layerSearch]);

  const toggleLayer = (id) => {
    setDraftLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLayerGroup = (group) => {
    const ids = group.sublayers.map((s) => s.id);
    setDraftLayers((prev) => {
      const allOn = ids.every((id) => prev[id]);
      const next = { ...prev };
      const v = !allOn;
      for (const id of ids) next[id] = v;
      return next;
    });
  };

  const handleApplyLayers = () => {
    setAppliedLayers({ ...draftLayers });
  };

  const handleResetLayers = () => {
    const cleared = Object.fromEntries(getAllSublayerEntries().map((l) => [l.id, false]));
    setDraftLayers(cleared);
  };

  const handleSidebarItem = (item) => {
    if (item.route) {
      if (item.key === "layers") setActiveRailKey("layers");
      setToolsPanelOpen(false);
      navigate(item.route);
      return;
    }
    if (sidePanelOpen || nearbyPlacesOpen) closeSidePanel();
  };

  const isSidebarItemActive = (item) => {
    if (item.key === "select-land") return selectLandOpen;
    if (item.key === "layers") return layersOpen;
    if (item.key === "buffer") return bufferOpen;
    if (item.key === "analysis") return analysisOpen;
    return false;
  };

  useEffect(() => {
    if (layersOpen) {
      setActiveRailKey("layers");
      setToolsPanelOpen(false);
    } else if (!sidePanelOpen) {
      setActiveRailKey(null);
    }
  }, [layersOpen, sidePanelOpen]);

  return (
    <div
      className={`new-main-map-page nm-shell-dmp${toolsPanelOpen ? " nm-sidebar-panel-open" : ""}${layersOpen ? " nm-page--layers-open" : ""}${
        bufferOpen ? " nm-page--buffer-open" : ""
      }${analysisOpen ? " nm-page--analysis-open" : ""}${
        selectLandOpen ? " nm-page--aoi-open" : ""
      }${nearbyPlacesOpen ? " nm-page--nearby-open" : ""}`}
    >
      {backdropOpen && (
        <button
          type="button"
          className="nm-layers-backdrop"
          aria-label="Close panel"
          onClick={closeSidePanel}
        />
      )}

      <div className="nm-site-header">
        <NewMainMapHeader />
      </div>

      <MainSidebar
        toolSearch={toolSearch}
        setToolSearch={setToolSearch}
        activeRailKey={activeRailKey}
        setActiveRailKey={setActiveRailKey}
        toolsPanelOpen={toolsPanelOpen}
        setToolsPanelOpen={setToolsPanelOpen}
        isSidebarItemActive={isSidebarItemActive}
        onSidebarItemClick={handleSidebarItem}
      />

      {selectLandOpen && (
        <SelectLandPanel options={AOI_LAND_OPTIONS} onClose={closeSidePanel} />
      )}

      {layersOpen && (
        <LayersPanel
          layerSearch={layerSearch}
          setLayerSearch={setLayerSearch}
          filteredLayerGroups={filteredLayerGroups}
          draftLayers={draftLayers}
          toggleLayer={toggleLayer}
          toggleLayerGroup={toggleLayerGroup}
          onApplyLayers={handleApplyLayers}
          onResetLayers={handleResetLayers}
          onClose={closeSidePanel}
        />
      )}

      {bufferOpen && (
        <BufferPanel
          bufferDistance={bufferDistance}
          setBufferDistance={setBufferDistance}
          bufferPresets={BUFFER_PRESETS}
          showWithinBuffer={showWithinBuffer}
          setShowWithinBuffer={setShowWithinBuffer}
          onApplyBuffer={() => setBufferApplied(true)}
          onClearBuffer={() => setBufferApplied(false)}
          bufferSummary={BUFFER_SUMMARY}
          onClose={closeSidePanel}
        />
      )}

      <MapStage
        sidePanelOpen={sidePanelOpen}
        onCloseSidePanel={closeSidePanel}
        bufferOpen={bufferOpen}
        bufferApplied={bufferApplied}
        bufferVisible={bufferVisible}
        setBufferVisible={setBufferVisible}
        analysisOpen={analysisOpen}
        analysisAmenities={ANALYSIS_AMENITIES}
        nearbyPlacesOpen={nearbyPlacesOpen}
        bufferDistance={bufferDistance}
        activeLayerCount={getAllSublayerEntries().filter((l) => appliedLayers[l.id]).length}
        onOpenLayers={() => navigate(LAYERS_PATH)}
        onOpenNearbyPlaces={() => navigate(NEARBY_PLACES_PATH)}
      />

      {analysisOpen && <AnalysisPanel amenities={ANALYSIS_AMENITIES} onClose={closeSidePanel} />}

      {nearbyPlacesOpen && <NearbyPlacesPanel places={NEARBY_PLACES_RESULTS} onClose={closeSidePanel} />}

      <footer className="nm-site-footer">
        <span>Technical Collaboration with BISAG-N</span>
        <span>Satellite Images Provided by ISRO</span>
      </footer>
    </div>
  );
}
