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

  async getInputsByFolio(): Promise<SHProductInput[]> {
    return await this.StockInputModel.aggregate([
      {
        $group: {
          _id: "$folio",
          in_storehouse: { $first: "$in_storehouse" },
          in_section: { $addToSet: "$in_section" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $project: {
          _id: 1,
          in_storehouse: 1,
          createdAt: 1,
          in_section: {
            $cond: {
              if: { $gt: [{ $size: "$in_section" }, 0] }, // Si el array tiene elementos
              then: { $allElementsTrue: ["$in_section"] }, // Verifica si todos son true
              else: false // Si está vacío, devuelve false
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])
  }
  async getInputsByOneFolio(folio: string): Promise<SHProductInput[]> {
    return await this.StockInputModel.aggregate([
      { $match: { folio: folio } },
      {
        $group: {
          _id: "$folio",
          in_storehouse: { $addToSet: "$in_storehouse" }, // Agrupa valores únicos
          responsible: { $addToSet: "$responsible" }, // Agrupa valores únicos
          user_received: { $addToSet: "$user_received" }, // Agrupa valores únicos
          createdAt: { $addToSet: "$createdAt" }, // Agrupa valores únicos
          date_received: { $addToSet: "$date_received" }, // Agrupa valores únicos
          inputs: { $push: "$$ROOT" },
        }
      },
      {
        $sort: { "createdAt": -1 }
      }
    ])
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
          createdAt: '$createdAt',
          quantity_received: '$quantity_received',
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

  async getAllSHInputsPending(): Promise<SHProductInput[]> {
    return await this.MODEL.aggregate([
      { $match: { in_storehouse: false } },
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
          createdAt: '$createdAt',
          in_storehouse: "$in_storehouse",
          notes: "$notes",
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

