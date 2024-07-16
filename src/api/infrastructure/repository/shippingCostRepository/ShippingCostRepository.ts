import { Model } from 'mongoose';

import { ShippingCostRepository as ShippingCostConfig } from '../../../domain/shippingCost/ShippingCostRepository';
import { MongoRepository } from '../MongoRepository';


export class ShippingCostRepository extends MongoRepository implements ShippingCostConfig {

    constructor(protected ShoppingCartModel: Model<any>) {
        super(ShoppingCartModel)
    }

    
}