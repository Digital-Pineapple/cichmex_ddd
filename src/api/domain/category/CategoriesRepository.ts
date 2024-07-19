import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { Category } from "./CategoryEntity"

export interface CategoriesRepository extends MongoRepository {

     findCategoriesAndSubCategories(): Promise<Category[] | null>
     findCategoriesAndProducts(storehouse: any): Promise<Category[] | null>
     findProductsByCategory(category_id: any, storehouse:any): Promise<any | null>

    



}