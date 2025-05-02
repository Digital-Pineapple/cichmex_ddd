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
          variantId: {
            $cond: [
              { $ifNull: ["$variant", false] },
              {
                $cond: [
                  { $eq: [{ $type: "$variant" }, "object"] },
                  "$variant._id",
                  { $toObjectId: "$variant" }
                ]
              },
              null
            ]
          }
        }
      },
  
      // 3. Buscar detalles completos del producto
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetailLookup"
        }
      },
      { $unwind: { path: "$productDetailLookup", preserveNullAndEmptyArrays: true } },
  
      // 5. Crear campos unificados
      {
        $addFields: {
          finalProductDetail: {
            $cond: [
              { $eq: [{ $type: "$product_detail" }, "object"] },
              "$product_detail",
              "$productDetailLookup"
            ]
          },
        }
      },
      { $unwind: { path: "$finalProductDetail", preserveNullAndEmptyArrays: true } },

  
      // 6. Buscar ubicaciones (versión corregida para LocationProductEntity)
      {
        $lookup: {
          from: "locationproducts",
          let: {
            isVariant: {
              $gt: [
                { $strLenCP: { $ifNull: ["$finalProductDetail.product_id", ""] } },
                0
              ]
            },
            productId: {
              $cond: {
                if: {
                  $gt: [
                    { $strLenCP: { $ifNull: ["$finalProductDetail.product_id", ""] } },
                    0
                  ]
                },
                then: { $toObjectId: "$finalProductDetail.product_id" },
                else: { $toObjectId: "$finalProductDetail._id" }  // si es producto único
              }
            },
            variantId: {
              $cond: {
                if: {
                  $gt: [
                    { $strLenCP: { $ifNull: ["$finalProductDetail.product_id", ""] } },
                    0
                  ]
                },
                then: { $toObjectId: "$finalProductDetail._id" },  // es variante
                else: null  // producto único, no hay variante
              }
            }
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$product", "$$productId"] },
                    { $eq: ["$variant", "$$variantId"] }
                  ]
                }
              }
            }
          ],
          as: "locationInfo"
        }
      },
      { $unwind: { path: "$locationInfo", preserveNullAndEmptyArrays: true } },      
      
  
      // 7. Formatear el resultado final
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
          product_id: "$finalProductDetail.product_id",
          variant_id: "$finalProductDetail._id",
          location:"$locationInfo", 
          location_id: "$locationInfo._id",
        }
      },
  
      // 8. Eliminar duplicados (si los hay)
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      },
      
      // 9. Agrupar por folio (opcional - solo si necesitas esta estructura)
      {
        $group: {
          _id: "$folio",
          in_storehouse: { $first: "$in_storehouse" },
          responsible: { $first: "$responsible" },
          user_received: { $first: "$user_received" },
          createdAt: { $first: "$createdAt" },
          date_received: { $first: "$date_received" },
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

