import { StateRepository } from '../../infrastructure/repository/states/StateRepository';

// Clase que contiene la lógica de negocio relacionada con los estados
export class StateUseCase {
    // Constructor que recibe el repositorio de estados
    constructor(private stateRepository: StateRepository) {}

    // Método para obtener todos los estados
    async getAllStates() {
        return await this.stateRepository.findAllStates();
    }

    // Método para obtener un estado por su ID
    async getOneState(id: string) {
        return await this.stateRepository.findStateById(id);
    }

    // Método para crear un nuevo estado
    async createState(stateData: any) {
        return await this.stateRepository.createState(stateData);
    }

    // Método para actualizar un estado
    async updateState(id: string, stateData: any) {
        return await this.stateRepository.updateState(id, stateData);
    }

    // Método para eliminar un estado
    async deleteState(id: string) {
        return await this.stateRepository.deleteState(id);
    }
}
