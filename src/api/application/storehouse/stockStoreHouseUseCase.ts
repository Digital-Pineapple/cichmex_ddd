import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { StockStoreHouseRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { StockStoreHouseEntity } from '../../domain/storehouse/stockStoreHouseEntity';


export class StockStoreHouseUseCase {
    protected path = '/stock-branch'

    constructor(private readonly stockStoreHouseRepository: StockStoreHouseRepository) { }

    public async getStock(): Promise<StockStoreHouseEntity[] | ErrorHandler | null> {
        return await this.stockStoreHouseRepository.findAll();
    }
    public async getProductStock(product_id: string, populateConfig?:any ) : Promise <StockStoreHouseEntity > { 
          return await this.stockStoreHouseRepository.findById(product_id,populateConfig) 
    }  

    public async getDetailStock(_id: string): Promise<StockStoreHouseEntity | null> {
        return await this.stockStoreHouseRepository.findById(_id);
    }

    public async createStock(body:object): Promise<StockStoreHouseEntity | null> {
        return this.stockStoreHouseRepository.createOne({...body})
    }
    public async updateStock(_id: string,updated: object): Promise<StockStoreHouseEntity  | null> {
        return await this.stockStoreHouseRepository.updateOne(_id,updated);
    }
    public async deleteStock(_id: string): Promise<StockStoreHouseEntity | null> {
        return this.stockStoreHouseRepository.updateOne(_id, {deleted: false})
    }
    



}

