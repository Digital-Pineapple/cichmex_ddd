import { response } from 'express';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { CategoriesRepository } from '../../domain/category/CategoriesRepository';
import { Category } from '../../domain/category/CategoryEntity'
import { SubCategoriesPopulateConfig } from '../../../shared/domain/PopulateInterfaces';
import mongoose from 'mongoose';


export class CategoryUseCase {

    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    public async getCategories(): Promise<Category[] | ErrorHandler | null> {
        return await this.categoriesRepository.findAll();
    }

    public async getCategoriesAndSubcategories(): Promise<Category[] | ErrorHandler | null> {
        return await this.categoriesRepository.findCategoriesAndSubCategories();
    }

    public async getDetailCategory(_id: string): Promise<Category | null> {
        return await this.categoriesRepository.findById(_id);
    }
    public async getDetailCategoryByName(name: string): Promise<Category | null> {
        return await this.categoriesRepository.findOneByName(name)
    }
    public async getSubCategoriesByCategory(_id: string): Promise<Category[] | null> {
        return this.categoriesRepository.findAll(_id)
    }

    public async createNewCategory(body: Category): Promise<Category | ErrorHandler | null> {
        const category = await this.categoriesRepository.findOneItem({ name: body.name, status: true });
        if (category) return new ErrorHandler(`La categoria con el nombre ${category.name} se encuentra en uso`, 400);
        return await this.categoriesRepository.createOne({ ...body });
    }

    public async updateOneCategory(_id: string, updated: Category): Promise<Category | ErrorHandler | null> {
        const category: any = await this.categoriesRepository.findOneItem({ name: updated.name, status: true })
        const objectID = new mongoose.Types.ObjectId(_id);
        if (category && !category?._id.equals(objectID)){
            return new ErrorHandler(`La categoria con el nombre ${category.name} se encuentra en uso`, 400);}
        return await this.categoriesRepository.updateOne(_id, updated);
    }
    public async deleteOneCategory(_id: string): Promise<Category | null> {
        return this.categoriesRepository.updateOne(_id, { status: false })
    }

    public async getCategoriesAndProducts(categoryNames: string[], storehouse: any): Promise<Category[] | ErrorHandler | null> {
        return await this.categoriesRepository.findCategoriesAndProducts(categoryNames, storehouse);
    }
    public async getProductsByCategory(category_id: any, storehouse: any): Promise<Category | ErrorHandler | null> {
        const response = await this.categoriesRepository.findProductsByCategory(category_id, storehouse);
        // console.log(response, 'response');

        return response
    }


}