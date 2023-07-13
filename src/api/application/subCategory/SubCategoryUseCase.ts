import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { SubCategoriesRepository } from '../../domain/subCategory/SubCategoriesRepository';
import { category, SubCategory } from '../../domain/subCategory/SubCategoryEntity';


export class SubCategoryUseCase {

    constructor(private readonly subCategoriesRepository: SubCategoriesRepository) { }

    public async getSubCategories(): Promise<SubCategory[] | ErrorHandler | null> {
        return await this.subCategoriesRepository.findAll();
    }

    public async getDetailSubCategory(_id: string): Promise<SubCategory | ErrorHandler | null> {
        return await this.subCategoriesRepository.findById(_id);
    }

    public async createNewSubCategory(name: string, description: string, status: boolean, category:category): Promise<SubCategory | ErrorHandler | null> {
        const subCategory = await this.subCategoriesRepository.findOneItem({name});
        if (subCategory) return new ErrorHandler('La categoria ya ha sido registrado',400);
        return await this.subCategoriesRepository.createOne({ name, description, status, category });
    }

    public async updateOneSubCategory(_id: string,updated: SubCategory): Promise<SubCategory | ErrorHandler | null> {
        return await this.subCategoriesRepository.updateOne(_id,updated);
    }
    public async deleteOneSubCategory(_id: string): Promise<SubCategory | null> {
        return this.subCategoriesRepository.updateOne(_id, {status: false})
    }
    public async searchSubCategory(search: string | ParsedQs | string[] | ParsedQs[] | undefined): Promise<SubCategory | null> {
        return this.subCategoriesRepository.search(search)
    }

}