import { MunicipalitiesRepository } from '../../infrastructure/repository/municipalities/MunicipalitiesRepository';

export class MunicipalitiesUseCase {
    constructor(private municipalitiesRepository: MunicipalitiesRepository) {}

    async getAllMunicipalities() {
        return await this.municipalitiesRepository.findAllMunicipalities();
    }

    async getOneMunicipality(id: string) {
        return await this.municipalitiesRepository.findMunicipalityById(id);
    }

    async createMunicipality(municipalityData: any) {
        return await this.municipalitiesRepository.createMunicipality(municipalityData);
    }

    async updateMunicipality(id: string, municipalityData: any) {
        return await this.municipalitiesRepository.updateMunicipality(id, municipalityData);
    }

    async deleteMunicipality(id: string) {
        return await this.municipalitiesRepository.deleteMunicipality(id);
    }

    async getMunicipalitiesByState(stateId: string) {
        return await this.municipalitiesRepository.findMunicipalitiesByState(stateId);
    }
}
