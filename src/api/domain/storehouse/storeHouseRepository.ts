import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { storeHouseEntity } from "./storeHouseEntity"

export interface storeHouseRepository extends MongoRepository {   

    getAllStoreHouses(populateOne?: any, populateTwo?: any): Promise<storeHouseEntity[] | null>
}