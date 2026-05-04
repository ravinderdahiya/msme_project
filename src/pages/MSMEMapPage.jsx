import { useEffect, useState } from "react";
import { initMsmeWebGis, applyMsmeGisUiStrings } from "../gis/msmeWebGis.js";
import { useI18n } from "../i18n/useI18n.js";
import Sidebar from "../components/Sidebar.jsx";
import HaryanaMap from "../components/Haryana_map.jsx";
import HeaderGis from "../components/Header_gis.jsx";
import "../msme-webgis.css";
import "./MSMEGisPageShell.css";

const MSMEGISPage = () => {
  const { t, lang, setLang, languages } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("msme-ui-theme") || "white";
    } catch {
      return "white";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("msme-ui-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      initMsmeWebGis();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (
        typeof window !== "undefined" &&
        typeof window.__msmeGisCleanup === "function"
      ) {
        try {
          window.__msmeGisCleanup();
        } catch {}
        window.__msmeGisCleanup = null;
      }
    };
  }, []);

  useEffect(() => {
    applyMsmeGisUiStrings({
      district: t("placeholderDistrict"),
      tehsil: t("placeholderTehsil"),
      village: t("placeholderVillage"),
      vidhanSabha: t("placeholderVidhanSabha"),
      lokSabha: t("placeholderLokSabha"),
      muraba: t("placeholderMuraba"),
      parcel: t("placeholderParcel"),
      cadKhasraPlaceholder: t("cadKhasraPlaceholder"),
      allTehsils: t("placeholderAllTehsils"),
      allVillages: t("placeholderAllVillages"),
      hsvpSector: t("placeholderHsvpSector"),
      hsvpPlot: t("placeholderHsvpPlot"),
      mapPopupTitle: t("mapPopupTitle"),
    });
  }, [lang]);

  const parseLatLonInput = (text) => {
    const cleaned = String(text || "").trim();
    const match = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (!match) return null;
    const lat = Number(match[1]);
    const lon = Number(match[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    return { lat, lon, label: cleaned };
  };

  const geocodeWithArcGis = async (query) => {
    const url =
      "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates" +
      `?f=pjson&maxLocations=1&outFields=Match_addr&singleLine=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const top = Array.isArray(data?.candidates) ? data.candidates[0] : null;
    if (!top || !top.location) return null;
    const lon = Number(top.location.x);
    const lat = Number(top.location.y);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    return { lat, lon, label: top.address || query };
  };

  const geocodeWithNominatim = async (query) => {
    const url =
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
        query
      )}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const top = Array.isArray(data) ? data[0] : null;
    if (!top) return null;
    const lat = Number(top.lat);
    const lon = Number(top.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    return { lat, lon, label: top.display_name || query };
  };

  const handleTopSearchSubmit = async (event) => {
    event.preventDefault();
    if (searchBusy) return;
    const query = String(searchQuery || "").trim();
    if (!query) return;

    setSearchBusy(true);
    try {
      let target = parseLatLonInput(query);
      if (!target) target = await geocodeWithArcGis(query);
      if (!target) target = await geocodeWithNominatim(query);

      if (!target) {
        window.alert("Place not found. Try another name or use 'lat,lon'.");
        return;
      }

      if (typeof window === "undefined" || typeof window.msmeGisSetBufferAnchorFromWgs !== "function") {
        window.alert("Map is still loading. Please try again.");
        return;
      }

      const ok = await window.msmeGisSetBufferAnchorFromWgs(target.lat, target.lon, {
        autoRun: true,
        distanceM: 1500,
        zoom: 14,
        label: target.label || query,
      });

      if (!ok) {
        window.alert("Could not create buffer at this location.");
      }
    } catch (err) {
      console.error("[top search geocode]", err);
      window.alert("Search failed. Check network and try again.");
    } finally {
      setSearchBusy(false);
    }
  };

  return (
    <div id="msmeGisRoot" className="msme-gis-page">
      <HeaderGis
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchBusy={searchBusy}
        onSearchSubmit={handleTopSearchSubmit}
        lang={lang}
        setLang={setLang}
        languages={languages}
      />
      <Sidebar t={t} />
      <HaryanaMap t={t} />
    </div>
  );
};

export default MSMEGISPage;
