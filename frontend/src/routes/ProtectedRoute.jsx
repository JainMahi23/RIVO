import { Navigate, Outlet } from "react-router-dom";

// Placeholder route guard. Real auth check (token validation, refresh,
// redirect-with-return-url, etc.) will be implemented in the auth module.
// For now this always allows access so the rest of the app can be built
// and tested without a working login flow.
export default function ProtectedRoute() {
  const isAuthenticated = true; // TODO: replace with real auth state

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
