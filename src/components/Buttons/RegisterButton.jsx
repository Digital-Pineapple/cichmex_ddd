import styled from "@emotion/styled";
import { Button, Typography, BottomNavigation, Grid } from "@mui/material";
import { purple } from "@mui/material/colors";
import React from "react";
import icono2 from "../../assets/Images/icono2.2.png";
import { NavLink } from "react-router-dom";

const RegBut = styled(Button)`
    ${({ theme }) => `
  cursor: pointer;
  background-color: ${theme.palette.primary.main};
  transition: ${theme.transitions.create(["background-color", "transform"], {
    duration: theme.transitions.duration.standard,
  })};
  &:hover {
    background-color: ${theme.palette.secondary.main};
    transform: scale(1.3);
  }
  `}
  `;

export const RegisterButton = () => {
  return (
    <>
      <NavLink to="/register1">
        <RegBut
        sx={{borderRadius:'15px'}}
          variant='contained'
          startIcon={<img width={"40px"} src={icono2} alt="Icono" />}
        >
          <Typography  variant="h5" color='whitesmoke'>
            Registrarse  
          </Typography>
        </RegBut>
      </NavLink>
    </>
  );
};
