import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { CommissionsRepository } from '../../domain/commission/CommissionsRepository'

export class CommissionUseCase {

    constructor(private readonly commissionsRepository: CommissionsRepository) { }

    public async getCommissions(): Promise<CommissionEntity[] | ErrorHandler | null> {
        return await this.commissionsRepository.findAll();
    }

    public async getDetailCommission(_id: string): Promise<CommissionEntity | ErrorHandler | null> {
        return await this.commissionsRepository.findById(_id);
    }

    public async createNewCommission(name: string, amount: number, status: boolean): Promise<CommissionEntity | ErrorHandler | null> {
        const commission = await this.commissionsRepository.findOneItem({name});
        if (commission) return new ErrorHandler('La comision ya ha sido registrada',400);
        return await this.commissionsRepository.createOne({ name, amount, status });
    }

    public async updateOneCommission(_id: string,updated: CommissionEntity): Promise<CommissionEntity> {
        return await this.commissionsRepository.updateOne(_id,updated);
    }
    public async deleteOneCommission(_id: string): Promise<CommissionEntity | null> {
        return this.commissionsRepository.updateOne(_id, {status: false})
    }

}