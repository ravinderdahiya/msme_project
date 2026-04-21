import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

/**
 * 🔥 Dynamic popup template generator
 */
const createPopupTemplate = (sublayer) => ({
  title: sublayer.title || "Details",
  content: [
    {
      type: "fields",
      fieldInfos: sublayer.fields.map((field) => ({
        fieldName: field.name,
        label: field.alias || field.name,
      })),
    },
  ],
});

/**
 * 🔥 Apply popup to ALL sublayers dynamically
 */
const applyPopupToSublayers = (layer) => {
  layer.when(() => {
    layer.allSublayers.forEach((sublayer) => {
      sublayer.popupEnabled = true;

      // 🔥 VERY IMPORTANT
      sublayer.outFields = ["*"];

      // Wait until sublayer loads fields
      sublayer.load().then(() => {
        if (!sublayer.fields) return;

        sublayer.popupTemplate = createPopupTemplate(sublayer);
      });
    });
  });
};

/**
 * Create layers ONE BY ONE (manual but scalable)
 */
export const createMapLayers = () => {
  const adminLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Administrative_Boundaries/MapServer",
    title: "Administrative Boundaries",
    visible: true,
  });

  const baseLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Base_Reference_Layers/MapServer",
    title: "Base Reference Layers",
    visible: true,
  });

  const envLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Environmental_Constraints/MapServer",
    title: "Environmental Constraints",
    visible: true,
  });

  const investmentLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Investment_Zones/MapServer",
    title: "Investment Zones",
    visible: true,
  });

  const socialLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Social_Infrastructure/MapServer",
    title: "Social Infrastructure",
    visible: true,
  });

  const transportLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Transportation_Infrastructure/MapServer",
    title: "Transportation Infrastructure",
    visible: true,
  });

  const utilitiesLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Utilities/MapServer",
    title: "Utilities",
    visible: true,
  });

  const cadastralLayer = new MapImageLayer({
    url: "https://hsacggm.in/server/rest/services/MSME/Haryana_Cadastral/MapServer",
    title: "Haryana Cadastral",
    visible: true,
  });

  const layers = [
    adminLayer,
    baseLayer,
    envLayer,
    investmentLayer,
    socialLayer,
    transportLayer,
    utilitiesLayer,
    cadastralLayer,
  ];

  // 🔥 Apply popup dynamically to ALL layers
  layers.forEach(applyPopupToSublayers);

  return layers;
};