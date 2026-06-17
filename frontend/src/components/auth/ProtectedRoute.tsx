import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
