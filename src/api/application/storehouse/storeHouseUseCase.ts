import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { storeHouseRepository } from '../../domain/storehouse/storeHouseRepository';
import { StockStoreHouseEntity } from '../../domain/storehouse/stockStoreHouseEntity';
import { storeHouseEntity } from '../../domain/storehouse/storeHouseEntity';
import CounterService from '../../utils/CounterService';


export class StoreHouseUseCase {
    protected path = '/store-house/'

    constructor(private readonly StoreHouseRepository: storeHouseRepository) { }

    public async getStoreHouses(): Promise<storeHouseEntity[] | ErrorHandler | null> {
        return await this.StoreHouseRepository.findAll();
    }

    public async getDetailStoreHouse(_id: string): Promise<storeHouseEntity | null> {
        return await this.StoreHouseRepository.findById(_id);
    }

    public async createStoreHouse(body:object): Promise<storeHouseEntity | null> {
       const nextId = await CounterService.getNextSequence('StoreHouse')
       const branchKey = `SH-${nextId}`
        return this.StoreHouseRepository.createOne({...body, storehouse_key: branchKey})
    }
    public async updateStoreHouse(_id: string,updated: object): Promise<storeHouseEntity  | null> {
        return await this.StoreHouseRepository.updateOne(_id,{...updated});
    }
    public async deleteStoreHouse(_id: string): Promise<storeHouseEntity | null> {
        return this.StoreHouseRepository.updateOne(_id, {status: false})
    }
    



}
