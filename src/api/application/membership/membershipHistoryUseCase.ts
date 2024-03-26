import {  MembershipHistory } from '../../domain/membership/MembershipEntity';
import { MembershipHistoryRepository } from '../../domain/membership/MembershipRepository'


export class MembershipHistoryUseCase {

    constructor(private readonly membershipHistoryRepository: MembershipHistoryRepository) { }
 
 public async createOneHistoryMembership( membershipBenefit_id:string ): Promise<MembershipHistory> {
        return await this.membershipHistoryRepository.createOne({membershipBenefit_id});
    }
    
    public async deleteHistoryMembership(id:string, date_service: Date): Promise<MembershipHistory> {
        return await this.membershipHistoryRepository.softDelete(id, date_service)
    }
    public async getHistoryMembership(): Promise<MembershipHistory[]> {
        return await this.membershipHistoryRepository.findAll()
    }
  
   
}
