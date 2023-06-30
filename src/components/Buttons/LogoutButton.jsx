import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import {useAuthStore} from '../../hooks'

const InButton = styled(Button)(() => ({
    backgroundColor: 'red',
    "&:hover": {
        backgroundColor: '#000000',
    },
}));



export const LogoutButton = () => {
    
    const { startLogout } = useAuthStore()
  return (
    <>
      
        <InButton
          variant="outlined"
          sx={{m:2}}
          onClick={startLogout}
        >
          <Typography variant="h6" color="#00a399">
            Cerrar Sesión
          </Typography>
        </InButton>
      
    </>
  );
};

