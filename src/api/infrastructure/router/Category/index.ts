import { Router } from 'express';
import { CategoryUseCase } from '../../../application/category/CategoryUseCase';
import { CategoryRepository } from '../../repository/Category/CategoryRepository';
import CategoryModel from '../../models/CategoryModel';
import { CategoryController } from '../../controllers/category/CategoryController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';


const categoryRouter = Router();

const categoryRepository    = new CategoryRepository(CategoryModel);
const categoryUseCase      = new CategoryUseCase(categoryRepository);
const s3Service          = new S3Service();
const categoryController   = new CategoryController(categoryUseCase, s3Service);

categoryRouter
    .get('/', categoryController.getAllCategories)
    .get('/:id', categoryController.getCategory)
    .post('/', categoryController.createCategory)
    .post('/:id', categoryController.updateCategory)
    .delete('/:id', categoryController.deleteCategory)
    .get('/search/search', categoryController.searchCategory)
    

export default categoryRouter;

