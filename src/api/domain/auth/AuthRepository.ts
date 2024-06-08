import { IAuth } from '../../application/authentication/AuthenticationService';
import { MongoRepository } from '../../infrastructure/repository/MongoRepository';
import { IPhone, UserEntity } from '../user/UserEntity';
export interface AuthRepository extends MongoRepository {
    validatePhoneNumber(phone: number, customer_id: string): Promise<UserEntity | null>
    validatePhoneNumber(phone: number, customer_id: string): Promise<UserEntity | null>
    findUser(query: any, populateConfig1?:any,populateConfig2?:any, populateConfig3?:any): Promise<UserEntity | null>
    verifyCode(_id: string): Promise<UserEntity | null>
    verifyUserCode (email: string,code:number): Promise<UserEntity | null>


}