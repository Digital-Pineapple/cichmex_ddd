import { createSlice } from '@reduxjs/toolkit'

export const customerReducer = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    customer: {}
  },
  reducers: {
    loadCustomers: (state, action) => {
      state.customers = action.payload;
    },
    loadCustomer: (state, { type, payload }) => {
      state.customer = payload;
    },
    deleteCustomer: (state, { type, payload }) => {
      state.customers = state.customers.filter(customer => customer._id !== payload);
    },
    verifyOneCustomer: (state, { type, payload }) => {
      state.customers = state.customers.filter(customer => customer._id !== payload);
    }
    
    
  },
})

export const { loadCustomers, loadCustomer, deleteCustomer,verifyOneCustomer} = customerReducer.actions;

export default customerReducer.reducer;