import axios from "axios";
import Cookies from "js-cookie";
import { instanceApi } from "../../apis/configAxios";
import { enqueueSnackbar } from "notistack";
import { onLogin } from '../reducer/authReducer'

export const startLogin = ({ email, password }) => async (dispatch) => {
  try {
    const { data } = await instanceApi.post("/auth/admin/login", {
      email,
      password,
    });
    console.log(email,password);
    dispatch(onLogin(data.data.user));
    Cookies.set("session", data.data.token, { expires: 7 });
    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      enqueueSnackbar(
        "Error en el inicio de sesión" && error.response.data.message,
        { variant: "error" }
      );
      return {
        success: false,
      };
    }
    return {
      success: false,
    };
  }
};

export const startRevalidateToken = () => async (dispatch) => {
  try {
    const { data } = await instanceApi.get("/auth/admin/user");
    dispatch(onLogin(data.data.user));
    Cookies.set("session", data.data.token, { expires: 7 });
  } catch (error) {
    console.log(error);
  }
};
