import { useDispatch } from 'react-redux';
import { startLogin, startRevalidateToken } from '../store/actions/authActions';
import { stopLoading } from '../store/reducer/uiReducer';

export const useAuth = () => {

    const dispatch = useDispatch();

    const login = async(email,password) =>  await dispatch(startLogin(email,password));
    

    const revalidateToken = async () => {
        await dispatch(startRevalidateToken());
        dispatch(stopLoading());
    }

    return { login, revalidateToken }

}