import { MongoRepository } from '../../infrastructure/repository/MongoRepository';
import { IPhone, UserEntity } from '../user/UserEntity';
export interface AuthRepository extends MongoRepository {

    validatePhoneNumber(phone: number, customer_id: string): Promise<UserEntity | null>
     validatePhoneNumber(phone: number, customer_id: string): Promise<UserEntity | null>
    verifyCode(_id: string): Promise<UserEntity | null>




    
}