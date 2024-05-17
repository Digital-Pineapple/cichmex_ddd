import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { MembershipHistory } from "./MembershipEntity"

export interface MembershipRepository extends MongoRepository {

}

export interface MembershipBenefitsRepository extends MongoRepository{
  
    findMembershipsBenefits(query: Object, populateConfig1:any,populateConfig2:any,populateConfig3:any): Promise<any | null>
    
}
export interface MembershipHistoryRepository extends MongoRepository{
  
    getSalesDayByBranch(date_service: any, branch_office_id: any, populate?:any, populate2?:any): Promise<MembershipHistory[] | null>

    getOneMemHistory(query: Object, populateConfig1?:any,populateConfig2?:any,populateConfig3?:any): Promise<any | null>

    
}