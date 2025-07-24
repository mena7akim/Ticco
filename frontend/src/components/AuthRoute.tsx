import type { RouteProps } from "@/types/types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthRoute({ user, redirectPath = "/" }: RouteProps) {
  const location = useLocation();

  // If no user, redirect to sign-in
  if (user) {
    if (user.firstName) return <Navigate to={redirectPath} replace />;
    if (location.pathname !== "/auth/create-profile") {
      return <Navigate to="/auth/create-profile" replace />;
    }
  }

  return <Outlet />;
}

export default AuthRoute;
