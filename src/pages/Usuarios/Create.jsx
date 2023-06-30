import React from 'react'
import DrawerIcons from '../../components/ui/DrawerIcons';
import Titles from '../../components/ui/Titles';
import UploadImage from '../../components/ui/UploadImage';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import UploadFile from '../../components/ui/UploadFile';
import { pink } from '@mui/material/colors';



const Create = () => {
    return (
        <DrawerIcons>
            <Titles
                name={<h2 align='center'>Nuevo usuario</h2>}
            />
            <Box color='#F7BFBF' borderRadius={5} mt={3} sx={{ border: 3, p: 5 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} backgroundColor="#D7B3C6" color="common.black" sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='h5' align='center'>Datos Generales</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <UploadImage />
                    </Grid>
                    <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <TextField id="outlined-basic" label="Nombre" variant="outlined" fullWidth="true" />
                        <Grid item sx={{ display: 'flex', py: 2 }}>
                            <TextField id="outlined-basic" label="Telefono" variant="outlined" fullWidth="true" sx={{ pr: 2 }} />
                            <TextField id="outlined-basic" label="Correo" variant="outlined" fullWidth="true" />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} backgroundColor="#D7B3C6" color="common.black" sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='h5' align='center'>Registra los siguientes datos de tu dirección</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="outlined-basic" label="Calle" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="outlined-basic" label="Numero interior" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="outlined-basic" label="Numero exterior" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="outlined-basic" label="Codigo postal" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="outlined-basic" label="Colonia" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="outlined-basic" label="Municipio" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="outlined-basic" label="Ciudad" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={12} backgroundColor="#D7B3C6" color="common.black" sx={{ display: 'flex', justifyContent: 'center', mt:2 }}>
                        <Typography variant='h5' align='center'>Documentos</Typography>
                    </Grid>
                    <Grid item xs={6} color="common.black" sx={{ display:'flex', justifyContent: 'space-between', mt:2}}>
                        <Typography variant='h5' align='center'>Ine:</Typography>
                        <UploadFile/>
                    </Grid>
                    <Grid item xs={6} color="common.black" sx={{ display: 'flex', justifyContent: 'space-between', mt:2 }}>
                        <Typography variant='h5' align='center'>Comprobante domiciliario:</Typography>
                        <UploadFile/>
                    </Grid>
                    <Grid item xs={6} color="common.black" sx={{ display: 'flex', justifyContent: 'space-between', mt:2 }}>
                        <Typography variant='h5' align='center'>Antecedentes no penales:</Typography>
                        <UploadFile/>
                    </Grid>
                    <Grid item xs={6} color="common.black" sx={{ display: 'flex', justifyContent: 'space-between', mt:2 }}>
                        <Typography variant='h5' align='center'>Curp:</Typography>
                        <UploadFile/>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center'}}>
                        <Button variant="contained" size='large'  sx={{bgcolor:pink[500],  mt:5 }}>Guardar</Button>
                    </Grid>
                </Grid>
            </Box>
        </DrawerIcons>
    )
}

export default Create
