import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import {StockStoreHouseRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { SHProductInput } from '../../domain/storehouse/stockStoreHouseEntity';


export class StockSHinputUseCase {
    protected path = '/stock-store-house'

    constructor(private readonly stockStoreHouseRepository: StockStoreHouseRepository) { }

    public async createInput(body:object): Promise<SHProductInput> {
        return this.stockStoreHouseRepository.createOne({...body})
    }
    
    

}


