import { MongoRepository } from '../MongoRepository';
import { BranchOfficeEntity,ILocation } from '../../../domain/branch_office/BranchOfficeEntity';
import { BranchOfficeRepository as BranchOfficeConfig } from '../../../domain/branch_office/BranchOfficeRepository';
import { Model } from 'mongoose';



export class BranchOfficeRepository extends MongoRepository implements BranchOfficeConfig {
    

    constructor(protected BranchOfficeModel: Model<any>) {
        super(BranchOfficeModel);
    }

    async findOneBranchOffice(query: Object): Promise<BranchOfficeEntity | null> {
        return await this.findOneItem(query);
    }

    async findByIdBranchOffice(_id: String): Promise<BranchOfficeEntity | null> {
        return await this.findById(_id);
    }
    async findAndUpdateBranchOffice(_id: String, updated: object): Promise<BranchOfficeEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllBranchOffices(): Promise<BranchOfficeEntity[] | null> {
        return await this.findAll();
    }

    async createOneBranchOffice(body: Object): Promise<BranchOfficeEntity | null> {
        return await this.createOne(body);
    }
   

}