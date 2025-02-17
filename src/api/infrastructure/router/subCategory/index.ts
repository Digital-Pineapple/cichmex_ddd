import { Router } from 'express';
import { SubCategoryRepository } from '../../repository/subCategory/SubCategoryRepository';
import SubCategoryModel from '../../models/SubCategoryModel';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase'
import { SubCategoryController } from '../../controllers/subCategory/SubCategoryController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { SubCategoryValidations } from '../../../../shared/infrastructure/validation/SubCategory/SubCategoryValidation';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const subCategoryRouter = Router();

const subCategoryRepository = new SubCategoryRepository(SubCategoryModel);
const subCategoryUseCase = new SubCategoryUseCase(subCategoryRepository);
const s3Service          = new S3Service();
const subCategoryValidations    = new SubCategoryValidations();
const subCategoryController = new SubCategoryController(subCategoryUseCase, s3Service);
const userValidations = new UserValidations();

subCategoryRouter
    .get('/', subCategoryController.getAllSubCategories)
    .get('/:id', subCategoryController.getSubCategory)
    .get('/detail/:id', subCategoryController.getDetailSubCategory)
    .get('/subCategory/:id', subCategoryController.findSubCategoriesByCategory)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]),subCategoryValidations.subCategoryPhotoValidation,ActivityLogger, subCategoryController.createSubCategory)
    .patch('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), subCategoryValidations.subCategoryPhotoValidation,ActivityLogger, subCategoryController.updateSubCategory)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]),ActivityLogger, subCategoryController.deleteSubCategory)
    // .get('/search/search', subCategoryController.searchSubCategory)


export default subCategoryRouter;

