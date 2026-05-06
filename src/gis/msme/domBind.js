/** Avoid throwing on missing nodes; a single throw aborts all later wiring. */
export function msmeBind(id, evt, handler) {
  var el = document.getElementById(id);
  if (!el) {
    console.warn("[GIS] Missing #" + id + " - skipping " + evt + " handler.");
    return false;
  }
  el.addEventListener(evt, handler);
  return true;
}
