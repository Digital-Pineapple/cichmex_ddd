import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { ISection } from "./sectionEntity"

export interface sectionRepository extends MongoRepository {   

    findProductInSections(productId: string): Promise<ISection[] | null>

    findVariantInSections(variantId: string) : Promise<ISection[] | null>
}