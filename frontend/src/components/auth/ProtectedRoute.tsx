import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) return <p className="text-center">loading...</p>;

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
