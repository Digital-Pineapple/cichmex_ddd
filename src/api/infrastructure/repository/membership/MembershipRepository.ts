import { Model } from 'mongoose';
import { MembershipRepository as MembershipConfig } from '../../../domain/membership/MembershipRepository'

import { MongoRepository } from '../MongoRepository';
import { MembershipEntity } from '../../../domain/membership/MembershipEntity';


export class MembershipRepository extends MongoRepository implements MembershipConfig {
    

    constructor(protected MembershipModel: Model<any>) {
        super(MembershipModel);
    }

    async findOneMembership(query: Object): Promise<MembershipEntity | null> {
        return await this.findOneItem(query);
    }

    async findAndUpdateMembership(_id: String, updated: object): Promise<MembershipEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllMemberships(): Promise<MembershipEntity[] | null> {
        return await this.findAll();
    }

    async createOneMembership(body: Object): Promise<MembershipEntity | null> {
        return await this.createOne(body);
    }
    
   

}