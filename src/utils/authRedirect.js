/** Public GIS map — also the site home route. */
export const MSME_GIS_HOME = "/"

/** Department / admin console (after department login). */
export const NEW_ADMIN_HOME = "/newadmin/dashboard"

const DEPARTMENT_ROLE_KEYS = new Set([
  "admin",
  "superadmin",
  "super_admin",
  "department",
  "departmentadmin",
  "department_admin",
  "official",
])

/** True for department login (admin console), not investors. */
export function isDepartmentUser(user) {
  if (!user || typeof user !== "object") return false

  const role = String(user.role ?? user.userRole ?? user.user_type ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")

  if (!role) return Boolean(user.isAdmin || user.isDepartment)
  if (role === "investor" || role === "user" || role === "guest") return false
  if (DEPARTMENT_ROLE_KEYS.has(role)) return true
  if (role.includes("admin") || role.includes("department")) return true

  return Boolean(user.isAdmin || user.isDepartment)
}

export const getDefaultRouteForUser = (user) => {
  if (isDepartmentUser(user)) {
    return NEW_ADMIN_HOME
  }
  return MSME_GIS_HOME
}

/** After department credentials on /login — always land in admin app (not GIS). */
export function getDepartmentPostLoginRoute(redirectFromQuery) {
  const safe = resolveSafeRedirectPath(redirectFromQuery)
  if (safe && safe.startsWith("/newadmin")) return safe
  return NEW_ADMIN_HOME
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
