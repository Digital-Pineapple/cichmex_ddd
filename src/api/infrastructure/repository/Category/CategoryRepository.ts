import { Model } from 'mongoose';
import { CategoriesRepository as CategoryConfig } from '../../../domain/category/CategoriesRepository'

import { MongoRepository } from '../MongoRepository';
import { Category } from '../../../domain/category/Category';
import CategoryModel from '../../models/CategoryModel';


export class CategoryRepository extends MongoRepository implements CategoryConfig {
    

    async getAllCategory(): Promise<Category[] | null> {
        return await CategoryModel.find();
    }
    async getOneCategory(_id: string): Promise<Category | null> {
        return await CategoryModel.findById(_id);
    }
    async createCategory(body: object): Promise<Category | null> {
        const typeCar = new CategoryModel(body);
        return await typeCar.save();
    }
    async updateCategory(_id: string, update: Category): Promise<Category | null> {
        return await CategoryModel.findByIdAndUpdate(_id, update);
    }
    async deleteCategory(_id: string): Promise<Category | null> {
        return await CategoryModel.findByIdAndUpdate(_id, { status: false });
    }
   

}