import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { IAisle } from "./aisleEntity"

export interface aisleRepository extends MongoRepository {   

      getAllDetailAisle(id: string): Promise<IAisle | null>
     

}