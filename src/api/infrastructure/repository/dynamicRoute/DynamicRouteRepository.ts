import { Model } from 'mongoose';
import { DynamicRouteRepository as DynamicRouterConfig } from '../../../domain/dynamicRoute/DynamicRouteRepository'
import { MongoRepository } from '../MongoRepository';



export class DynamicRouteRepository extends MongoRepository implements DynamicRouterConfig {


    constructor(protected DinamicRouterModel: Model<any>) {
        super(DinamicRouterModel);
    }

    async findRoutes(role: any, system: string): Promise<any> {
        return await this.DinamicRouterModel.find({
            rolesAllowed: {
                $elemMatch: {
                    $in: role
                }
            },
            system: system
        });
    }
    

}