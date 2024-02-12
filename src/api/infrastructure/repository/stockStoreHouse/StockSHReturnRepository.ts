import { Model } from 'mongoose';
import {  StockBranchRepository as StockInventoryConfig } from '../../../domain/stockBranch/StockBranchRepository';
import { MongoRepository } from '../MongoRepository';



export class StockSHReturnRepository extends MongoRepository implements  StockInventoryConfig {
  
    constructor(protected StockBranchModel: Model<any>) {
      super (StockBranchModel)
    }
  
    async getAllStock(branchId: string): Promise<any[]> {
      return await this.findStockByBranch(`branch_id : ${branchId}`);
    }
    async findStockByStoreHouse(branchId: string): Promise<any[] | null> {
      return await this.MODEL.findById(branchId)
    }
  
  }
