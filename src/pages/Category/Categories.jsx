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
import { styled } from "@mui/system";
import { Box, Grid } from "@mui/material";
import { Pagination } from "antd";
import InputSearch from "../../components/ui/InputSearch";
import { useSelector } from "react-redux";
import { useCategories } from "../../hooks/useCategories";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CC3C5C",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Categories = () => {

  const { loadCategories,deleteCategory} = useCategories();
  const { categories } = useSelector((state) => state.categories);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [cat, setCat] = useState(categories);
    const handleCategoriesChange = (newCategories) => {
    setCat([]);
    setFilteredCategories(newCategories);
  };
  
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories) {
      setCat(categories);
    }
  }, [categories]);

  return (
    <>
      <Grid marginX={"240px"}>
        <Titles name={<h2 align="center">Categorias</h2>} />
        <Button
          variant="contained"
          disableElevation
          sx={{ color: "CC3C5C", my: 5, p: 2, borderRadius: 5 }}
          onClick={() => console.log("xs")}
        >
          Registrar nueva categoria
        </Button>
        <InputSearch
          onCategoriesChange={handleCategoriesChange}
          categories={categories}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="center">Descripcion</StyledTableCell>
                <StyledTableCell align="center">Opciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length != 0
                ? filteredCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell component="th" scope="row">
                        {category.name}
                      </TableCell>
                      <TableCell align="center">{category?.description}</TableCell>
                      <TableCell
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <WarningAlert
                          route={category._id}
                          title="Estas seguro que deseas eliminar al usuario"
                          callbackToDeleteItem={() =>
                            deleteCategory(category._id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : cat.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell component="th" scope="row">
                        {category.name}
                      </TableCell>
                      <TableCell align="center">{category?.description}</TableCell>
                      <TableCell
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <WarningAlert
                          route={category._id}
                          title="¿Estas seguro que deseas eliminar a la categoria?"
                          callbackToDeleteItem={() =>
                            deleteCategory(category._id)
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

export default Categories;
