export const getDefaultRouteForUser = (user) => {
  const role = String(user?.role || "").toLowerCase()
  if (role === "admin" || role === "superadmin") {
    return "/newadmin/dashboard"
  }
  return "/msme-gis-map"
}
