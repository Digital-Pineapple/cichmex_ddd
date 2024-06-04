import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { Category } from "./CategoryEntity"

export interface CategoriesRepository extends MongoRepository {

     findCategoriesAndSubCategories(): Promise<Category[] | null>

    



}