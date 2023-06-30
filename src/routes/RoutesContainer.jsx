import { AllRoutes } from "../routes/AllRoutes";
import { NavbarParthners } from "../components/Navbar/NavbarParthners";
import { Route, Routes } from "react-router-dom";
import PublicPages from "./PublicPages";
import PrivateRoutes from "./PrivateRoutes";
import { FooterParthners, Navbar } from "../components";
import { Links } from "./Links";

const RoutesContainer = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <PublicPages> 
            <Routes>
              {AllRoutes.filter(({ type }) => type === 0).map(
                ({ path, element }, index) => (
                  <Route path={path} element={element} key={index} />
                )
              )}
            </Routes>
          </PublicPages>
        }
      />
      <Route
        path="/auth/*"
        element={
          <PrivateRoutes>
           <Navbar navArrayLinks={Links} />   
            <Routes>
              {AllRoutes.filter(({ type }) => type === 1).map(
                ({ path, element }, index) => (
                  <Route path={path} element={element} key={index} />
                )
              )}
            </Routes>
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};

export default RoutesContainer;
