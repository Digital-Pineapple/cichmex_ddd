
import { SHProductOutput } from '../../domain/storehouse/stockStoreHouseEntity';
import { StockSHOutputRepository } from '../../domain/storehouse/stockStoreHouseRepository';


export class StockSHoutputUseCase {
    protected path = '/stock-store-house'

    constructor(private readonly stockOutputSHRepository: StockSHOutputRepository) { }

    public async createOutput(body:object): Promise<SHProductOutput> {
        return this.stockOutputSHRepository.createOne({...body})
    }
    
    

}

