import { AppBar, createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#0d2b6b",
      contrastText: '#ffffff',
    },
    secondary: {
      main: "#89C2FF",
      contrastText: "#0D2B6B",
    },
    info:{
      main:'#90277d',
      contrastText:'#f5dbf0'
    }
    
  },
  typography:{
  fontFamily:'DosisExtraBold',
  },

  
  
});
