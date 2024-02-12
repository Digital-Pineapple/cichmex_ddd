import { Model } from 'mongoose';
import {  StockStoreHouseRepository as StockInputConfig } from '../../../domain/storehouse/stockStoreHouseRepository';
import { MongoRepository } from '../MongoRepository';



export class StockSHinputRepository extends MongoRepository implements  StockInputConfig {
  
    constructor(protected StockInputModel: Model<any>) {
      super (StockInputModel)
    }
  
    async getAllSHInputsInBranch(branchId: string): Promise<any[]> {
      return await this.findAll(branchId)
    }
  
  }

