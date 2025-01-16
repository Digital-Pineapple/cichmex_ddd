import { ObjectId } from "mongoose"
import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { ProductEntity } from "./ProductEntity"

export interface ProductRepository extends MongoRepository {

    getProductsByCategory(query:any, populateCofig1?:any): Promise<ProductEntity[]| ErrorHandler | null>

    findDetailProductById(id:string, populateCofig1?:any, populateConfig2?:any, populateConfig3?:any): Promise<ProductEntity| ErrorHandler | null>
    findVideoProducts(): Promise<ProductEntity[] | ErrorHandler | null>
    startDeleteImageDetail(id: string, imageId: string): Promise<ProductEntity | ErrorHandler | null >
    startDeleteVideoDetail(id: string, video_id: string): Promise<ProductEntity | ErrorHandler | null>
    findRandomProductsByCategory(id: any, skiproduct: any, storehouse: any): Promise<ProductEntity[] | ErrorHandler | null>
    findSearchProducts(search: string, page: number): Promise<ProductEntity[] | ErrorHandler | null>
    findProductsByCategory(categoryId: ObjectId, storehouse: string, queryparams: Object): Promise<ProductEntity[] | ErrorHandler | null>
    findProductsBySubCategory(categoryId: ObjectId, storehouse: string, queryparams: Object): Promise<ProductEntity[] | ErrorHandler | null>
    findNewlyAddedProducts(): Promise<ProductEntity[] | ErrorHandler | null>

}
