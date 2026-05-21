import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol.js'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js'

/** Teardrop map-pin path (tip at bottom). */
export const MAP_PIN_PATH =
  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'

/** Red location pin for map click / identify point highlights. */
export function createRedLocationPinSymbol(size = 20) {
  return new SimpleMarkerSymbol({
    style: 'path',
    path: MAP_PIN_PATH,
    color: [226, 35, 26, 0.98],
    size,
    outline: new SimpleLineSymbol({
      color: [255, 255, 255, 1],
      width: 1.25,
    }),
  })
}
