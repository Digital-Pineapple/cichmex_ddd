import React from 'react'
import DrawerIcons from '../../components/ui/DrawerIcons';
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
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';

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

function createData(nombre, servicio, precio, estatus) {
    return { nombre, servicio, precio, estatus };
}

const rows = [
    createData('Motocicleta', 'Autolavado express', 150, 'activo'),
    createData('Carro', 'Autolavado con aspiradora', 200, 'activo'),
    createData('Camioneta', 'Autolavado con cera y espuma', 250, 'activo'),
];

const themeColor = createTheme({
    palette: {
        primary: {
            main: '#CC3C5C',
        },
    },
});

const TypeCar = () => {
  return (
    <DrawerIcons>
    <ThemeProvider theme={themeColor}>
        <Titles
            name={<h2 align='center'>Tipos de carro</h2>}
        />
        <Button variant="contained" disableElevation sx={{ color: "CC3C5C", my: 5, p: 2, borderRadius: 5 }}>
            Registrar nuevo tipo de carro 
        </Button>
    </ThemeProvider>
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
                <TableRow>
                    <StyledTableCell>Nombre</StyledTableCell>
                    <StyledTableCell align="center">Servicio</StyledTableCell>
                    <StyledTableCell align="center">Precio</StyledTableCell>
                    <StyledTableCell align="center">Estatus</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <StyledTableRow key={row.nombre}>
                        <StyledTableCell component="th" scope="row">
                            {row.nombre}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row.servicio}</StyledTableCell>
                        <StyledTableCell align="center">{row.precio}</StyledTableCell>
                        <StyledTableCell align="center">{row.estatus}</StyledTableCell>
                    </StyledTableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    <ThemeProvider theme={themeColor}>
        <Box display="flex" justifyContent="center" py={10}>
            <Pagination count={10} color="primary" />
        </Box>
    </ThemeProvider>
</DrawerIcons>
)
}

export default TypeCar
