import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { variantProductRepository as VariantProductConfig } from '../../../domain/variantProduct/variantProductRepository';
import { VariantProductEntity } from '../../../domain/variantProduct/variantProductEntity';
export class VariantProductRepository extends MongoRepository implements VariantProductConfig {

    constructor(protected VariantProductModel: Model<any>) {
        super(VariantProductModel);
    }
    
    public async findVariantsByProduct(body: any): Promise<VariantProductEntity[] | null> {
        const product = await this.VariantProductModel.find({...body})
        .select('-createdAt -updatedAt  -attributes.createdAt -attributes.updatedAt -attributes._id') // Excluye en el documento y en el subdocumento
        .exec();
        return product
            
            // .exec();
    }
    
}