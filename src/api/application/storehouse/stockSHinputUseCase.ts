import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import {StockSHInputRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { SHProductInput } from '../../domain/storehouse/stockStoreHouseEntity';
import { PopulateProductDetail, PopulateProducts } from '../../../shared/domain/PopulateInterfaces';


export class StockSHinputUseCase {
    protected path = '/stock-store-house'

    constructor(private readonly stockSHInputRepository: StockSHInputRepository) { }

    public async getAllInputs(): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.findAll()
    }
    public async getAllInputsPending(): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.getAllSHInputsPending()
    }
    public async getAllInputsByFolio(): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.getInputsByFolio()
    }
    public async getInputsByFolio(folio: string): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.getInputsByOneFolio(folio)
    }
    public async startReadyToAccommodate(): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.findAllItems({status: true,  in_storehouse:true})
    }
    public async getInputs(): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.getAllSHInputs()
    }

    public async getInputsPending(SH_id: string): Promise<SHProductInput[]> {
        return this.stockSHInputRepository.getAllSHInputs()
    }

    
    public async createInput(body:object): Promise<SHProductInput> {
        return this.stockSHInputRepository.createOne({...body})
    }
    public async updateInputStorehouse(id:string, updated: any): Promise<SHProductInput> {
        return this.stockSHInputRepository.updateOne(id,{...updated})
    }
    

}


