import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { CategoriesRepository } from '../../domain/category/CategoriesRepository';
import { Category } from '../../domain/category/Category';


export class CategoryUseCase {

    constructor(private readonly CategoriesRepository: CategoriesRepository) { }

    public async getCategories(): Promise<Category[] | ErrorHandler | null> {
        return await this.CategoriesRepository.getAllCategory();
    }

    public async getDetailCategory(_id: string): Promise<Category | ErrorHandler | null> {
        return await this.CategoriesRepository.getOneCategory(_id);
    }

    public async createNewCategory(name: String, description: String, status:Boolean): Promise<Category | ErrorHandler | null> {
        const category = await this.CategoriesRepository.createCategory({ name   });
        if (category) return new ErrorHandler('La categoria ya ha sido registrado',400);
      
        return await this.CategoriesRepository.createCategory({ name, description, status });
    }

    public async updateOneCategory(_id: string,updated: Category): Promise<Category | ErrorHandler | null> {
        return await this.CategoriesRepository.updateCategory(_id,updated);
    }
    public async deleteOneCategory(_id: string): Promise<Category | null> {
        return this.CategoriesRepository.deleteCategory(_id)
    }

}