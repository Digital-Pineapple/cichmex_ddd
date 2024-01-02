import { Model } from 'mongoose';
import {  StockInputRepository as StockInputConfig } from '../../../domain/stockBranch/StockBranchRepository';
import { MongoRepository } from '../MongoRepository';



export class StockInputRepository extends MongoRepository implements  StockInputConfig {
  
    constructor(protected StockInputModel: Model<any>) {
      super (StockInputModel)
    }
  
    async getAllInputssInBranch(branchId: string): Promise<any[]> {
      return await this.findAll(branchId)
    }
  
  }