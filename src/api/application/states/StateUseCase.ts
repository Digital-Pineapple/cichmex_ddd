import { StateRepository } from '../../infrastructure/repository/states/StateRepository';

export class StateUseCase {
    constructor(private stateRepository: StateRepository) {}

    async getAllStates() {
        return await this.stateRepository.findAllStates();
    }

    async getOneState(id: string) {
        return await this.stateRepository.findStateById(id);
    }

    async createState(stateData: any) {
        return await this.stateRepository.createState(stateData);
    }

    async updateState(id: string, stateData: any) {
        return await this.stateRepository.updateState(id, stateData);
    }

    async deleteState(id: string) {
        return await this.stateRepository.deleteState(id);
    }
}
