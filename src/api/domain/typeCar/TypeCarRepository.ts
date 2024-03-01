
import { MongoRepository } from '../../infrastructure/repository/MongoRepository';
import { TypeCarEntity, } from './TypeCarEntity';
export interface TypeCarRepository extends MongoRepository {

    deleteOneTypeCar(_id: string): Promise<TypeCarEntity | null>


}