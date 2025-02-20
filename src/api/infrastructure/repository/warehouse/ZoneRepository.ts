import { Model } from 'mongoose';
import { zoneRepository as ZoneConfig} from '../../../domain/warehouse/zoneRepository';
import { MongoRepository } from '../MongoRepository';



export class ZoneRepository extends MongoRepository implements ZoneConfig {

    constructor(protected ZoneModel: Model<any>) {
        super(ZoneModel)
    }

}