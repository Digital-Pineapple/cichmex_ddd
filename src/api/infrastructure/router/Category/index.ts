import { Router } from 'express';
import { CategoryUseCase } from '../../../application/category/CategoryUseCase';
import { CategoryController } from '../../controllers/CategoryController/CategoryController'
import { CategoryRepository } from '../../repository/Category/CategoryRepository';
import CategoryModel from '../../models/CategoryModel';


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
    

export default categoryRouter;

