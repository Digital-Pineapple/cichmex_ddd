import { useEffect, useLayoutEffect, useState } from "react";
import Titles from "../../components/ui/Titles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import WarningAlert from "../../components/ui/WarningAlert";
import { useCustomers } from "../../hooks/useCustomers";
import { styled } from "@mui/system";
import { Box, Grid } from "@mui/material";
import { Pagination } from "antd";
import InputSearch from "../../components/ui/InputSearch";
import { useSelector } from "react-redux";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CC3C5C",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Users = () => {
  const { loadCustomers, deleteCustomer } = useCustomers();
  const { customers } = useSelector((state) => state.customers);
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [cus, setCus] = useState(customers);
  const handleUsuariosChange = (newUsuarios) => {
    setCus([]);
    setFilteredCustomers(newUsuarios);
  };
  
  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (customers) {
      setCus(customers);
    }
  }, [customers]);

  return (
    <>
      <Grid marginX={"240px"}>
        <Titles name={<h2 align="center">Usuarios</h2>} />
        <Button
          variant="contained"
          disableElevation
          sx={{ color: "CC3C5C", my: 5, p: 2, borderRadius: 5 }}
          onClick={() => console.log("xs")}
        >
          Registrar nuevo usuario
        </Button>
        <InputSearch
          onUsuariosChange={handleUsuariosChange}
          customers={customers}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="center">Telefono</StyledTableCell>
                <StyledTableCell align="center">Correo</StyledTableCell>
                <StyledTableCell align="center">Opciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length != 0
                ? filteredCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell component="th" scope="row">
                        {customer.fullname}
                      </TableCell>
                      <TableCell align="center">
                        {customer?.phone?.phone_number || "N/A"}
                      </TableCell>
                      <TableCell align="center">{customer?.email}</TableCell>
                      <TableCell
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <WarningAlert
                          route={customer._id}
                          title="Estas seguro que deseas eliminar al usuario"
                          callbackToDeleteItem={() =>
                            deleteCustomer(customer._id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : cus.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell component="th" scope="row">
                        {customer.fullname}
                      </TableCell>
                      <TableCell align="center">
                        {customer?.phone?.phone_number || "N/A"}
                      </TableCell>
                      <TableCell align="center">{customer?.email}</TableCell>
                      <TableCell
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <WarningAlert
                          route={customer._id}
                          title="Estas seguro que deseas eliminar al usuario"
                          callbackToDeleteItem={() =>
                            deleteCustomer(customer._id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Box display="flex" justifyContent="center" py={10}>
        <Pagination count={10} color="primary" />
      </Box>
    </>
  );
};

export default Users;
