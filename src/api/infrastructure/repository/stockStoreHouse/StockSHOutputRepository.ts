import { Model } from 'mongoose';
import {  StockSHOutputRepository as StockSHInventoryConfig } from '../../../domain/storehouse/stockStoreHouseRepository';
import { MongoRepository } from '../MongoRepository';



export class StockSHOutputRepository extends MongoRepository implements  StockSHInventoryConfig {
  
    constructor(protected StockSHoutputModel: Model<any>) {
      super (StockSHoutputModel)
    }
  
    async getAllOutputs(): Promise<any[]> {
      return await this.findAll()
    }
    async findStockByStoreHouse(branchId: string): Promise<any[] | null> {
      return await this.MODEL.findById(branchId)
    }
  
  
  }
 