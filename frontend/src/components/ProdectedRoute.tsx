import type { RouteProps } from "@/types/types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { BottomNavbar } from "./ui/bottom-navbar";

function ProtectedRoute({ user, redirectPath = "/auth/sign-in" }: RouteProps) {
  const location = useLocation();

  // If no user, redirect to sign-in
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // If user exists but has no firstName (incomplete profile), redirect to create-profile
  // But don't redirect if we're already on the create-profile page
  if (!user.firstName && location.pathname !== "/auth/create-profile") {
    return <Navigate to="/auth/create-profile" replace />;
  }

  return (
    <div className="pb-16">
      <Outlet />
      <BottomNavbar />
    </div>
  );
}

export default ProtectedRoute;
