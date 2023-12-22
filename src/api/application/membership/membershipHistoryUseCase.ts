import {  MembershipHistory } from '../../domain/membership/MembershipEntity';
import { MembershipHistoryRepository } from '../../domain/membership/MembershipRepository'

export class MembershipHistoryUseCase {

    constructor(private readonly membershipHistoryRepository: MembershipHistoryRepository) { }
 
 public async createOneHistoryMembership(status:boolean, date_service:Date, membershipBenefit_id:string ): Promise<MembershipHistory> {
        return await this.membershipHistoryRepository.createOne({status,date_service,membershipBenefit_id });
    }
    
    public async deleteHistoryMembership(id:string): Promise<MembershipHistory> {
        return await this.membershipHistoryRepository.updateOne(id, {status:false})
    }
    public async getHistoryMembership2(id:string): Promise<MembershipHistory> {
        return await this.membershipHistoryRepository.getMembershipDetailHistory(id)
    }
   
  
   
}
