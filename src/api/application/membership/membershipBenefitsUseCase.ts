import mongoose from 'mongoose';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { MembershipBenefits, MembershipHistory } from '../../domain/membership/MembershipEntity';
import { MembershipBenefitsRepository } from '../../domain/membership/MembershipRepository'

export class MembershipBenefitsUseCase {

    constructor(private readonly membershipBenefitsRepository: MembershipBenefitsRepository) { }

    public async getMembershipBenefits(): Promise<MembershipBenefits[] | ErrorHandler > {
        return await this.membershipBenefitsRepository.getAllMembershipHistory();
    }

    public async getDetailMembershipBenefit(_id: string): Promise<MembershipBenefits | ErrorHandler | null> {
        return await this.membershipBenefitsRepository.findById(_id)
    }
    public async getDetailMembershipBenefitHistory(id:string): Promise<MembershipBenefits | ErrorHandler | null> {
        return await this.membershipBenefitsRepository.getMembershipDetailHistory(id)
    }

    public async createNewMembershipBenefit( membership_id:string, service_id:string, client_id:string, quantity:number, start_date:Date, end_date:Date,status:boolean): Promise<MembershipBenefits | ErrorHandler | null> {

        return await this.membershipBenefitsRepository.createOne({ membership_id, service_id, client_id, quantity, start_date, end_date, status, membership_history:[]});
    }

    public async updateOneMembershipBenefit(_id: string,updated: MembershipBenefits): Promise<MembershipBenefits> {
        return await this.membershipBenefitsRepository.updateOne(_id,updated);
    }
    public async deleteMembershipBenefit(_id: string): Promise<MembershipBenefits> {
        return await this.membershipBenefitsRepository.updateOne(_id,{status:false});
    }
    
}
