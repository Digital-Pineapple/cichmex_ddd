import { Model } from 'mongoose';
import { CategoriesRepository as CategoryConfig } from '../../../domain/category/CategoriesRepository'

import { MongoRepository } from '../MongoRepository';
import { Category } from '../../../domain/category/CategoryEntity';


export class CategoryRepository extends MongoRepository implements CategoryConfig {
    

    constructor(protected CategoryModel: Model<any>) {
        super(CategoryModel);
    }

    async findOneCategory(query: Object): Promise<Category | null> {
        return await this.findOneItem(query);
    }

    async findByEmailCategory(email: String): Promise<Category | null> {
        return await this.findOneItem({ email });
    }

    async findByIdCategory(_id: String): Promise<Category | null> {
        return await this.findById(_id);
    }
    async findAndUpdateCategory(_id: String, updated: object): Promise<Category | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllCategorys(): Promise<Category[] | null> {
        return await this.findAll();
    }

    async createOneCategory(body: Object): Promise<Category | null> {
        return await this.createOne(body);
    }
    async searchCategory(body: Object): Promise<Category| null> {
        return await this.createOne(body);
    }
   

}