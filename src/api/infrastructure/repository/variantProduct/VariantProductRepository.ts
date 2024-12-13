import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { variantProductRepository as VariantProductConfig } from '../../../domain/variantProduct/variantProductRepository';
export class VariantProductRepository extends MongoRepository implements VariantProductConfig {

    constructor(protected VariantProductModel: Model<any>) {
        super(VariantProductModel);
    }
    
   
}