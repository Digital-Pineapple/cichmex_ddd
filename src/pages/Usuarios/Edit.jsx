import { useEffect, useState } from "react";
import Titles from "../../components/ui/Titles";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useCustomers } from "../../hooks/useCustomers";
import ModalDocuments from "../../components/CheckDocument/ModalDocuments";
import CheckList from "../../components/CheckDocument/CheckList";
import Image from "mui-image";

const Edit = () => {
  const { id } = useParams();
  const { loadCustomer, customer } = useCustomers();

  useEffect(() => {
    loadCustomer(id);
  }, [id]);
console.log(customer);

  return (
    <>
      <Titles name={<h2 align="center">Editar usuario</h2>} />
      <Box
        marginX={"10%"}
        color="#F7BFBF"
        borderRadius={5}
        mt={3}
        sx={{ border: 3, p: 5 }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            backgroundColor="#1F6580"
            color="common.black"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Typography variant="h5">Datos Generales</Typography>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Image
              width={"200px"}
              style={{ borderRadius: 100 }}
              src={customer?.profile_image || ''}
            />
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <TextField
              aria-readonly
              focused
              id="outlined-basic"
              label="Nombre"
              variant="filled"
              fullWidth
              value={customer?.fullname}
            />
            <Grid item sx={{ display: "flex", py: 2 }}>
              <TextField
                focused
                id="outlined-basic"
                label="Telefono"
                variant="filled"
                fullWidth
                sx={{ pr: 2 }}
                value={customer?.phone?.phone_number || "NA"}
              />
              <TextField
                focused
                id="outlined-basic"
                label="Correo"
                variant="filled"
                fullWidth
                value={customer?.email}
              />
            </Grid>
          </Grid>
          {/* <Grid item xs={12} backgroundColor="#CCC550" color="common.black" sx={{ display: 'flex',justifyContent: 'center' }}>
            <Typography variant='h5' align='center'>Dirección</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField focused  id="outlined-basic" label="Calle" variant='filled'fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField focused  id="outlined-basic" label="Numero interior" variant='filled'fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField focused  id="outlined-basic" label="Numero exterior" variant='filled' fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField focused  id="outlined-basic" label="Codigo postal" variant='filled' fullWidth />
          </Grid>
          <Grid item xs={4}>
            <TextField focused  id="outlined-basic" label="Colonia" variant='filled' fullWidth />
          </Grid>
          <Grid item xs={4}>
            <TextField focused  id="outlined-basic" label="Municipio" variant='filled' fullWidth />
          </Grid>
          <Grid item xs={4}>
            <TextField focused  id="outlined-basic" label="Ciudad" variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12} backgroundColor="#D7B3C6" color="common.black" sx={{ display: 'flex',justifyContent: 'center',mt: 2 }}>
            
            <Typography  variant='h5' align='center'>Documentos</Typography>
          </Grid> */}

          <Grid container direction="row">
            <Grid display="flex" width="50%" flexDirection="column" gap={2}>
              <ModalDocuments
                name={"Identificacion Oficial"}
                pdfPath={customer?.ine}
              />
              <ModalDocuments
                name={"Comprobante de Domicilio"}
                pdfPath={customer?.prook_address}
              />
              <ModalDocuments
                name={"Antecedentes Penales"}
                pdfPath={customer?.criminal_record}
              />
              <ModalDocuments name={"Curp"} pdfPath={customer?.curp} />
            </Grid>
            <Grid>
              <CheckList />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Edit;
