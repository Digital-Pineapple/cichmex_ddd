import { Router } from 'express';
import { CategoryUseCase } from '../../../application/category/CategoryUseCase';
import { CategoryRepository } from '../../repository/Category/CategoryRepository';
import CategoryModel from '../../models/CategoryModel';
import { CategoryController } from '../../controllers/category/CategoryController';


const categoryRouter = Router();

const categoryRepository    = new CategoryRepository(CategoryModel);
const categoryUseCase      = new CategoryUseCase(categoryRepository);
const categoryController   = new CategoryController(categoryUseCase);

categoryRouter
    .get('/', categoryController.getAllCategories)
    .get('/:id', categoryController.getCategory)
    .post('/', categoryController.createCategory)
    .patch('/:id', categoryController.updateCategory)
    .delete('/:id', categoryController.deleteCategory)
    .get('/search/search', categoryController.searchCategory)
    

export default categoryRouter;

