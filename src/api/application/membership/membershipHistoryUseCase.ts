import {  MembershipHistory } from '../../domain/membership/MembershipEntity';
import { MembershipHistoryRepository } from '../../domain/membership/MembershipRepository'


export class MembershipHistoryUseCase {

    constructor(private readonly membershipHistoryRepository: MembershipHistoryRepository) { }
 
 public async createOneHistoryMembership( date_service:Date, membershipBenefit_id:string ): Promise<MembershipHistory> {
        return await this.membershipHistoryRepository.createOne({date_service,membershipBenefit_id });
    }
    
    public async deleteHistoryMembership(id:string): Promise<MembershipHistory> {
        return await this.membershipHistoryRepository.softDelete(id)
    }
   
  
   
}
