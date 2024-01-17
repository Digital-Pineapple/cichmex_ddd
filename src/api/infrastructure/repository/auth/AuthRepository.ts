import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { AuthRepository as AuthConfig } from '../../../domain/auth/AuthRepository';
import { CustomerEntity } from '../../../domain/customer/CustomerEntity';
import TypeCustomerModel from '../../models/TypeUserModel';
import { UserEntity } from '../../../domain/user/UserEntity';
export class AuthRepository extends MongoRepository implements AuthConfig {

    constructor(protected CustomerModel: Model<any>) {
        super(CustomerModel);
    }
    async validateTypeCustomer(_id: string): Promise<UserEntity | null > {
        return await TypeCustomerModel.findById(_id);
    }
    async verifyCode(_id: string): Promise<UserEntity | null> {
        return await this.CustomerModel.findByIdAndUpdate(_id, { 'phone.verified': true }, { new: true });
    }

    async validatePhoneNumber(phone: number, customer_id: string): Promise<UserEntity | null> {
         return await this.CustomerModel.findOne({ 'phone.phone_number': phone, _id: { $ne: customer_id} });
    }

}