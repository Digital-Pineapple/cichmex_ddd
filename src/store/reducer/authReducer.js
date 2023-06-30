import { createSlice } from '@reduxjs/toolkit'

export const userReducer = createSlice({
    name: 'auth',
    initialState: {
        user    : {},
        logged  : false,
    },
    reducers: {
        onLogin: (state,{ payload }) => {
            state.user   = payload;
            state.logged = true;
        },
        onLogout: ( state, { payload } ) => {
            state.user   = {};
            state.errorMessage = payload;
            state.logged = false;
        },
    },
})

export const { onLogin, onLogout } = userReducer.actions;

export default userReducer.reducer;