import { Satellite } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit'

export const servicesReducer = createSlice({
    name: 'services',
    initialState: {
        services: [],
        service: {},
    },
    reducers: {
        loadServices: (state, { type, payload }) => {
            state.services = payload;
        },
        loadService: (state, { type, payload }) => {
            state.service = payload;
        },
        deleteService: (state, { type, payload }) => {
            state.services = state.services.filter(service => service._id !== payload);
        },
        editService: (state, { type, payload }) => {
            state.services = state.services.filter(service => service._id !== payload);
        }
    },
})

export const { loadServices, loadService, deleteService, editService } = servicesReducer.actions;

export default servicesReducer.reducer;