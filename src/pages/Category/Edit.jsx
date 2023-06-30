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
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useFormik } from "formik";

const Edit = () => {
  const { id } = useParams();
  const { loadCategory, category } = useCategories();

  useEffect(() => {
    loadCategory(id);
  }, []);

  useEffect(() => {
    formik.setValues({
      name: category.name,
      description: category.description,
      status: category.status,
    });
  }, [category]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: "",
    },
    onSubmit: (values) => {
      
     console.log(values);

    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} marginX={"10%"}>
      <Titles name={<h2 align="center">Editar Categoria</h2>} />
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
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <TextField
            focused
            fullWidth
            id="name"
            name="name"
            label="Nombre del servicio"
            variant="outlined"
            value={formik.values.name}
            sx={{ margin: 2 }}
            onChange={formik.handleChange}
          />
          <Typography>Descipcion de la categoría</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            id="description"
            name="description"
            minRows={6}
            label="Descripcion"
            value={formik.values.description}
            style={{ width: "100%", fontFamily: "BikoBold", marginBottom: 20 }}
            onChange={formik.handleChange}
          />

          <Grid
            container
            justifyContent={"center"}
            justifyItems={"center"}
            alignItems={"center"}
          >
            <Grid display="flex" flexDirection="column">
              <FormControl>
                <FormLabel id="status-label">Estatus</FormLabel>
                <RadioGroup
                  aria-labelledby="status-label"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Activo"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Desactivado"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Button type="submit" variant="contained">
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <code>
        <pre>{JSON.stringify(formulario, null, 2)}</pre>
      </code> */}
    </Box>
  );
};

export default Edit;
