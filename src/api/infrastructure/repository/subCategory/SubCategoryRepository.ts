import { Model } from 'mongoose';
import { SubCategoriesRepository as SubCategoryConfig } from '../../../domain/subCategory/SubCategoriesRepository'

import { MongoRepository } from '../MongoRepository';
import { SubCategory } from '../../../domain/subCategory/SubCategoryEntity';


export class SubCategoryRepository extends MongoRepository implements SubCategoryConfig {
    

    constructor(protected SubCategoryModel: Model<any>) {
        super(SubCategoryModel);
    }

    async findOneSubCategory(query: Object): Promise<SubCategory | null> {
        return await this.findOneItem(query);
    }

    async findByIdSubCategory(_id: String): Promise<SubCategory | null> {
        return await this.findById(_id);
    }
    async findAndUpdateSubCategory(_id: String, updated: object): Promise<SubCategory | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllSubCategories(): Promise<SubCategory[] | null> {
        return await this.findAll();
    }

    async createOneSubCategory(body: Object): Promise<SubCategory | null> {
        return await this.createOne(body);
    }
    async searchSubCategory(body: Object): Promise<SubCategory| null> {
        return await this.createOne(body);
    }
   

}