import { Model } from 'mongoose';
import {  StockOutputRepository as StockInventoryConfig } from '../../../domain/stockBranch/StockBranchRepository';
import { MongoRepository } from '../MongoRepository';
import { IProductOutput } from '../../../domain/stockBranch/StockBranchEntity';



export class StockOutputRepository extends MongoRepository implements  StockInventoryConfig {
  
    constructor(protected StockOutputModel: Model<any>) {
      super (StockOutputModel)
    }
  
    async getAllOutputsInBranch(branchId: string): Promise<any[]> {
      return await this.findAll(branchId)
    }
  
  }