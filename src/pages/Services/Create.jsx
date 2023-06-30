import React from 'react'
import DrawerIcons from '../../components/ui/DrawerIcons';
import Titles from '../../components/ui/Titles';
import UploadImage from '../../components/ui/UploadImage';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';


const Create = () => {
    return (
        <DrawerIcons>
            <Titles
                name={<h2 align='center'>Nuevo servicio</h2>}
            />
            <Box color='#F7BFBF' borderRadius={5} mt={3} sx={{ border: 3, p: 5 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <UploadImage />
                    </Grid>
                    <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <TextField id="outlined-basic" label="Nombre" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="outlined-basic" label="Descripción" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="outlined-basic" label="Precio" variant="outlined" fullWidth="true" />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Estatus</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <Typography variant="h3" color="common.black">
                                    <FormControlLabel value="female" control={<Radio />} label="Activo" />
                                    <FormControlLabel value="male" control={<Radio />} label="Desactivado" />
                                </Typography>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" >Guardar</Button>
                    </Grid>
                </Grid>
            </Box>
        </DrawerIcons>
    )
}

export default Create
