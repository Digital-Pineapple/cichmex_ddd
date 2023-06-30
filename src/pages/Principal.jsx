import { Grid} from '@mui/material'
import Carwash from '../assets/Images/icono1.png'
import Image from 'mui-image'
import { LogoutButton } from '../components/Buttons/LogoutButton'


export const Principal = () => {
  return (
    <>
      <Grid >

        <Image
          src={Carwash}
          fit="cover"
          easing="linear"
          duration={3000}
          shift={null}
          shiftDuration={500}
          style={{minHeight:'850px', maxHeight:'100vh'}}
        />
      <LogoutButton />
      </Grid>
      
     
    </>
  )
}