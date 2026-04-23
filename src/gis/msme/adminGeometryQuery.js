import { ADMIN_MS } from './serviceUrlsAndLayers.js'
import { queryLayer } from './queryClient.js'
import { geomFromJSON, ensureSR32643, geometryIsUsable } from './geometryUtils.js'

export function pickFirstUsableGeometryFromFeatures(features) {
  if (!features || !features.length) return null
  var i
  for (i = 0; i < features.length; i++) {
    var rawG = features[i].geometry
    if (!rawG) continue
    var g = ensureSR32643(geomFromJSON(rawG))
    if (geometryIsUsable(g)) return g
  }
  return null
}

/**
 * @returns {Promise<{ geometry: *, attributes: object|null }>}
 */
export function queryAdministrativeGeometryForZoom(layerId, where, outFields) {
  var fields = outFields || '*'
  return queryLayer(ADMIN_MS, layerId, {
    where: where,
    outFields: fields,
    returnGeometry: true,
    resultRecordCount: 15,
  }).then(function (data) {
    var feats = data && data.features
    if (!feats || !feats.length) return { geometry: null, attributes: null }
    var attrs = feats[0] ? feats[0].attributes : null
    var picked = pickFirstUsableGeometryFromFeatures(feats)
    if (picked) return { geometry: picked, attributes: attrs }
    return queryLayer(ADMIN_MS, layerId, {
      where: where,
      outFields: fields,
      returnGeometry: true,
      returnExtentOnly: true,
      resultRecordCount: 5,
    }).then(function (data2) {
      var feats2 = data2 && data2.features
      if (!feats2 || !feats2.length) return { geometry: null, attributes: attrs }
      var attrs2 = feats2[0] ? feats2[0].attributes : attrs
      var g2 = pickFirstUsableGeometryFromFeatures(feats2)
      return { geometry: g2, attributes: attrs2 }
    })
  })
}
