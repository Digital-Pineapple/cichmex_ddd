import mongoose, { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';

export class MunicipalitiesRepository extends MongoRepository {
    constructor(protected MunicipalitiesModel: Model<any>) {
        super(MunicipalitiesModel);
    }

    async findAllMunicipalities(): Promise<any[]> {
        return await this.MunicipalitiesModel.find();
    }

    async findMunicipalityById(id: string): Promise<any | null> {
        return await this.MunicipalitiesModel.findById(id);
    }

    async createMunicipality(municipalityData: any): Promise<any> {
        return await this.MunicipalitiesModel.create(municipalityData);
    }

    async updateMunicipality(id: string, municipalityData: any): Promise<any | null> {
        return await this.MunicipalitiesModel.findByIdAndUpdate(id, municipalityData, { new: true });
    }

    async deleteMunicipality(id: string): Promise<any | null> {
        return await this.MunicipalitiesModel.findByIdAndDelete(id);
    }

    async findMunicipalitiesByState(stateId: string): Promise<any[]> {    
        console.log("estado repositorio", stateId);            
        return await this.MunicipalitiesModel.find({ state_id: new mongoose.Types.ObjectId(stateId) });
    }
}
