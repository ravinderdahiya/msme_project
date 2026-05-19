/** Public GIS map — also the site home route. */
export const MSME_GIS_HOME = "/"

export const getDefaultRouteForUser = (user) => {
  const role = String(user?.role || "").toLowerCase()
  if (role === "admin" || role === "superadmin") {
    return "/newadmin/dashboard"
  }
  return MSME_GIS_HOME
}

/** Only allow in-app relative redirects (blocks open redirects). */
export function resolveSafeRedirectPath(path) {
  const value = String(path || "").trim()
  if (!value.startsWith("/") || value.startsWith("//")) return ""
  if (value.startsWith("/login")) return ""
  return value
}

export function getPostLoginRoute(user, redirectFromQuery) {
  const safe = resolveSafeRedirectPath(redirectFromQuery)
  if (safe) return safe
  return getDefaultRouteForUser(user)
}
