import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) return;

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
