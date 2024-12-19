import { Model } from 'mongoose';
import { ColorProductRepository as ColorProductConfig } from '../../../domain/colorProduct/ColorProductRepository'
import { MongoRepository } from '../MongoRepository';



export class ColorProductRepository extends MongoRepository implements ColorProductConfig {
    

    constructor(protected ColorProductConfig: Model<any>) {
        super(ColorProductConfig);
    }

   

}