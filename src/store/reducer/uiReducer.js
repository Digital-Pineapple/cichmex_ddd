import { createSlice } from '@reduxjs/toolkit'

export const uiReducer = createSlice({
  name: 'ui',
  initialState: {
    loading: true,
  },
  reducers: {
    startLoading: (state) => {
       state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    }
  },
})

export const { startLoading, stopLoading } = uiReducer.actions;

export default uiReducer.reducer;