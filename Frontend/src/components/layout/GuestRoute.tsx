import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

import { AuthPageSkeleton } from "@/components/ui/Skeleton";

export interface GuestRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function GuestRoute({ children, fallback }: GuestRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return fallback ? <>{fallback}</> : <AuthPageSkeleton />;
  }

  if (isAuthenticated && user) {
    const role = String(user.role).toLowerCase();
    if (role === "superadmin") {
      return <Navigate to="/super-admin/dashboard" replace />;
    }
    if (role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    if (role === "accountant") {
      return <Navigate to="/accountant/sales-ledger" replace />;
    }
    return <Navigate to="/pos" replace />;
  }

  return <>{children}</>;
}
