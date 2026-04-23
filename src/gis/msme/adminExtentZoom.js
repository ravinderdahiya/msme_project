/**
 * Dropdown → FeatureLayer.queryExtent → MapView.goTo (same idea as Esri samples).
 * MapServer sublayer URL: `{MapServer}/{layerId}` works when the sublayer is queryable.
 *
 * @see https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#queryExtent
 */
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import { ADMIN_MS } from './serviceUrlsAndLayers.js'

function extentIsEmpty(ext) {
  if (!ext || !isFinite(ext.xmin) || !isFinite(ext.xmax)) return true
  return ext.width === 0 && ext.height === 0
}

/**
 * Zoom the map to the combined extent of features matching `where` on an admin sublayer.
 * @param {import('@arcgis/core/views/MapView').default} view
 * @param {number} layerId e.g. LAYER_DISTRICT, LAYER_TEHSIL, LAYER_VILLAGE
 * @param {string} whereClause SQL where (use quoted field values)
 * @param {object} [padding] view padding (e.g. getUiZoomPadding())
 * @param {number} [durationMs]
 * @returns {Promise<boolean>} true if extent zoom ran; false if no extent or error (caller may fall back)
 */
export function zoomToAdminFeatureExtent(view, layerId, whereClause, padding, durationMs) {
  if (!view || layerId == null || !whereClause) return Promise.resolve(false)
  var url = ADMIN_MS + '/' + layerId
  var layer = new FeatureLayer({ url: url })
  var q = layer.createQuery()
  q.where = whereClause
  if (view.spatialReference) q.outSpatialReference = view.spatialReference
  return layer
    .load()
    .then(function () {
      return layer.queryExtent(q)
    })
    .then(function (res) {
      if (!res || !res.extent || extentIsEmpty(res.extent)) return false
      var ext = res.extent
      if (typeof ext.expand === 'function') ext = ext.expand(1.18)
      return view.when().then(function () {
        return view.goTo(ext, {
          padding: padding || {},
          duration: durationMs != null ? durationMs : 900,
          easing: 'ease-in-out',
        })
      }).then(function () {
        return true
      })
    })
    .catch(function (err) {
      console.warn('[admin FeatureLayer.queryExtent]', err)
      return false
    })
}
