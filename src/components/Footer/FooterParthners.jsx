import Stack from "@mui/material/Stack";

import { Typography, IconButton, Grid} from "@mui/material";
import { FacebookOutlined, Instagram, YouTube } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const FooterParthners = () => {
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
