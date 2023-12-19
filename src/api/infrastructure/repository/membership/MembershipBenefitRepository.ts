import { Model } from 'mongoose';
import { MembershipBenefitsRepository as MembershipBenefitsConfig } from '../../../domain/membership/MembershipRepository'

import { MongoRepository } from '../MongoRepository';
import { MembershipBenefits } from '../../../domain/membership/MembershipEntity';


export class MembershipBEnefitsRepository extends MongoRepository implements MembershipBenefitsConfig {
    

    constructor(protected MembershipBenefitsModel: Model<any>) {
        super(MembershipBenefitsModel);
    }

    async findOneMembershipBenefit(query: Object): Promise<MembershipBenefits | null> {
        return await this.findOneItem(query);
    }

    async findAndUpdateMembershipBenefit(_id: String, updated: object): Promise<MembershipBenefits | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllMembershipBenefits(): Promise<MembershipBenefits[] | null> {
        return await this.findAll();
    }

    async createOneMembershipBenefit(body: Object): Promise<MembershipBenefits | null> {
        return await this.createOne(body);
    }
    
   

}