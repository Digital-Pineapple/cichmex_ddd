import { Router } from 'express';
import { SubCategoryRepository } from '../../repository/subCategory/SubCategoryRepository';
import SubCategoryModel from '../../models/SubCategoryModel';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase'
import { SubCategoryController } from '../../controllers/subCategory/SubCategoryController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { SubCategoryValidations } from '../../../../shared/infrastructure/validation/SubCategory/SubCategoryValidation';

const subCategoryRouter = Router();

const subCategoryRepository = new SubCategoryRepository(SubCategoryModel);
const subCategoryUseCase = new SubCategoryUseCase(subCategoryRepository);
const s3Service          = new S3Service();
const subCategoryValidations    = new SubCategoryValidations();
const subCategoryController = new SubCategoryController(subCategoryUseCase, s3Service);

subCategoryRouter
    .get('/', subCategoryController.getAllSubCategories)
    .get('/:id', subCategoryController.getSubCategory)
    .get('/subCategory/:id', subCategoryController.findSubCategoriesByCategory)
    .post('/', subCategoryController.createSubCategory)
    .post('/:id', subCategoryValidations.subCategoryPhotoValidation, subCategoryController.updateSubCategory)
    .delete('/:id', subCategoryController.deleteSubCategory)
    .get('/search/search', subCategoryController.searchSubCategory)


export default subCategoryRouter;

