import { Model } from 'mongoose';
import { ProductOrderRepository as ProductOrderConfig } from '../../../domain/product/ProductOrderRepository'
import { MongoRepository } from '../MongoRepository';
import {  ProductOrderEntity } from '../../../domain/product/ProductEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';


export class ProductOrderRepository extends MongoRepository implements ProductOrderConfig  {

    constructor(protected ProductOrderModel: Model<any>) {
        super(ProductOrderModel);
    }

    async findOrderProduct(query: Object): Promise<ProductOrderEntity | ErrorHandler | null> {
        return await this.findOneItem(query);
    }

    async findAllProductOrders(populateConfig1?:any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.MODEL.find({}).populate(populateConfig1).sort({ createdAt: -1 })
    }

     async getProductOrdersByUser( _id: string, populateConfig1?:any): Promise<ProductOrderEntity[] | ErrorHandler| null > {
        return await this.MODEL.find({user_id:_id}).populate(populateConfig1).sort({ createdAt: -1 })
        
      }

}