import { Navigate } from "react-router-dom";
import { getCurrentUser, getToken } from "../utils/authStorage";

function ProtectedRoute({ children, requiredRoles = [] }) {
  const token = getToken();
  const user = getCurrentUser();

  if (!token) return <Navigate to="/login" />;
  if (requiredRoles.length > 0) {
    const role = String(user?.role || "").toLowerCase();
    const allowed = requiredRoles.map((item) => String(item).toLowerCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/msme-gis-map" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
