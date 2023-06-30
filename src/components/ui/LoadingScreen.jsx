import { ColorRing, RotatingLines, ThreeCircles, ThreeDots, Vortex } from "react-loader-spinner";
import { Box } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
    component={'div'}
    className="GradientItem"
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "static",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThreeCircles
  height="200"
  width="300"
  color="##D7B3C6"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  ariaLabel="three-circles-rotating"
  outerCircleColor="white"
  innerCircleColor="#0d2b6b"
  middleCircleColor="#D7B3C6"
/>
    
   {/* '#00a399', '#cb5b55', '#00a399', '#382e73', '#c7c1e6' */}

    </Box>
  );
};

export default LoadingScreen;
