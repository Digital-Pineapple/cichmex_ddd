import { Model } from 'mongoose';
import { StockSHInputRepository as StockInputConfig } from '../../../domain/storehouse/stockStoreHouseRepository';
import { MongoRepository } from '../MongoRepository';
import { SHProductInput } from '../../../domain/storehouse/stockStoreHouseEntity';



export class StockSHinputRepository extends MongoRepository implements StockInputConfig {

  constructor(protected StockInputModel: Model<any>) {
    super(StockInputModel)
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

  async getAllSHInputs(): Promise<SHProductInput[]> {
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
      {
        $lookup: {
          from: "variant-products",  // Quitar el signo de dólar
          localField: "SHStock.variant_id",
          foreignField: "_id",
          as: "variant"
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

