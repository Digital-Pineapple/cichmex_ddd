import { Model } from 'mongoose';

import { ShoppingCartRepository as ShoppingCartConfig } from '../../../domain/shoppingCart/shoppingCartRepository';
import { MongoRepository } from '../MongoRepository';

import { ServicesEntity } from '../../../domain/services/ServicesEntity';
import { ShoppingCartEntity } from '../../../domain/shoppingCart/shoppingCartEntity';

export class ShoppingCartRepository extends MongoRepository implements ShoppingCartConfig {

    constructor(protected ShoppingCartModel: Model<any>) {
        super(ShoppingCartModel)
    }

    async findOneShoppingCart(query: Object): Promise<ShoppingCartEntity | null> {
        return await this.findOneItem(query);
    }

    
}