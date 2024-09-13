import { Model } from 'mongoose';
import { RegionRepository as RegionConfig } from '../../../domain/regions/RegionRepository';
import { MongoRepository } from '../MongoRepository';

export class RegionRepository extends MongoRepository implements RegionConfig {

    constructor(protected RegionModel: Model<any>) {
        super(RegionModel)
       
    }
}