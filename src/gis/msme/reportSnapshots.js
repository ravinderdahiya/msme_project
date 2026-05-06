var lastAoiLandReportSnapshot = null;
var lastMapSelectionReportSnapshot = null;
var lastAnalysisReportSnapshot = null;

export function publishAoiLandReportSnapshot(payload) {
  lastAoiLandReportSnapshot = payload;
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("msme-aoi-land-report-snapshot"));
    }
  } catch (e0) {}
}

export function publishMapSelectionReportSnapshot(payload) {
  lastMapSelectionReportSnapshot = payload;
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("msme-map-selection-report-snapshot"));
    }
  } catch (e0) {}
}

export function publishAnalysisReportSnapshot(payload) {
  lastAnalysisReportSnapshot = payload;
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("msme-analysis-report-snapshot"));
    }
  } catch (e0) {}
}

export function publishAnalysisToolResult(toolId, summary, extra) {
  var p = {
    generatedAt: new Date().toISOString(),
    reportKind: "analysis",
    tool: toolId,
    summary: summary
  };
  if (extra && typeof extra === "object") {
    Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
  }
  publishAnalysisReportSnapshot(p);
  return p;
}

export function getAoiLandReportSnapshot() {
  return lastAoiLandReportSnapshot;
}

export function getMapSelectionReportSnapshot() {
  return lastMapSelectionReportSnapshot;
}

export function getAnalysisReportSnapshot() {
  return lastAnalysisReportSnapshot;
}
