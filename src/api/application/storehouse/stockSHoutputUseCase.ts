import {StockStoreHouseRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { SHProductOutput } from '../../domain/storehouse/stockStoreHouseEntity';


export class StockSHoutputUseCase {
    protected path = '/stock-store-house'

    constructor(private readonly stockStoreHouseRepository: StockStoreHouseRepository) { }

    public async createOutput(body:object): Promise<SHProductOutput> {
        return this.stockStoreHouseRepository.createOne({...body})
    }
    
    

}

