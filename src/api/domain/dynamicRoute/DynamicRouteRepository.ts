import { MongoRepository } from "../../infrastructure/repository/MongoRepository";


export interface DynamicRouteRepository extends MongoRepository {

    findRoutes(role:any, system:string): Promise<any>

    findPublicRoutes(system:string): Promise<any>

}