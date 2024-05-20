import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { AuthRepository as AuthConfig } from '../../../domain/auth/AuthRepository';
import { IPhone, UserEntity } from '../../../domain/user/UserEntity';
import  UserModel  from '../../models/UserModel'
import { IAuth } from '../../../application/authentication/AuthenticationService';
export class AuthRepository extends MongoRepository implements AuthConfig {

    constructor(protected UserModel: Model<any>) {
        super(UserModel);
    }
    async verifyCode(_id: string): Promise<UserEntity | null> {
        return await this.UserModel.findByIdAndUpdate(_id, { 'phone.verified': true }, { new: true });
    }

    async validatePhoneNumber(phone: number, customer_id: string): Promise<UserEntity | null> {
         return await this.UserModel.findOne({ 'phone.phone_number': phone, _id: { $ne: customer_id} });
    }

    async verifyCodeRegister(_id: string): Promise<UserEntity | null> {
        return await this.UserModel.findByIdAndUpdate(_id, { 'phone.verified': true }, { new: true });
    }

   async findUser(query: any, populateConfig1?:any,populateConfig2?:any, populateConfig3?:any): Promise<UserEntity | null>{
    return await this.MODEL.findOne({...query}).populate(populateConfig1).populate(populateConfig2).populate(populateConfig3)    
    
   }

}