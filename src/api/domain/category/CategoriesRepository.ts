import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { Category } from "./Category"

export interface CategoriesRepository {

    getAllCategory(): Promise<Category[] | null>

    getOneCategory(_id: string): Promise<Category | null>

    createCategory(body: object): Promise<Category | null>

    updateCategory(_id: string, update: Category): Promise<Category | null>

    deleteCategory(_id: string): Promise<Category | null>


}