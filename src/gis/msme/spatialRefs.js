import SpatialReference from '@arcgis/core/geometry/SpatialReference.js'
import Extent from '@arcgis/core/geometry/Extent.js'

export const SR_METER = new SpatialReference({ wkid: 32643 })
export const SR_WEB = new SpatialReference({ wkid: 3857 })
export const SR4326 = new SpatialReference({ wkid: 4326 })

export const defaultStudyExtent32643 = new Extent({
  xmin: 449090,
  ymin: 3060174,
  xmax: 750463,
  ymax: 3423348,
  spatialReference: SR_METER,
})
