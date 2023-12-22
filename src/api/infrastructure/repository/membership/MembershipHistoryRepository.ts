import { Model } from 'mongoose';
import { MembershipHistoryRepository as MembershipHistoryConfig } from '../../../domain/membership/MembershipRepository'

import { MongoRepository } from '../MongoRepository';
import { MembershipHistory } from '../../../domain/membership/MembershipEntity';


export class MembershipHistoryRepository extends MongoRepository implements MembershipHistoryConfig {
    

    constructor(protected MembershipHistoryModel: Model<any>) {
        super(MembershipHistoryModel);
    }

    async findOneMembershipHistory(query: Object): Promise<MembershipHistory | null> {
        return await this.findOneItem(query);
    }

    async findAndUpdateMembershipHistory(_id: String, updated: object): Promise<MembershipHistory | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllMembershipHistory(): Promise<MembershipHistory[] | null> {
        return await this.findAll();
    }

    async createOneMembershpHistory(body: Object): Promise<MembershipHistory | null> {
        return await this.createOne(body);
    }
    
   

}