import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BufferPanel from "./newmainmap/BufferPanel";
import AnalysisPanel from "./newmainmap/AnalysisPanel";
import LayersPanel from "./newmainmap/LayersPanel";
import MainSidebar from "./newmainmap/MainSidebar";
import MapStage from "./newmainmap/MapStage";
import SelectLandPanel from "./newmainmap/SelectLandPanel";
import {
  AOI_LAND_OPTIONS,
  ANALYSIS_AMENITIES,
  ANALYSIS_PATH,
  BASE_MAP_PATH,
  BUFFER_PATH,
  BUFFER_PRESETS,
  BUFFER_SUMMARY,
  LAYERS_PATH,
  LAYER_ITEMS,
  SELECT_LAND_PATH,
  buildDefaultSelection,
  otherMenu,
  sidebarMenu,
} from "./newmainmap/config";
import "./NewMainMap.css";

export default function NewMainMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [layerSearch, setLayerSearch] = useState("");
  const [draftLayers, setDraftLayers] = useState(buildDefaultSelection);
  const [appliedLayers, setAppliedLayers] = useState(buildDefaultSelection);
  const [bufferDistance, setBufferDistance] = useState("5 km");
  const [showWithinBuffer, setShowWithinBuffer] = useState(true);
  const [bufferVisible, setBufferVisible] = useState(true);
  const [bufferApplied, setBufferApplied] = useState(true);
  const [selectedAoiOption, setSelectedAoiOption] = useState(AOI_LAND_OPTIONS[0]?.id ?? "");

  const selectLandOpen = location.pathname === SELECT_LAND_PATH;
  const layersOpen = location.pathname === LAYERS_PATH;
  const bufferOpen = location.pathname === BUFFER_PATH;
  const analysisOpen = location.pathname === ANALYSIS_PATH;
  const sidePanelOpen = selectLandOpen || layersOpen || bufferOpen || analysisOpen;

  const openLayers = useCallback(() => navigate(LAYERS_PATH), [navigate]);
  const openBuffer = useCallback(() => navigate(BUFFER_PATH), [navigate]);
  const closeSidePanel = useCallback(() => navigate(BASE_MAP_PATH), [navigate]);

  const filteredLayerItems = useMemo(() => {
    const q = layerSearch.trim().toLowerCase();
    if (!q) return LAYER_ITEMS;
    return LAYER_ITEMS.filter((l) => l.label.toLowerCase().includes(q));
  }, [layerSearch]);

  const toggleLayer = (id) => {
    setDraftLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyLayers = () => {
    setAppliedLayers({ ...draftLayers });
  };

  const handleResetLayers = () => {
    const cleared = Object.fromEntries(LAYER_ITEMS.map((l) => [l.id, false]));
    setDraftLayers(cleared);
  };

  const handleSidebarItem = (item) => {
    if (item.route) {
      navigate(item.route);
      return;
    }
    if (sidePanelOpen) closeSidePanel();
  };

  const isSidebarItemActive = (item) => {
    if (item.key === "select-land") return selectLandOpen;
    if (item.key === "layers") return layersOpen;
    if (item.key === "buffer") return bufferOpen;
    if (item.key === "analysis") return analysisOpen;
    return false;
  };

  return (
    <div
      className={`new-main-map-page${layersOpen ? " nm-page--layers-open" : ""}${
        bufferOpen ? " nm-page--buffer-open" : ""
      }${analysisOpen ? " nm-page--analysis-open" : ""}${
        selectLandOpen ? " nm-page--aoi-open" : ""
      }`}
    >
      {sidePanelOpen && (
        <button
          type="button"
          className="nm-layers-backdrop"
          aria-label="Close panel"
          onClick={closeSidePanel}
        />
      )}

      <MainSidebar
        sidebarMenu={sidebarMenu}
        otherMenu={otherMenu}
        isSidebarItemActive={isSidebarItemActive}
        onSidebarItemClick={handleSidebarItem}
      />

      {selectLandOpen && (
        <SelectLandPanel
          options={AOI_LAND_OPTIONS}
          selectedOptionId={selectedAoiOption}
          onSelectOption={setSelectedAoiOption}
          onClose={closeSidePanel}
        />
      )}

      {layersOpen && (
        <LayersPanel
          layerSearch={layerSearch}
          setLayerSearch={setLayerSearch}
          filteredLayerItems={filteredLayerItems}
          draftLayers={draftLayers}
          toggleLayer={toggleLayer}
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

      {analysisOpen && <AnalysisPanel amenities={ANALYSIS_AMENITIES} onClose={closeSidePanel} />}

      <MapStage
        search={search}
        setSearch={setSearch}
        sidePanelOpen={sidePanelOpen}
        onCloseSidePanel={closeSidePanel}
        bufferOpen={bufferOpen}
        bufferApplied={bufferApplied}
        bufferVisible={bufferVisible}
        setBufferVisible={setBufferVisible}
        analysisOpen={analysisOpen}
        analysisAmenities={ANALYSIS_AMENITIES}
        bufferDistance={bufferDistance}
        activeLayerCount={LAYER_ITEMS.filter((l) => appliedLayers[l.id]).length}
        onOpenLayers={openLayers}
        onOpenBuffer={openBuffer}
      />
    </div>
  );
}
