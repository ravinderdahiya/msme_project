import { clearAuthSession, getToken, notifyAuthSessionChanged } from "./authStorage.js"

const PUBLIC_GIS_PATHS = new Set(["/", "/msme-gis-map"])

function isPublicGisPath(pathname) {
  const path = String(pathname || "/").replace(/\/+$/, "") || "/"
  return PUBLIC_GIS_PATHS.has(path)
}

/**
 * Handle 401/403 from map proxy without kicking guests off the public GIS home page.
 */
export function handleGisUnauthorized() {
  if (typeof window === "undefined") return

  const hadSession = Boolean(getToken())
  try {
    clearAuthSession()
  } catch {
    /* ignore */
  }
  notifyAuthSessionChanged()

  const path = window.location.pathname || "/"
  if (isPublicGisPath(path)) return
  if (!hadSession) return
  if (window.__msmeArcGisAuthRedirecting) return

  window.__msmeArcGisAuthRedirecting = true
  const redirect = encodeURIComponent(`${path}${window.location.search || ""}`)
  window.location.assign(`/login?redirect=${redirect}`)
}
