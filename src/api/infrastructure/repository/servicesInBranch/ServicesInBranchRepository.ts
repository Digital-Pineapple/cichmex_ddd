import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { ServicesInBranchRepository as ServInBraConfig } from '../../../domain/servicesInBranch/servicesInBranchRepository';
import { IPhone, UserEntity } from '../../../domain/user/UserEntity';
// import  ServicesInBranchModel  from '../../models/BranchOffices/ServicesInBranchModel'
import { ServicesInBranchEntity } from '../../../domain/servicesInBranch/servicesInBranchEntity';
export class ServicesInBranchRepository extends MongoRepository implements ServInBraConfig {

    constructor(protected ServicesInBranchModel: Model<any>) {
        super(ServicesInBranchModel);
    }
    // async getServicesInBranch(_id: string): Promise<ServicesInBranchEntity | null> {
    //     return await this.ServicesInBranchModel.find({user_id:_id})
    // }

    

}