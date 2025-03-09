import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "@/store/store";

const PrivateRoute = () => {
  const userData = useSelector(
    (state: RootState) => !!state.user.authenticated,
  );

  return userData ? <Outlet /> : <Navigate to="/page-not-found" />;
};

export default PrivateRoute
