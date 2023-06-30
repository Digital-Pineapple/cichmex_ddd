import { useDispatch, useSelector } from "react-redux";
import { clearErrorMessage, onLogin, onLogout } from "../store";
import { useNavigate } from "react-router-dom";
import { instanceApi } from "../apis/configAxios";
import Cookies from "js-cookie";

export const useAuthStore = () => {
  const { status, user, errorMessage, logged} = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const StartLogin = async({email, password}) =>{
      try {
          const { data } = await instanceApi.post('/auth/admin/login', {email: email, password:password})
          dispatch(onLogin(data.data.user));
          Cookies.set('session', data.data.token, { expires : 7 });
          navigate("/Principal", { replace: true });
      } catch (error) {
        console.log(error);
        dispatch(
          onLogout(
            error.response.data?.message || error.response.data.errors[0].message
          )
        );
        setTimeout(() => {
          dispatch(clearErrorMessage());
        }, 10);
      }
  }
  


  const RevalidateToken = async () => {
    try {
      const { data } = await instanceApi.get('/auth/admin/user')
      dispatch(onLogin(data.data.user))
      Cookies.set('session', data.data.token, { expires : 7 });
      
      // if (data.data.user.type_customer !== "3" ){
      //   navigate("/", {replace:true} )
      //   dispatch(onLogout(error.response.data?.message || error.response.data.errors[0].message))
      // } 

    } catch (error) {
      dispatch(onLogout());
      setTimeout(() => {
        onLogout(
          error.response.data?.message || error.response.data.errors[0].message
        )
      }, 10);
    }
  };


  const startLogout = () => {
    Cookies.remove('session')
    dispatch(onLogout());
  };

  return {
    //* Propiedades
    errorMessage,
    status,
    user,
    RevalidateToken,
    logged,
    startLogout,
    StartLogin
  };
};