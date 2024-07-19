import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { IShoppingCostResponse, ShippingCostEntity } from "./ShippingCostEntity"


export interface ShippingCostRepository extends MongoRepository {

    findShippingCostByWeight(weight:any): Promise<ShippingCostEntity | IShoppingCostResponse | null>

}