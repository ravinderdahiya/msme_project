import { useEffect } from "react";
import { initMsmeWebGis, applyMsmeGisUiStrings } from "../gis/msmeWebGis.js";
import { useI18n } from "../i18n/useI18n.js";
import Sidebar from "../components/Sidebar.jsx";
import HaryanaMap from "../components/Haryana_map.jsx";
import "../msme-webgis.css";

const MSMEGISPage = () => {
  const { t, lang } = useI18n();
  const theme = "hepc-blue";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

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
      hsvpPlot: t("placeholderHsvpPlot"),
      mapPopupTitle: t("mapPopupTitle"),
    });
  }, [lang]);

  return (
    <>
      <Sidebar t={t} />
      <HaryanaMap t={t} />
    </>
  );
};

export default MSMEGISPage;