import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../hooks";


const PrivateRoutes = ({ children }) => {
  const { logged } = useAuthStore();
  
  return logged ? children : <Navigate to={'/'}/>
  
};

export default PrivateRoutes;
