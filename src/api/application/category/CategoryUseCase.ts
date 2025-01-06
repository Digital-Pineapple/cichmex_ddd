import { response } from 'express';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { CategoriesRepository } from '../../domain/category/CategoriesRepository';
import { Category } from '../../domain/category/CategoryEntity'
import { SubCategoriesPopulateConfig } from '../../../shared/domain/PopulateInterfaces';


export class CategoryUseCase {

    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    public async getCategories(): Promise<Category[] | ErrorHandler | null> {
        return await this.categoriesRepository.findAll();
    }

    public async getCategoriesAndSubcategories(): Promise<Category[] | ErrorHandler | null> {
        return await this.categoriesRepository.findCategoriesAndSubCategories();
    }

    public async getDetailCategory(_id: string): Promise<Category  | null> {
        return await this.categoriesRepository.findById(_id);
    }
    public async getDetailCategoryByName(name: string): Promise<Category  | null> {
        return await this.categoriesRepository.findOneByName(name)
    }
    public async getSubCategoriesByCategory(_id: string): Promise<Category[] | null> {
        return this.categoriesRepository.findAll(_id)
    }

    public async createNewCategory(name: string): Promise<Category | ErrorHandler | null> {
        const category = await this.categoriesRepository.findOneItem({name, status:true});
        if (category) return new ErrorHandler('La categoria se encuentra registrada',400);
        return await this.categoriesRepository.createOne({name});
    }

    public async updateOneCategory(_id: string,updated: Category): Promise<Category | null> {
        return await this.categoriesRepository.updateOne(_id,updated);
    }
    public async deleteOneCategory(_id: string): Promise<Category | null> {
        return this.categoriesRepository.updateOne(_id, {status: false})
    }

    public async getCategoriesAndProducts(categoryNames: string[], storehouse: any): Promise<Category[] | ErrorHandler | null> {
        return await this.categoriesRepository.findCategoriesAndProducts(categoryNames, storehouse);
    }
    public async getProductsByCategory(category_id: any, storehouse:any): Promise<Category | ErrorHandler | null> {
       const response =  await this.categoriesRepository.findProductsByCategory(category_id, storehouse);
    // console.log(response, 'response');
    
       return response
    }
    

}