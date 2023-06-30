import React, { useState } from "react";
import Titles from "../../components/ui/Titles";
import UploadImage from "../../components/ui/UploadImage";
import Grid from "@mui/material/Grid";
import { TextField, TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useServices } from "../../hooks/useServices";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm1 } from "../../hooks/useForm1";
import { editOneService } from "../../store/actions/servicesActions";

const Edit = () => {
  const { id } = useParams();
  const { loadService, service } = useServices();

  useEffect(() => {
    loadService(id);
  }, [id]);


  const { formulario, name, description, status, onChange } =  useForm1 ({
    name: service?.name || "",
    description: service?.description || "",
    status : service?.status 
  });



  const saveChanges = () => {
    event.preventDefault();
    editOneService({name,description,status})

  };

  return (
    <Box component='form'
    onSubmit={saveChanges}
    marginX={"10%"}>
      <Titles name={<h2 align="center">Editar servicio</h2>} />
      <Grid
        color="#F7BFBF"
        borderRadius={5}
        mt={3}
        sx={{ border: 10, p: 5 }}
        container
        spacing={4}

      >
        <Grid item>
          <UploadImage />
        </Grid>
        <Grid
          item
          sm={8}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <TextField
            focused
            fullWidth
            id="outlined-basic"
            label="Nombre del servicio"
            variant="outlined"
            value={name}
            sx={{margin:2}}
            onChange={({ target }) => onChange(target.value, "name")}
          />
          <Typography>Descipcion del servicio</Typography>
          <TextareaAutosize
          aria-label="minimum height"
            id="description"
            minRows={6}
            label="Descripcion"
            value={description}
            style={{width:'100%', fontFamily:'BikoBold', marginBottom:20}}
            onChange={({ target }) => onChange(target.value, "name")}
            />
       
<Grid container justifyContent={'center'}  justifyItems={'center'} alignItems={'center'} >
        <Grid display={'flex'} flexDirection={'column'} >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Estatus
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={status}

            >
              <Typography variant="h3" color="common.black">
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Activo"
                  onChange={({ target }) => onChange(target.value, "status")}
                  />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Desactivado"
                  onChange={({ target }) => onChange(target.value, "status")}
                  />
              </Typography>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item  sx={{ display: "flex", justifyContent: "center" }}>
          <Button type='submit' variant="contained">Guardar</Button>
        </Grid>
        </Grid>
                  </Grid>
      </Grid>
      <code>
        <pre>{JSON.stringify(formulario, null, 2)}</pre>
      </code>
    </Box>
  );
};

export default Edit;
