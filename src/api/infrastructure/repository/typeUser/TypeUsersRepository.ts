import { Model } from 'mongoose';
import { TypeUserRepository as TypeUserConfig} from '../../../domain/typeUser/TypeUserRepository';
import { MongoRepository } from '../MongoRepository';
import { TypeUserEntity } from '../../../domain/typeUser/TypeUserEntity';



export class TypeUsersRepository extends MongoRepository implements TypeUserConfig {

    constructor(protected UserModel: Model<any>) {
        super(UserModel)
    }


    async getAllTypeCars(): Promise<TypeUserEntity[] | null> {
        return await this.findAll();
    }
    async getOneTypeCar(_id: string): Promise<TypeUserEntity | null> {
        return await this.findById(_id);
    }
    async createTypeCar(body: object): Promise<TypeUserEntity | null> {
        return await this.createOne(body);
    }
    async updateOneTypeCar(_id: string, updated : TypeUserEntity): Promise<TypeUserEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async deleteOneTypeCar(_id: string): Promise<TypeUserEntity | null> {
        return await this.findAndUpdateTypeCar(_id, { deleted: false });
    }
    async findAndUpdateTypeCar(_id: String, updated: object): Promise<TypeUserEntity | null> {
        return await this.updateOne(_id, updated);
    }
}