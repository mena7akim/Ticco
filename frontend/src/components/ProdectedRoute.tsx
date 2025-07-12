import type { ProtectedRouteProps } from "@/types/types";
import { Navigate, Outlet } from "react-router";
import { BottomNavbar } from "./ui/bottom-navbar";

function ProtectedRoute({
  user,
  redirectPath = "/auth/sign-in",
}: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  return (
    <div className="pb-16">
      <Outlet />
      <BottomNavbar />
    </div>
  );
}

export default ProtectedRoute;
