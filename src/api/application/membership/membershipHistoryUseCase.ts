import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
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
    public async consumeBenefit(id:any, membershipBenefit_id:any, date_service:Date, typeCar_id:any, car_color:string, plate_number:string, branch_office_id:any ): Promise<MembershipHistory | ErrorHandler> {
        const item = await this.membershipHistoryRepository.findOneItem({_id:id})
     if (item.deleted === true) {
        return new ErrorHandler('Beneficio ya consumido',500)
     } else {
        const item2 = await this.membershipHistoryRepository.updateOne(id,{membershipBenefit_id, date_service, typeCar_id, car_color, plate_number, branch_office_id, deleted:true})
        return item2
     }
    } 
  
   
}
