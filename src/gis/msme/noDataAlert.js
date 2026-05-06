export function alertNoData(ctx, setStatus) {
  var m = "No results" + (ctx ? ": " + ctx : "") + ".";
  window.alert(m);
  if (typeof setStatus === "function") {
    setStatus(m);
  }
}
