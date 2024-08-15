import { Model } from 'mongoose';
import {  StockSHOutputRepository as StockSHInventoryConfig } from '../../../domain/storehouse/stockStoreHouseRepository';
import { MongoRepository } from '../MongoRepository';
import { SHProductOutput } from '../../../domain/storehouse/stockStoreHouseEntity';



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
    async findStockByStoreHouseNoDetail(branchId: string): Promise<any[] | null> {
      return await this.MODEL.findById(branchId)
    }

    async getAllSHOutputs(): Promise<SHProductOutput[]> {
      return await this.MODEL.aggregate([
        {
          $lookup: {
            from: 'storehousestocks',
            localField: 'SHStock_id',
            foreignField: '_id',
            as: 'SHStock'
          }
        },
        { $unwind: "$SHStock" },
        {
          $lookup: {
            from: "products",  // Quitar el signo de dólar
            localField: "SHStock.product_id",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,  // Opcional: Excluye el _id del resultado
            product_name: "$product.name", // Cambiar 'producto' a 'product'
            tag:"$product.tag",
            folio:"$folio",
            quantity: "$quantity",
            newQuantity: "$newQuantity",
            nowStock: "$SHStock.stock",
            responsible: "$responsible.fullname",
            date: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$createdAt",
                timezone: "America/Mexico_City"  // Convierte a la zona horaria de Ciudad de México
              }
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])
    }
  
  
  
  }
 