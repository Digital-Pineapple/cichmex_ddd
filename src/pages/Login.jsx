import {
  Button,
  Typography,
  Box,
  OutlinedInput,
  InputLabel,
  IconButton,
  InputAdornment,
  FormControl,
  Grid,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  BlockSharp,
  SendSharp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useAuth, useAuthStore } from "../hooks";
import Image from "mui-image";
import logo from "../assets/Images/logotipo.png";


import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";

export const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  
  const {login} = useAuth();

  // const { errorMessage, StartLogin } = useAuthStore();

  const {enqueueSnackbar} = useSnackbar()
  // useEffect(() => {
  //   if (errorMessage  !== undefined) {
  //     enqueueSnackbar('Error en el inicio de sesión' && errorMessage ,{variant:'error'})
  //   }
  // }, [errorMessage]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          className="GradientItem"
          container
          direction={{ xs: "column", sm:'row' }}
          minHeight={"100vh"}
          alignContent='center'
          justifyContent={'center'}

        >
          <Grid maxHeight={'600px'} item container xs={12} sm={5} xl={5}>
            <Image
              src={logo}
              fit="cover"
              duration={1000}
              style={{
                position: "static",
                minHeight: "40vh",
              }}
            />
          </Grid>
          <Grid
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit(login)}
            sx={{ backgroundColor: "white" }}
            borderRadius={"20px"}
            position="relative"
            zIndex={2}
            alignItems="center"
            justifyItems={'center'}
            width={{xs:'90%'}}
            margin={2}
            border={2}
            borderColor={'#E94C45'}
            boxShadow={8}
            padding={2}
            maxHeight={'500px'}
            item
            xs={12}
            sm={5}
            md={5}
          >
            <Typography
              fontSize={{ xs: 25, sm: 30, md: 35, lg: 34, xl: 40 }}
              color="#CC3C5C"
              align="center"
              alignContent={"center"}
            >
              Inicio de Sesión
            </Typography>
            {/* CORREO */}
            <FormControl sx={{ mt: 4 }} fullWidth required variant="outlined">
              <InputLabel>Correo</InputLabel>
              <OutlinedInput
                {...register("email", {
                  required: true,
                  pattern: { value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/ },
                })}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="mail"
                label="Correo"
              />
            </FormControl>

            {/* CONTRASEÑA */}
            <FormControl
              fullWidth
              required
              sx={{ mt: 2, mb: 2 }}
              variant="outlined"
            >
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                {...register("password", {
                  required: true,
                  minLength: 8,
                  // pattern: {
                  //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/,
                  // },
                })}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {/* {errors.password?.type === "pattern" && (
                <h5 color="red">
                  "Contraseña inválida:debe contener: Mayusculas,Minusculas,
                  Numeros y un caracter especial($%&)"
                </h5>
              )} */}
              {errors.password?.type === "minLength" && (
                <h5 color="red">
                  La contraseña debe tener minimo 8 carácteres
                </h5>
              )}
            </FormControl>
            <Divider variant="middle" />
            {/* ACTIVACION DE BOTON */}
            <Grid marginTop={2} container sx={{ justifyContent: "center" }}>
              {!password || !email ? (
                <Button
                  variant="outlined"
                  disabled
                  endIcon={<BlockSharp />}
                  style={{ borderRadius: "20px" }}
                  size="large"
                >
                  Iniciar sesión
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  type="submit"
                  endIcon={<SendSharp />}
                  style={{ borderRadius: "20px" }}
                >
                  Iniciar sesión
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};