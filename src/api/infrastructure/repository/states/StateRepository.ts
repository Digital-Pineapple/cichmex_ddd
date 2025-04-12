import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';

export class StateRepository extends MongoRepository {
    constructor(protected StateModel: Model<any>) {
        super(StateModel);
    }

    async findAllStates(): Promise<any[]> {
        return await this.StateModel.find();
    }

    async findStateById(id: string): Promise<any | null> {
        return await this.StateModel.findById(id);
    }

    async createState(stateData: any): Promise<any> {
        return await this.StateModel.create(stateData);
    }

    async updateState(id: string, stateData: any): Promise<any | null> {
        return await this.StateModel.findByIdAndUpdate(id, stateData, { new: true });
    }

    async deleteState(id: string): Promise<any | null> {
        return await this.StateModel.findByIdAndDelete(id);
    }
}
