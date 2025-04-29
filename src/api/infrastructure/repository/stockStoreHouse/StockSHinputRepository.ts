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
  async getInputsByOneFolio(folio: string): Promise<any[]> {
    return await this.StockInputModel.aggregate([
      // 1. Filtrar por folio
      { $match: { folio: folio } },
  
      // 2. Normalizar product_detail (para ambos formatos)
      {
        $addFields: {
          productId: {
            $cond: [
              { $eq: [{ $type: "$product_detail" }, "object"] },
              "$product_detail._id",
              { $toObjectId: "$product_detail" }
            ]
          },
          
        }
      },
  
      // 3. Buscar detalles completos del producto (si product_detail era solo ID)
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetailLookup"
        }
      },
      { $unwind: { path: "$productDetailLookup", preserveNullAndEmptyArrays: true } },
  
      // 4. Crear campo unificado de producto
      
  
      // 5. Buscar ubicación en sections
      {
        $lookup: {
          from: "sections",
          let: {
            productId: "$productId",
          },
          pipeline: [
            { $unwind: "$stock" },
            {
              $match: {
                $expr: {
                      $or: [
                        { $eq: ["$stock.product", "$productId"] },
                        { $eq: ["$stock.variant", "$productId"] }
                      ]
                    }
                  
                
              }
            },
            // Buscar detalles del pasillo
            {
              $lookup: {
                from: "aisles",
                localField: "aisle",
                foreignField: "_id",
                as: "aisleDetails"
              }
            },
            { $unwind: "$aisleDetails" },

          ],
          as: "locationInfo"
        }
      },
      { $unwind: { path: "$locationInfo", preserveNullAndEmptyArrays: true } },
  
      // 6. Formatear el resultado final
      {
        $project: {
          _id: 1,
          folio: 1,
          SHStock_id: 1,
          quantity: 1,
          newQuantity: 1,
          status: 1,
          responsible: 1,
          user_received: 1,
          product_detail: "$finalProductDetail",
          in_storehouse: 1,
          in_section: 1,
          createdAt: 1,
          updatedAt: 1,
          date_received: 1,
          notes: 1,
          quantity_received: 1,
          product_id: "$productId",
          location: "$locationInfo",
        }
      },
  
      // 7. Agrupar por folio
      {
        $group: {
          _id: "$folio",
          in_storehouse: { $addToSet: "$in_storehouse" },
          responsible: { $addToSet: "$responsible" },
          user_received: { $addToSet: "$user_received" },
          createdAt: { $addToSet: "$createdAt" },
          date_received: { $addToSet: "$date_received" },
          inputs: { $push: "$$ROOT" }
        }
      }
    ]);
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

