import { Navigate, useLocation } from "react-router-dom";
import { clearAuthSession, getCurrentUser, getToken } from "../utils/authStorage";
import { isDepartmentUser } from "../utils/authRedirect";

function isJwtExpired(token) {
  if (!token || typeof token !== "string") return true;
  const parts = token.split(".");
  if (parts.length < 2) return true;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const normalized = pad ? base64 + "=".repeat(4 - pad) : base64;
    const payload = JSON.parse(atob(normalized));
    const exp = Number(payload?.exp);
    if (!Number.isFinite(exp)) return false;
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function ProtectedRoute({ children, requiredRoles = [] }) {
  const location = useLocation();
  const token = getToken();
  const user = getCurrentUser();
  const loginTo = `/login?redirect=${encodeURIComponent(
    `${location.pathname}${location.search}`,
  )}`;

  if (!token) return <Navigate to={loginTo} replace />;
  if (isJwtExpired(token)) {
    clearAuthSession();
    return <Navigate to={loginTo} replace />;
  }
  if (requiredRoles.length > 0) {
    const needsAdminArea = requiredRoles.some((item) => {
      const key = String(item).toLowerCase();
      return key === "admin" || key === "superadmin";
    });
    if (needsAdminArea) {
      if (!isDepartmentUser(user)) {
        return <Navigate to="/" replace />;
      }
    } else {
      const role = String(user?.role || "").toLowerCase();
      const allowed = requiredRoles.map((item) => String(item).toLowerCase());
      if (!allowed.includes(role)) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
}

export default ProtectedRoute;
