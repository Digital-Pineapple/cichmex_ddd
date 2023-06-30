import React from 'react'
import { useNavigate } from 'react-router-dom';
import Titles from '../../components/ui/Titles';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import WarningAlert from '../../components/ui/WarningAlert';
import { useEffect } from 'react';
import { useServices } from '../../hooks/useServices';
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#CC3C5C",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const themeColor = createTheme({
    palette: {
        primary: {
            main: '#CC3C5C',
        },
    },
});

const Services = () => {

    const navigate = useNavigate();

    const { loadServices, services, deleteService } = useServices();

    useEffect(() => {
        loadServices();
    }, [])
    
    return (

        <>
        <Grid marginX={'240px'} >
          
       
            <ThemeProvider theme={themeColor}>
                <Titles
                    name={<h2 align='center'>Servicios</h2>}
                />
                <Button variant="contained" disableElevation sx={{ color: "CC3C5C", my: 5, p: 2, borderRadius: 5 }} onClick={() => console.log('xs')}>
                    Registrar nuevo servicio
                </Button>
            </ThemeProvider>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Nombre</StyledTableCell>
                            <StyledTableCell align="center">Descripción</StyledTableCell>
                            <StyledTableCell align="center">Opciones</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <StyledTableRow key={service.name}>
                                <StyledTableCell component="th" scope="row">
                                    {service.name}
                                </StyledTableCell>
                                <StyledTableCell align="center">{service.description}</StyledTableCell>
                                <StyledTableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <WarningAlert
                                        route={service._id}
                                        title={<h4>¿Estas seguro de eliminar este usuario?</h4>}
                                        callbackToDeleteItem={() => deleteService(service._id)}
                                    />
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </Grid>
        </>

    )
}

export default Services
