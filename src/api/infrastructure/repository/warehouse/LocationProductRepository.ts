import { Model } from 'mongoose';
import { locationProductRepository as LocationProductConfig} from '../../../domain/warehouse/locationProductRepository';
import { MongoRepository } from '../MongoRepository';



export class LocationProductRepository extends MongoRepository implements LocationProductConfig {

    constructor(protected LocationProductModel: Model<any>) {
        super(LocationProductModel)
    }

}