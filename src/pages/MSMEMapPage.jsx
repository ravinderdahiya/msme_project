import { useEffect, useState } from "react";
import { initMsmeWebGis, applyMsmeGisUiStrings } from "../gis/msmeWebGis.js";
import { useIn } from "../in/useIn.js";
import Sidebar from "../components/Sidebar.jsx";
import HaryanaMap from "../components/Haryana_map.jsx";
import HeaderGis from "../components/Header_gis.jsx";
import GisMobilePanelCloseBehaviour from "../components/gis/GisMobilePanelCloseBehaviour.jsx";
import "../msme-webgis.css";
import "./MSMEGisPageShell.css";

const MSMEGISPage = () => {
  const ASSEMBLY_MAP_URL =
    "https://investhry.harsac.in/portal/apps/experiencebuilder/experience/?id=f15f7171a8434a5cb8a0936c1993a67f";
  const { t, lang, setLang, languages } = useIn();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [theme, setTheme] = useState("black");
  const [assemblyMapOpen, setAssemblyMapOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // ArcGIS Calcite components (LayerList uses calcite) need calcite-mode for correct contrast.
    document.documentElement.setAttribute("calcite-mode", theme === "black" ? "dark" : "light");
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
      if (typeof window !== "undefined") {
        try {
          window.__msmeGisMapView = null;
        } catch {
          /* ignore */
        }
      }
      if (
        typeof window !== "undefined" &&
        typeof window.__msmeGisCleanup === "function"
      ) {
        try {
          window.__msmeGisCleanup();
        } catch {}
        window.__msmeGisCleanup = null;
      }
      /* Allow initMsmeWebGis to run again after StrictMode remount or route change. */
      if (typeof window !== "undefined") {
        window.__msmeGisInitialized = false;
        window.__msmeGisInitInProgress = false;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    var cancelled = false;
    var retryTimer = null;
    var attempts = 0;
    var HARYANA_CENTER = [76.2, 29.2];
    var HARYANA_ZOOM = 8;

    function shouldRecenterToHaryana(view) {
      if (!view || view.destroyed) return false;
      var center = view.center;
      var lon = Number(center && center.longitude);
      var lat = Number(center && center.latitude);
      var scale = Number(view.scale);
      var veryWideWorldView = Number.isFinite(scale) && scale > 8000000;
      var farFromHaryana =
        Number.isFinite(lon) && Number.isFinite(lat)
          ? Math.abs(lon - HARYANA_CENTER[0]) > 12 || Math.abs(lat - HARYANA_CENTER[1]) > 10
          : true;
      return veryWideWorldView || farFromHaryana;
    }

    function waitAndFixInitialView() {
      if (cancelled) return;
      attempts += 1;
      var view = window.__msmeGisMapView;

      if (!view || view.destroyed) {
        if (attempts < 80) {
          retryTimer = window.setTimeout(waitAndFixInitialView, 250);
        }
        return;
      }

      Promise.resolve(typeof view.when === "function" ? view.when() : null)
        .then(function () {
          if (cancelled || !view || view.destroyed) return;
          if (!shouldRecenterToHaryana(view)) return;
          return view
            .goTo({ center: HARYANA_CENTER, zoom: HARYANA_ZOOM }, { animate: false })
            .catch(function () {
              return null;
            });
        })
        .finally(function () {
          cancelled = true;
        });
    }

    retryTimer = window.setTimeout(waitAndFixInitialView, 300);
    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
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
        theme={theme}
        onToggleTheme={() => setTheme((v) => (v === "black" ? "white" : "black"))}
        lang={lang}
        setLang={setLang}
        languages={languages}
      />
      <Sidebar t={t} onOpenAssemblyMap={() => setAssemblyMapOpen(true)} />
      <GisMobilePanelCloseBehaviour />
      <HaryanaMap t={t} />
      {assemblyMapOpen ? (
        <section className="assembly-map-inline-panel" aria-label="Assembly map inline panel">
          <div className="assembly-map-inline-header">
            <h2>Assembly Map</h2>
            <button
              type="button"
              className="assembly-map-inline-back"
              onClick={() => setAssemblyMapOpen(false)}
            >
              Back to Map
            </button>
          </div>
          <iframe
            title="Assembly Map"
            src={ASSEMBLY_MAP_URL}
            className="assembly-map-inline-frame"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      ) : null}
    </div>
  );
};

export default MSMEGISPage;
