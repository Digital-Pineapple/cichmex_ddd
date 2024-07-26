import { MongoRepository } from "../../infrastructure/repository/MongoRepository"


export interface SubCategoriesRepository extends MongoRepository {

    findProductsBySubCategory(category_id: any, storehouse:any): Promise<any | null>
    findOneSubCategory(query: any): Promise<any | null>
    


}