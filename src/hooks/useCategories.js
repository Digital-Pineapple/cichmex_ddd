import { useSelector, useDispatch } from 'react-redux';

import { startLoadCategories, getOneCategory, deleteOneCategory, editOneCategory  } from '../store/actions/categotyActions'; 

export const useCategories = () => {
    
    const dispatch = useDispatch();

    const { categories, category } = useSelector(state => state.categories)

    const loadCategories = async () => await dispatch(startLoadCategories());

    const loadCategory = async category_id => await dispatch(getOneCategory(category_id));

    const deleteCategory = async category_id => await dispatch(deleteOneCategory(category_id));

    const editCategory = async (category_id, values) => await dispatch(editOneCategory(category_id, values));

    return { categories, category, loadCategories, loadCategory, deleteCategory, editCategory }


}