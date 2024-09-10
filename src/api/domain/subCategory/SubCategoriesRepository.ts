import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { SubCategory } from "./SubCategoryEntity"


export interface SubCategoriesRepository extends MongoRepository {

    findProductsBySubCategory(category_id: any, storehouse:any): Promise<any | null>
    findOneSubCategory(query: any): Promise<any | null>
    getDetailSubCategory(id: string): Promise<SubCategory  | null>
    


}