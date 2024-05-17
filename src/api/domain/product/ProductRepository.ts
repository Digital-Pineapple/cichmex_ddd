import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { ProductEntity } from "./ProductEntity"

export interface ProductRepository extends MongoRepository {

    getProductsByCategory(query:any, populateCofig1?:any): Promise<ProductEntity[]| ErrorHandler | null>

}
