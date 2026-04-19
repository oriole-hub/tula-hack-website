import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../../shared/state/session";
import { canAccessRoute, getDefaultRoute } from "../../features/rbac/access";

export const ProtectedRoute = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, role } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!canAccessRoute(role, pathname)) {
    return <Navigate to={getDefaultRoute(role)} replace />;
  }

  return <Outlet />;
};
