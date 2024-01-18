import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { AuthRepository as AuthConfig } from '../../../domain/auth/AuthRepository';
import { UserEntity } from '../../../domain/user/UserEntity';
import  UserModel  from '../../models/UserModel'
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

}