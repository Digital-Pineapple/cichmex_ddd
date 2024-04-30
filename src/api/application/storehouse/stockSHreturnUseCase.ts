import {StockStoreHouseRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { SHProductReturn } from '../../domain/storehouse/stockStoreHouseEntity';

export class StockSHreturnUseCase {
    protected path = '/stock-branch'

    constructor(private readonly stockStoreHouseRepository: StockStoreHouseRepository) { }


    public async createReturn(body:object): Promise<SHProductReturn | null> {
        return this.stockStoreHouseRepository.createOne({...body})
    }
    async findStockByStoreHouse(branchId: string): Promise<any[] | null> {
        return await this.stockStoreHouseRepository.findById(branchId)
      }
    
    

}
