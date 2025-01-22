import mongoose from 'mongoose';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { SubCategoriesRepository } from '../../domain/subCategory/SubCategoriesRepository';
import { SubCategory } from '../../domain/subCategory/SubCategoryEntity';


export class SubCategoryUseCase {
    protected path = '/sub-category'

    constructor(private readonly subCategoriesRepository: SubCategoriesRepository) { }

    public async getSubCategories(): Promise<SubCategory[] | ErrorHandler | null> {
        return await this.subCategoriesRepository.findAll();
    }
    public async getSubCtegoriesByCategoryId(category_id: string): Promise<SubCategory[] | null> {
        return this.subCategoriesRepository.findSubCategoriesByCategory(category_id)
    }


    public async getDetailSubCategory(_id: string): Promise<SubCategory | null> {
        return await this.subCategoriesRepository.findById(_id);
    }

    public async createNewSubCategory(body: SubCategory): Promise<SubCategory | ErrorHandler | null> {
        const subCategory = await this.subCategoriesRepository.findOneItem({ name: body.name, status: true });
        if (subCategory) return new ErrorHandler(`La categoria con el nombre: ${subCategory.name} se encuentra en uso`, 400);
        return await this.subCategoriesRepository.createOne({ ...body });
    }

    public async updateOneSubCategory(_id: string, updated: any): Promise<SubCategory> {
        const category: any = await this.subCategoriesRepository.findOneItem({ name: updated.name, status: true })
        const objectID = new mongoose.Types.ObjectId(_id);
        if (category && !category?._id.equals(objectID)) {
            return new ErrorHandler(`La categoria con el nombre ${category.name} se encuentra en uso`, 400);
        }
        return await this.subCategoriesRepository.updateOne(_id, updated);
    }
    public async deleteOneSubCategory(_id: string): Promise<SubCategory | null> {
        return this.subCategoriesRepository.updateOne(_id, { status: false })
    }
    public async getProductsBySubCategory(subcat_id: any, storehouse: any): Promise<SubCategory | null> {
        return await this.subCategoriesRepository.findProductsBySubCategory(subcat_id, storehouse);
    }
    public async getDetailSubCategoryByName(name: string): Promise<SubCategory | null> {
        return await this.subCategoriesRepository.findOneItem({ name });
    }
    public async getSubCategory(id: string): Promise<SubCategory | null> {
        return await this.subCategoriesRepository.getDetailSubCategory(id)
    }





}