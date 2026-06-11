import { Outlet } from "react-router-dom";
import { MainLayout } from "./MainLayout";

const MainLayoutRoute = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default MainLayoutRoute;
