import { MongoRepository } from '../../infrastructure/repository/MongoRepository';
import { UserEntity } from './UserEntity';

export interface UserRepository extends MongoRepository {

    
}
export interface UserPhoneRepository extends MongoRepository {
    
}
