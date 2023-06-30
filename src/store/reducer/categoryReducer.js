import { createSlice } from '@reduxjs/toolkit'

export const categoryReducer = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    category: {}
  },
  reducers: {
    loadCategories: (state, action) => {
      state.categories = action.payload;
    },
    loadCategory: (state, { type, payload }) => {
      state.category = payload;
    },
    deleteCategory: (state, { type, payload }) => {
      state.categories = state.categories.filter(category => category._id !== payload);
    },
    editCategory: (state, { type, payload }) => {
    state.categories = payload;
    }
  },
})

export const { loadCategories, loadCategory, deleteCategory, editCategory} = categoryReducer.actions;

export default categoryReducer.reducer;