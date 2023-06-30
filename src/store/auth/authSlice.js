import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking',
        user: {},
        errorMessage: undefined,
        logged: false,

    },
    reducers: {
        onChecking: ( state ) =>{
        state.status = 'checking';
        state.user = {};
        state.errorMessage = undefined;
        },
        onLogin: ( state, { payload } ) =>{
        state.status = 'authenticated';
        state.user = payload;
        state.errorMessage= undefined
        state.logged = true
        },
        onLogout: ( state, { payload } ) => {
            state.status = 'not-authenticated';
            state.user   = {};
            state.errorMessage = payload;
            state.logged = false;
        },
        clearErrorMessage: ( state ) => {
            state.errorMessage = undefined;
        }
    },
});
export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;

export default authSlice.reducer;