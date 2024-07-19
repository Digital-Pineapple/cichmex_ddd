import {StockSHReturnRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { SHProductReturn } from '../../domain/storehouse/stockStoreHouseEntity';

export class StockSHreturnUseCase {
    protected path = '/stock-branch'

    constructor(private readonly stockSHReturnRepository: StockSHReturnRepository) { }


    public async createReturn(body:object): Promise<SHProductReturn | null> {
        return this.stockSHReturnRepository.createOne({...body})
    }
    async findStockByStoreHouse(branchId: string): Promise<any[] | null> {
        return await this.stockSHReturnRepository.findById(branchId)
      }
    
    

}
