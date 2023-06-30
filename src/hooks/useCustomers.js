
import { useSelector, useDispatch } from 'react-redux';

import { deleteOneCustomer, getOneCustomer, startLoadCustomers,verifyOneCustomer } from '../store/actions/customerActions'; 

export const useCustomers = () => {
    
    const dispatch = useDispatch();

    const { customer, customers } = useSelector(state => state.customers)

    const loadCustomers = async () => await dispatch(startLoadCustomers());

    const loadCustomer = async customer_id => await dispatch(getOneCustomer(customer_id));

    const deleteCustomer = async customer_id => await dispatch(deleteOneCustomer(customer_id));

    const verifyCustomer = async (customer_id, accountVerify) => await dispatch(verifyOneCustomer(customer_id, accountVerify));

    return { loadCustomers, customer, loadCustomer, customers, deleteCustomer,verifyCustomer }


}