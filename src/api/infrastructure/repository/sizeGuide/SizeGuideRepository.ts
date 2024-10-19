import { Model } from 'mongoose';
import { SizeGuideRepository as SizeGuideConfig } from '../../../domain/sizeGuide/SizeGuideRepository';
import { MongoRepository } from '../MongoRepository';

export class SizeGuideRepository extends MongoRepository implements SizeGuideConfig {

    constructor(protected SizeGuideModel: Model<any>) {
        super(SizeGuideModel);
    }

    
}
