import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { UserRepository as UserConfig } from '../../../domain/user/UserRepository';
import { IPhone, UserEntity } from '../../../domain/user/UserEntity';
import  UserModel  from '../../models/UserModel'
export class UserRepository extends MongoRepository implements UserConfig {

    constructor(protected UserModel: Model<any>) {
        super(UserModel);
    }
    async register(user: UserEntity): Promise<UserEntity | null> {
        return await this.UserModel.create(user)
    }

    async findByRoles(roles: Array<any>): Promise<UserEntity[] | null>{
        const parsedRoles = roles.map(role=>role.toString());
        return await this.UserModel.find({ type_user: { $in: parsedRoles } });
    }
    
   
}