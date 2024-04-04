import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { MembershipHistory } from "./MembershipEntity"

export interface MembershipRepository extends MongoRepository {

}

export interface MembershipBenefitsRepository extends MongoRepository{
  
    
}
export interface MembershipHistoryRepository extends MongoRepository{
  
    getSalesDayByBranch(date_service: any, branch_office_id: any): Promise<MembershipHistory[] | null>
   
    
}