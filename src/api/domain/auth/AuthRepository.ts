import { MongoRepository } from '../../infrastructure/repository/MongoRepository';
import { UserEntity } from '../user/UserEntity';
export interface AuthRepository extends MongoRepository {

    validatePhoneNumber(phone: number, customer_id: string): Promise<UserEntity | null>
    verifyCode(_id: string): Promise<UserEntity | null>



    
}