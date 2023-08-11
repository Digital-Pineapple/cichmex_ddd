import { Model } from 'mongoose';
import { TypeCarRepository as TypeCarConfig} from '../../../domain/typeCar/TypeCarRepository';
import { MongoRepository } from '../MongoRepository';
import { TypeCarEntity } from '../../../domain/typeCar/TypeCarEntity';



export class TypeCarRepository extends MongoRepository implements TypeCarConfig {

    constructor(protected ServiceModel: Model<any>) {
        super(ServiceModel)
    }


    async getAllTypeCars(): Promise<TypeCarEntity[] | null> {
        return await this.findAll();
    }
    async getOneTypeCar(_id: string): Promise<TypeCarEntity | null> {
        return await this.findById(_id);
    }
    async createTypeCar(body: object): Promise<TypeCarEntity | null> {
        return await this.createOne(body);
    }
    async updateOneTypeCar(_id: string, updated : TypeCarEntity): Promise<TypeCarEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async deleteOneTypeCar(_id: string): Promise<TypeCarEntity | null> {
        return await this.findAndUpdateTypeCar(_id, { status: false });
    }
    async findAndUpdateTypeCar(_id: String, updated: object): Promise<TypeCarEntity | null> {
        return await this.updateOne(_id, updated);
    }
}