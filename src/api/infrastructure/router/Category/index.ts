import { Router } from 'express';
import { CategoryUseCase } from '../../../application/category/CategoryUseCase';
import { CategoryRepository } from '../../repository/Category/CategoryRepository';
import CategoryModel from '../../models/CategoryModel';
import { CategoryController } from '../../controllers/category/CategoryController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { CategoryValidations } from '../../../../shared/infrastructure/validation/Category/CategoryValidation';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { SubCategoryRepository } from '../../repository/subCategory/SubCategoryRepository';
import SubCategoryModel from '../../models/SubCategoryModel';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase';


const categoryRouter = Router();

const categoryRepository    = new CategoryRepository(CategoryModel);
const subCategoryRepository    = new SubCategoryRepository(SubCategoryModel);

const categoryUseCase      = new CategoryUseCase(categoryRepository);
const subCategoryUseCase      = new SubCategoryUseCase(subCategoryRepository);

const s3Service          = new S3Service();
const categoryValidations    = new CategoryValidations();
const categoryController   = new CategoryController(categoryUseCase, s3Service);
const userValidations = new UserValidations();

categoryRouter
    .get('/', categoryController.getAllCategories)
    .get('/SC', categoryController.getAllCategoriesAndSC)
    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), categoryController.getCategory)
    .post('/',categoryValidations.categoryPhotoValidation, userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), categoryController.createCategory)
    .patch('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), categoryValidations.categoryPhotoValidation, categoryController.updateCategory)
    .delete('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), categoryController.deleteCategory)
    .get('/search/search', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), categoryController.searchCategory)
    

export default categoryRouter;

