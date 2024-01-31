import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { SubCategoriesRepository } from '../../domain/subCategory/SubCategoriesRepository';
import { SubCategory } from '../../domain/subCategory/SubCategoryEntity';


export class SubCategoryUseCase {
    protected path = '/sub-category'

    constructor(private readonly subCategoriesRepository: SubCategoriesRepository) { }

    public async getSubCategories(): Promise<SubCategory[] | ErrorHandler | null> {
        return await this.subCategoriesRepository.findAll();
    }
    public async getSubCtegoriesByCategoryId(category_id: string): Promise< SubCategory[] | null > {
        return this.subCategoriesRepository.findSubCategoriesByCategory(category_id)
    }
    

    public async getDetailSubCategory(_id: string): Promise<SubCategory | null> {
        return await this.subCategoriesRepository.findById(_id);
    }

    public async createNewSubCategory(name: string, category_id:any): Promise<SubCategory | ErrorHandler | null> {
        const subCategory = await this.subCategoriesRepository.findOneItem({name});
        if (subCategory) return new ErrorHandler('La categoria ya ha sido registrado',400);
        return await this.subCategoriesRepository.createOne({ name, category_id });
    }

    public async updateOneSubCategory(_id: string,updated: SubCategory): Promise<SubCategory> {
        return await this.subCategoriesRepository.updateOne(_id,updated);
    }
    public async deleteOneSubCategory(_id: string): Promise<SubCategory | null> {
        return this.subCategoriesRepository.updateOne(_id, {status: false})
    }
    


}