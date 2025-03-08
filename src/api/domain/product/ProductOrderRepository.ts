import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import {  ProductOrderEntity, ProductOrderResume } from "./ProductEntity"

export interface ProductOrderRepository extends MongoRepository {

     getProductOrdersByUser( _id: string, populateConfig1?:any): Promise<ProductOrderEntity[] | ErrorHandler| null > 
     
     getProductOrdersByBranch( _id: string, populateConfig1?:any): Promise<ProductOrderEntity[] | ErrorHandler| null > 

     getPOExpired(): Promise<ProductOrderEntity[] | ErrorHandler| null > 
     
     findAllProductOrders(populateConfig1?:any, populateConfig2?:any,  populateConfig3?: any): Promise<ProductOrderEntity[] | ErrorHandler | null> 

     getPaidProductOrders(): Promise<ProductOrderEntity[] | ErrorHandler | null> 

     getPaidAndSuplyToPointPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> 

     getDeliveriesPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> 


     getAssignedPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> 

     ResumeProductOrders(): Promise<ProductOrderResume> 

     getPendingTransferPO(): Promise<ProductOrderEntity[] | ErrorHandler | null>
     
     getPaidAndVerifyPackageToPointPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> 
     getAssignedPOUser(user_id:any): Promise<ProductOrderEntity[] | ErrorHandler | null> 

}
