import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import icono2 from "../../assets/Images/icono2.2.png";
import { NavLink } from "react-router-dom";

const InButton = styled(Button)(() => ({
  backgroundColor: '#FFFFFF',
  "&:hover": {
    backgroundColor: '#000000',
  },
}));

 export const LoginButton = (props) => {

  return (
    <>
      <NavLink to={props.path}>
        <InButton
          variant="outlined"
          sx={{m:2}}
          startIcon={<img width={"60px"} src={icono2} alt="Icono" />}
        >
          <Typography variant="h6" color="#00a399">
            Iniciar Sesión
          </Typography>
        </InButton>
      </NavLink>
    </>
  );
};




