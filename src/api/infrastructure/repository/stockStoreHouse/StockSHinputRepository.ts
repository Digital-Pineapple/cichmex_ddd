import { Model } from 'mongoose';
import {  SHProductInput as StockInputConfig } from '../../../domain/storehouse/stockStoreHouseEntity';
import { MongoRepository } from '../MongoRepository';



export class StockSHinputRepository extends MongoRepository implements  StockInputConfig {
  
    constructor(protected StockInputModel: Model<any>) {
      super (StockInputModel)
    }
  
    async getAllSHInputsInBranch(branchId: string): Promise<any[]> {
      return await this.findAll(branchId)
    }
    async findStockByStoreHouse(branchId: string): Promise<any[] | null> {
      return await this.MODEL.findById(branchId)
    }
    async findStockByStoreHouseNoDetail(branchId: string): Promise<any[] | null> {
      return await this.MODEL.findById(branchId)
    }
  

  }

