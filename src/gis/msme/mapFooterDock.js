/** Moves Esri scale label into the map footer bar beside coordBar. */
export function installMapFooterScaleDock() {
  if (typeof window === 'undefined') return () => {}

  let stopped = false

  function dockScaleLabel() {
    if (stopped) return
    const slot = document.getElementById('msmeGisMapScaleSlot')
    const label = document.querySelector('#viewDiv .esri-ui-bottom-left .esri-scale-bar__label')
    if (!slot || !label || label.parentElement === slot) return
    slot.appendChild(label)
  }

  dockScaleLabel()
  const timer = window.setInterval(dockScaleLabel, 400)

  return () => {
    stopped = true
    window.clearInterval(timer)
  }
}
