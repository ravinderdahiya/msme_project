export function optionTextByValue(selectEl, value) {
  if (!selectEl || !selectEl.options) return "";
  var needle = String(value == null ? "" : value).trim();
  if (!needle) return "";
  for (var i = 0; i < selectEl.options.length; i++) {
    var opt = selectEl.options[i];
    if (String(opt.value || "").trim() === needle) {
      return String(opt.textContent || opt.text || "").trim();
    }
  }
  return "";
}
