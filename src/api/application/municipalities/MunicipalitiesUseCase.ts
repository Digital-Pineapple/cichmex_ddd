import { MunicipalitiesRepository } from '../../infrastructure/repository/municipalities/MunicipalitiesRepository';

// Clase que contiene la lógica de negocio relacionada con los municipios
export class MunicipalitiesUseCase {
    // Constructor que recibe el repositorio de municipios
    constructor(private municipalitiesRepository: MunicipalitiesRepository) {}

    // Método para obtener todos los municipios
    async getAllMunicipalities() {
        return await this.municipalitiesRepository.findAllMunicipalities();
    }

    // Método para obtener un municipio por su ID
    async getOneMunicipality(id: string) {
        return await this.municipalitiesRepository.findMunicipalityById(id);
    }

    // Método para crear un nuevo municipio
    async createMunicipality(municipalityData: any) {
        return await this.municipalitiesRepository.createMunicipality(municipalityData);
    }

    // Método para actualizar un municipio
    async updateMunicipality(id: string, municipalityData: any) {
        return await this.municipalitiesRepository.updateMunicipality(id, municipalityData);
    }

    // Método para eliminar un municipio
    async deleteMunicipality(id: string) {
        return await this.municipalitiesRepository.deleteMunicipality(id);
    }

    // Método para obtener los municipios por un estado específico
    async getMunicipalitiesByState(stateId: string) {
        return await this.municipalitiesRepository.findMunicipalitiesByState(stateId);
    }
}
