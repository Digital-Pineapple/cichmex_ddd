import { Model } from 'mongoose';
import { MembershipBenefitsRepository as MembershipBenefitsConfig } from '../../../domain/membership/MembershipRepository'

import { MongoRepository } from '../MongoRepository';
import { MembershipBenefits } from '../../../domain/membership/MembershipEntity';


export class MembershipBenefitsRepository extends MongoRepository implements MembershipBenefitsConfig {
    

    constructor(protected MembershipBenefitsModel: Model<any>) {
        super(MembershipBenefitsModel);
    }

    async findMembershipsBenefits(query: Object, populateConfig1:any,populateConfig2:any,populateConfig3:any): Promise<any | null> {
        return await this.MODEL.find(query).populate(populateConfig1).populate(populateConfig2).populate(populateConfig3)
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