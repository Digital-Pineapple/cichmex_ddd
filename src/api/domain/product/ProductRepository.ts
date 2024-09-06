import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { ProductEntity } from "./ProductEntity"

export interface ProductRepository extends MongoRepository {

    getProductsByCategory(query:any, populateCofig1?:any): Promise<ProductEntity[]| ErrorHandler | null>

    findDetailProductById(id:string, populateCofig1?:any, populateConfig2?:any, populateConfig3?:any): Promise<ProductEntity| ErrorHandler | null>
    findVideoProducts(): Promise<ProductEntity[] | ErrorHandler | null>
    findRandomProductsByCategory(id: any, skiproduct: any, storehouse: any): Promise<ProductEntity[] | ErrorHandler | null>

}
