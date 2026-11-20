import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return;

  return token ? (
    <Outlet />
  ) : (
    <Navigate
      to="/signin"
      replace
      state={{ from: `${location.pathname}${location.search}${location.hash}` }}
    />
  );
};

export default ProtectedRoute;
