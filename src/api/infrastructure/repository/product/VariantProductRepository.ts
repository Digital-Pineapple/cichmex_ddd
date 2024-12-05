import { VariantProductRepository as VariantConfig} from './../../../domain/product/VariantProductRepository';
import { Model, ObjectId as MongooseObjectId } from 'mongoose';

import { MongoRepository } from '../MongoRepository';
import { VariantProductEntity } from '../../../domain/product/ProductEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ObjectId } from 'mongodb';

export class VariantProductRepository extends MongoRepository implements VariantConfig  {
    private readonly onlineStoreHouse = "662fe69b9ba1d8b3cfcd3634";
    constructor(protected VariantProductModel: Model<any>) {
        super(VariantProductModel);
    }
    

    // async findProduct(query: Object): Promise<VariantProductEntity | null> {
    //     return await this.findOneItem(query);
    // }


}