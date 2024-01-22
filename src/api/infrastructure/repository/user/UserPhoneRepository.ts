import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { UserPhoneRepository as UserConfig } from '../../../domain/user/UserRepository';
import { IPhone, UserEntity } from '../../../domain/user/UserEntity';
import  PhoneModel  from '../../models/PhoneModel'
import { IPhoneRequest } from '../../../application/auth/interfaces';
export class UserPhoneRepository extends MongoRepository implements UserConfig {

    constructor(protected PhoneModel: Model<any>) {
        super(PhoneModel);
    }
    async verifyCode(_id: string): Promise<IPhone | null> {
        return await this.MODEL.findByIdAndUpdate(_id, { 'phone.verified': true }, { new: true });
    }

}