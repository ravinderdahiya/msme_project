import { useEffect, useState } from "react";
import { initMsmeWebGis, applyMsmeGisUiStrings } from "../gis/msmeWebGis.js";
import { useI18n } from "../i18n/useI18n.js";
import Sidebar from "../components/Sidebar.jsx";
import HaryanaMap from "../components/Haryana_map.jsx";
import HeaderGis from "../components/Header_gis.jsx";
import "../msme-webgis.css";

const MSMEGISPage = () => {
  const { t, lang, setLang, languages } = useI18n();
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

  return (
    <>
      <HeaderGis
        t={t}
        lang={lang}
        setLang={setLang}
        languages={languages}
        theme={theme}
        setTheme={setTheme}
      />
      <Sidebar t={t} />
      <HaryanaMap t={t} />
    </>
  );
};

export default MSMEGISPage;
