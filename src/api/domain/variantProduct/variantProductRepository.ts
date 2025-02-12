import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { ProductImageEntity } from "../product/ProductEntity"
import { VariantProductEntity } from "./variantProductEntity"


export interface variantProductRepository extends MongoRepository {   

    findVariantsByProduct(body: any): Promise<VariantProductEntity[] | null>
}