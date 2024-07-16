import { Model } from 'mongoose';
import { ShippingCostRepository as ShippingCostConfig } from '../../../domain/shippingCost/ShippingCostRepository';
import { MongoRepository } from '../MongoRepository';
import { ShippingCostEntity } from '../../../domain/shippingCost/ShippingCostEntity';

export class ShippingCostRepository extends MongoRepository implements ShippingCostConfig {

    constructor(protected ShippingCostModel: Model<any>) {
        super(ShippingCostModel);
    }

    async findShippingCostByWeight(weight: any): Promise<ShippingCostEntity | null> {
        try {
            const result = await this.ShippingCostModel.findOne({
                $and: [
                    { "starting_weight": { $lte: weight } },
                    { "end_weight": { $gte: weight } },
                    { "status": { $eq: true } }
                ]
            }).exec();
            
            return result ? result.toObject() : null; // Convertir a objeto si hay resultado
        } catch (error) {
            console.error('Error in findShippingCostByWeight:', error);
            return null; // Manejar errores adecuadamente según tu aplicación
        }
    }
}
