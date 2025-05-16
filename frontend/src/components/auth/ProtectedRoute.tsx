import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

/**
 * A component that protects routes based on authentication and user roles
 * @param allowedRoles - The roles that are allowed to access this route (optional)
 * @param redirectPath - Where to redirect if user isn't authenticated (default: /login)
 */
export const ProtectedRoute = ({
  allowedRoles,
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-500" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If we're checking roles and the user doesn't have the required role
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on their role
      switch (user.role) {
        case "student":
          return <Navigate to="/my-courses" replace />;
        case "teacher":
          return <Navigate to="/teacher/courses" replace />;
        case "admin":
          return <Navigate to="/admin" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
