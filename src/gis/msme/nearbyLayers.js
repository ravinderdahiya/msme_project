import {
  BASE_MS,
  CON_MS,
  ENV_MS,
  INT_LAYERS,
  INV_MS,
  POI_LAYERS,
  SOC_MS,
  TRANS_MS,
  UTIL_LINES,
  UTIL_MS,
} from './serviceUrlsAndLayers.js'
import { requestArcGisJson } from './queryClient.js'

export function mergeNearbyLayerLists(pointLayersFromServices) {
  var seen = {}
  var out = []
  function add(p) {
    if (!p || p.layerId == null) return
    var k = p.url + '|' + p.layerId
    if (seen[k]) return
    seen[k] = true
    out.push({ url: p.url, layerId: p.layerId, label: p.label || 'Layer ' + p.layerId })
  }
  ;(pointLayersFromServices || []).forEach(add)
  POI_LAYERS.forEach(add)
  INT_LAYERS.forEach(add)
  UTIL_LINES.forEach(add)
  return out
}

/** Load every queryable point / multipoint sublayer from MSME MapServer roots. */
export function fetchPointLayersFromMapServers() {
  var services = [TRANS_MS, UTIL_MS, SOC_MS, INV_MS, ENV_MS, BASE_MS, CON_MS]
  return Promise.all(
    services.map(function (url) {
      return requestArcGisJson(url + '?f=json', { responseType: 'json' })
        .then(function (res) {
          var layers = (res.data && res.data.layers) || []
          return layers
            .filter(function (ly) {
              if (ly.subLayerIds && ly.subLayerIds.length) return false
              return ly.geometryType === 'esriGeometryPoint' || ly.geometryType === 'esriGeometryMultipoint'
            })
            .map(function (ly) {
              return { url: url, layerId: ly.id, label: ly.name || 'Layer ' + ly.id }
            })
        })
        .catch(function (e) {
          console.warn('[nearby] could not read layers', url, e)
          return []
        })
    }),
  ).then(function (arrays) {
    return [].concat.apply([], arrays)
  })
}
