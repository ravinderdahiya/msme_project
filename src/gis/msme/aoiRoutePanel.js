export function getSelectedAoiLabel() {
  function getText(id) {
    var el = document.getElementById(id);
    if (!el || !el.options || el.selectedIndex < 0) return "";
    var txt = String((el.options[el.selectedIndex] && el.options[el.selectedIndex].text) || "").trim();
    return txt;
  }
  var v = getText("villageSelect");
  var t = getText("tehsilSelect");
  var d = getText("districtSelect");
  return v || t || d || "Selected AOI";
}

export function openAoiRoutePanel() {
  var panel = document.getElementById("aoiRoutePanel");
  if (panel) panel.classList.add("open");
}

export function closeAoiRoutePanel() {
  var panel = document.getElementById("aoiRoutePanel");
  if (panel) panel.classList.remove("open");
}

export function renderAoiRoutePanel(summary, steps, isError) {
  var panel = document.getElementById("aoiRoutePanel");
  var sumEl = document.getElementById("aoiRouteSummary");
  var stepsEl = document.getElementById("aoiRouteSteps");
  if (!panel || !sumEl || !stepsEl) return;

  panel.classList.toggle("is-error", !!isError);
  sumEl.textContent = summary || "";
  stepsEl.innerHTML = "";
  (steps || []).forEach(function (line) {
    if (!line) return;
    var li = document.createElement("li");
    li.textContent = line;
    stepsEl.appendChild(li);
  });
}
