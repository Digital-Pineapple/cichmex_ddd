import Stack from "@mui/material/Stack";

import { Typography, Box, IconButton, Grid, Button } from "@mui/material";
import { FacebookOutlined, Instagram, YouTube, YoutubeSearchedForOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { light } from "@mui/material/styles/createPalette";

export const Footer = ({ navArrayLinks }) => {
  return (
    <>
        <Grid
          container
          spacing={0}
          direction="row"
          justify="flex-start"
          alignItems={'center'}
          alignContent='center'
          wrap="nowrap"
          bgcolor={'#89C2FF'}
          sx={{opacity:'0.9', justifyContent:'space-evenly'}}
          position={'relative'}
          
        >
        <Stack
          paddingX={{xs: 0, sm:5, md: 13, }}
          mt={7}
          direction={{ xs: "column ", sm: "column", }}
          justifyContent={'center'}

          m={1}
         
        >
          <Typography  variant="h5" component={'h1'} align="center">
            Compañía
          </Typography>
          {navArrayLinks.map((item) => (
            
              <Link
                key={item.title}
                style={{textDecorationLine:'blink' }}
                to={item.path}
              >
                
                <Typography textAlign={'center'} color='#0D2B6B' variant="body1">
                  {item.title}
                </Typography>
                
              </Link>
          ))}
        </Stack>
        <Stack
          paddingX={{xs: 0, sm:10, md: 11, lg:22, xl:20}}
          direction={{ xs: "column", sm: "column" }}
          alignItems={'center'}
          
        >
          <Typography variant="h5" align="center">
            Avisos
          </Typography>
          <Link
            component="button"
            onClick={() => {
              console.info("I'm a button.");
            }}
          >
            Aviso de privacidad
          </Link>

          <Link
            component="button"
            variant="body2"
            onClick={() => {
              console.info("I'm a button.");
            }}
          >
            Aviso de cookies
          </Link>
        </Stack>
        <Stack
          spacing={{  sm: 2, md: 2 }}
          direction={{ xs: "column", sm: 'row' }}
          display={'inline-block'}
          justifyContent={'center'}
        >
          <Typography variant="h5" align="center">
            ¡Siguenos en redes Sociales!
          </Typography>

          <IconButton color="primary" aria-label="Facebook">
            <FacebookOutlined sx={{fontSize:50}} />
          </IconButton  >

          <IconButton color="primary" aria-label="Instagram">
            <Instagram sx={{fontSize:50}} />
          </IconButton>

          <IconButton color="primary" aria-label="Instagram">
            <YouTube sx={{fontSize:50}} />
            </IconButton>
        </Stack>
          
        </Grid>
      
      </>
  );
};
