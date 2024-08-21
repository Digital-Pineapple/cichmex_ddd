import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { PaymentEntity } from "./PaymentEntity"

export interface PaymentRepository extends MongoRepository {

    findPayment(query: Object, populateConfig1?: any, populateConfig2?: any, populateConfig3?: any): Promise<any>
    
    getMPPayments(): Promise<PaymentEntity[]  | null>

}
