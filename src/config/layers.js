import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

const PROXY_ROOT = "/mapserver/service"
const MAP_SERVER_URLS = {
  admin: `${PROXY_ROOT}/MSME_ADMIN_BOUNDARIES`,
  base: `${PROXY_ROOT}/MSME_BASE_REFERENCE`,
  env: `${PROXY_ROOT}/MSME_ENVIRONMENT`,
  investment: `${PROXY_ROOT}/MSME_INVESTMENT`,
  social: `${PROXY_ROOT}/MSME_SOCIAL`,
  transport: `${PROXY_ROOT}/MSME_TRANSPORT`,
  utilities: `${PROXY_ROOT}/MSME_UTILITIES`,
  cadastral: `${PROXY_ROOT}/MSME_CADASTRAL`,
}

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
  const TRANSPORT_ROAD_SUBLAYER_IDS = new Set([3, 4, 5]);

  const adminLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.admin,
    title: "Administrative Boundaries",
    visible: true,
  });

  const baseLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.base,
    title: "Base Reference Layers",
    visible: true,
  });

  const envLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.env,
    title: "Environmental Constraints",
    visible: true,
  });

  const investmentLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.investment,
    title: "Investment Zones",
    visible: true,
  });

  const socialLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.social,
    title: "Social Infrastructure",
    visible: true,
  });

  const transportLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.transport,
    title: "Transportation Infrastructure",
    visible: true,
  });
  transportLayer.when(() => {
    transportLayer.allSublayers.forEach((sublayer) => {
      const isRoads = TRANSPORT_ROAD_SUBLAYER_IDS.has(sublayer.id);
      sublayer.visible = isRoads;
      if (isRoads) {
        sublayer.minScale = 0;
        sublayer.maxScale = 0;
      }
    });
  });

  const utilitiesLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.utilities,
    title: "Utilities",
    visible: true,
  });

  const cadastralLayer = new MapImageLayer({
    url: MAP_SERVER_URLS.cadastral,
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
