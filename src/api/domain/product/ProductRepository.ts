import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { ProductEntity } from "./ProductEntity"

export interface ProductRepository extends MongoRepository {

    updateImagesAndSlug(_id: string, images: [string], slug: string): Promise<ProductEntity | null>

}
