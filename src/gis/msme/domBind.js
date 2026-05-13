/** Avoid throwing on missing nodes; a single throw aborts all later wiring. */
export function msmeBind(id, evt, handler) {
  var el = document.getElementById(id);
  if (!el) {
    // Some tool buttons are intentionally not mounted in newer UI variants.
    console.debug("[GIS] Missing #" + id + " - skipping " + evt + " handler.");
    return false;
  }
  el.addEventListener(evt, handler);
  return true;
}
