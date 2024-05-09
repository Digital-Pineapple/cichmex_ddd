import { MongoRepository } from "../../infrastructure/repository/MongoRepository"

export interface PaymentRepository extends MongoRepository {

    findPayment(query: Object, populateConfig1?: any, populateConfig2?: any, populateConfig3?: any): Promise<any>
    

}
