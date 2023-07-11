import { Router } from 'express';
import { SubCategoryRepository } from '../../repository/subCategory/SubCategoryRepository';
import SubCategoryModel from '../../models/SubCategoryModel';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase'
import { SubCategoryController } from '../../controllers/subCategory/SubCategoryController';

const subCategoryRouter = Router();

const subCategoryRepository = new SubCategoryRepository(SubCategoryModel);
const subCategoryUseCase = new SubCategoryUseCase(subCategoryRepository);
const subcategoryController = new SubCategoryController(subCategoryUseCase);

subCategoryRouter
    .get('/', subcategoryController.getAllSubCategories)
    .get('/:id', subcategoryController.getSubCategory)
    .post('/', subcategoryController.createSubCategory)
    .patch('/:id', subcategoryController.updateSubCategory)
    .delete('/:id', subcategoryController.deleteSubCategory)
    .get('/search/search', subcategoryController.searchSubCategory)


export default subCategoryRouter;

