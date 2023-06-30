import { instanceApi } from "../../apis/configAxios"
import { loadCustomers, loadCustomer, deleteCustomer } from "../reducer/customerReducer"

export const startLoadCustomers = () => {
    return async (dispatch) => {
        try {
            const { data } = await instanceApi.get('/customer')
            dispatch(loadCustomers(data.data))
        } catch (error) {
            console.log(error)
        }
    }
}

export const getOneCustomer = (customer_id) =>
    async dispatch => {
        try {
            const { data } = await instanceApi.get(`/customer/${customer_id}`)
            dispatch(loadCustomer(data.data));
        } catch (error) {
            console.log(error);
        }
    }

export const deleteOneCustomer = (customer_id) =>
    async dispatch => {
        try {
            await instanceApi.delete(`/customer/${customer_id}`)
            dispatch(deleteCustomer(customer_id));
        } catch (error) {
            console.log(error);
        }
    }
export const verifyOneCustomer = (customer_id, accountVerify) =>{
    return console.log(customer_id, accountVerify);
    async dispatch => {
        try {
            
            await instanceApi.post(`/customer/${customer_id}`, accountVerify)
            dispatch(startLoadCustomers());
        } catch (error) {
            console.log(error);
        }
}

    
    }

    