import { MongoRepository } from '../../infrastructure/repository/MongoRepository';
import { TypeCarEntity, IService } from './TypeCarEntity';
export interface TypeCarRepository extends MongoRepository {

    deleteOneTypeCar(_id: string): Promise<TypeCarEntity | null>

}