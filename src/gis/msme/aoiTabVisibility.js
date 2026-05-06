export function isAdministrativeAoiTabActive() {
  var tabAoi = document.getElementById("tabAoi");
  var mpAoi = document.getElementById("mpAoi");
  if (tabAoi && tabAoi.classList.contains("active")) return true;
  if (mpAoi && mpAoi.classList.contains("active")) return true;
  return false;
}
