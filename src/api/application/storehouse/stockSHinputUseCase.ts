import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import {StockSHInputRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { SHProductInput } from '../../domain/storehouse/stockStoreHouseEntity';


export class StockSHinputUseCase {
    protected path = '/stock-store-house'

    constructor(private readonly stockSHInputRepository: StockSHInputRepository) { }

    public async getAllInputs(): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.findAll()
    }
    
    public async createInput(body:object): Promise<SHProductInput> {
        return this.stockSHInputRepository.createOne({...body})
    }
    

}


