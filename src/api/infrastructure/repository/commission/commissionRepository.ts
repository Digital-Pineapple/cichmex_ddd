import { Model } from 'mongoose';
import { CommissionsRepository as CommissionConfig } from '../../../domain/commission/CommissionsRepository'
import { MongoRepository } from '../MongoRepository';


export class CommissionRepository extends MongoRepository implements CommissionConfig {
    

    constructor(protected CommissionModel: Model<any>) {
        super(CommissionModel);
    }

    async findOneCommission(query: Object): Promise<CommissionEntity | null> {
        return await this.findOneItem(query);
    }

    async findByNameCommission(name: String): Promise<CommissionEntity | null> {
        return await this.findOneItem({ name });
    }

    async findByIdCommission(_id: String): Promise<CommissionEntity | null> {
        return await this.findById(_id);
    }
    async findAndUpdateCommission(_id: String, updated: object): Promise<CommissionEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllCommissions(): Promise<CommissionEntity[] | null> {
        return await this.findAll();
    }

    async createOneCommission(body: Object): Promise<CommissionEntity | null> {
        return await this.createOne(body);
    }
    async searchCommission(body: Object): Promise<CommissionEntity| null> {
        return await this.createOne(body);
    }
   

}