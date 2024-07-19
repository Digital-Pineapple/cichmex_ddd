import { Model } from 'mongoose';
import {  StockStoreHouseRepository as StockSHConfig } from '../../../domain/storehouse/stockStoreHouseRepository';
import { MongoRepository } from '../MongoRepository';
import ProductModel from '../../models/products/ProductModel';


 interface IPopulateProducts {
  path : string;
  select : string[];
  model : any  
}

const PopulateProduct : IPopulateProducts={
  path: 'product_id',
  select: ["name", "price", "tag", "size", "weight" ],
  model: ProductModel
}


export class StockStoreHouseRepository extends MongoRepository implements  StockSHConfig {
  
    constructor(protected StockBranchModel: Model<any>) {
      super (StockBranchModel)
    }
  
    async findStockByStoreHouse(branchId: string, populateConfig1?:any): Promise<any[]> {
      return await this.StockBranchModel.find({StoreHouse_id:branchId}).populate(PopulateProduct)
    }

    async findStockByStoreHouseNoDetail(branchId: string): Promise<any[]> {
      return await this.StockBranchModel.find({StoreHouse_id:branchId})
  
    }
  }
  
  