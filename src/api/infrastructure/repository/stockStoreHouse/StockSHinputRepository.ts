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
          createdAt : '$createdAt',
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
    ])
  }





}

