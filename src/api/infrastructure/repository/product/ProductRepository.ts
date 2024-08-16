import { Model } from 'mongoose';
import { ProductRepository as ProductConfig } from '../../../domain/product/ProductRepository'
import { MongoRepository } from '../MongoRepository';
import { ProductEntity } from '../../../domain/product/ProductEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';


export class ProductRepository extends MongoRepository implements ProductConfig  {

    constructor(protected ProductModel: Model<any>) {
        super(ProductModel);
    }

    async findProduct(query: Object): Promise<ProductEntity | null> {
        return await this.findOneItem(query);
    }

    async findAndUpdateProduct(_id: String, updated: object): Promise<ProductEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async AllProducts(): Promise<ProductEntity[] | null> {
        return await this.findAll();
    }

    async createProduct(body: Object): Promise<ProductEntity | null> {
        return await this.createOne(body);
    }
    async updateImagesAndSlug(slug: string, images:[string], _id: string): Promise<ProductEntity | null > {
        return await this.findAndUpdateProduct(_id,{images:images, slug:slug})
    }
    
    async getProductsByCategory(query:any, populateConfig1?:any): Promise<ProductEntity[] | ErrorHandler | null > {
        return await this.MODEL.find({...query}).populate(populateConfig1)
    }
    
   async  findDetailProductById(id:string, populateCofig1?:any, populateConfig2?:any, populateConfig3?:any): Promise<ProductEntity| ErrorHandler | null> {
    return await this.MODEL.findById(id).populate(populateCofig1).populate(populateConfig2).populate(populateConfig3)
    // return await this.MODEL.aggregate([
        
    // ]).
   }

   async findVideoProducts(): Promise<ProductEntity[] | ErrorHandler | null> {
    const result = await this.MODEL.aggregate([
        {$match: {
            status: true,
            videos: { $exists: true, $ne: [] } // Asegura que el campo "video" exista y no sea nulo
        }},
        {$limit: 10}
    ])    
    return result
   }

}