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
    async findAllInputs(): Promise<any[]> {
      const result = await this.MODEL.aggregate([
        { $lookup: { from: "shstockinputs", localField: "_id", foreignField: "SHStock_id", as: "Inputs" } },
        { $lookup: { from: "products", localField: "product_id", foreignField: "_id", as :'product' } },
      ]);
      return result;
    }

    async findAllOutputs(): Promise<any[]> {
      const result = await this.MODEL.aggregate([
        { $lookup: { from: "shstockoutputs", localField: "_id", foreignField: "SHStock_id", as: "Outputs" } },
        { $lookup: { from: "products", localField: "product_id", foreignField: "_id", as :'product' } },
      ]);
      return result;
    }


  }
  
  