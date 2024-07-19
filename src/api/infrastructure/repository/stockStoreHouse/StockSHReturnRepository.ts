import { Model } from 'mongoose';
import {  StockSHReturnRepository as StockSHReturnConfig } from '../../../domain/storehouse/stockStoreHouseRepository';
import { MongoRepository } from '../MongoRepository';



export class StockSHReturnRepository extends MongoRepository implements  StockSHReturnConfig {
  
    constructor(protected StockBranchModel: Model<any>) {
      super (StockBranchModel)
    }
  
    async getAllStock(branchId: string): Promise<any[]> {
      return await this.findStockByBranch(`branch_id : ${branchId}`);
    }
    async findStockByStoreHouse(branchId: string): Promise<any[] | null> {
      return await this.MODEL.findById(branchId)
    }
    async findStockByStoreHouseNoDetail(branchId: string): Promise<any[] | null> {
      return await this.MODEL.findById(branchId)
    }
  
  }
