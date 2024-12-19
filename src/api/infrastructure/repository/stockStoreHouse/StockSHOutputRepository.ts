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
            from: "products", // Asegúrate de que el nombre de la colección sea correcto
            localField: "SHStock.product_id",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $lookup: {
            from: "variant-products", // Cambia a plural si el nombre de la colección lo requiere
            localField: "SHStock.variant_id",
            foreignField: "_id",
            as: "variant"
          }
        },
        { $unwind: { path: "$variant", preserveNullAndEmptyArrays: true } }, // Evita errores si no hay variante
        {
          $project: {
            _id: 0, // Excluye el _id si no lo necesitas
            product_name: {
              $concat: [
                "$product.name",
                " - ",
                { $ifNull: ["$variant.attributes.size", ""] },
                " - ",
                { $ifNull: ["$variant.attributes.color", ""] }
              ]
            },
            tag: "$product.tag",
            folio: "$folio",
            quantity: "$quantity",
            newQuantity: "$newQuantity",
            nowStock: "$SHStock.stock",
            responsible: "$responsible.fullname",
            variant_tag: "$variant.tag",
            date: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$createdAt",
                timezone: "America/Mexico_City"
              }
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ]);
    }
    
  
  
  
  }
 