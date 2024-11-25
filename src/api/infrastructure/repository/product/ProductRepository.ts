import { Model, ObjectId as MongooseObjectId } from 'mongoose';
import { ProductRepository as ProductConfig } from '../../../domain/product/ProductRepository'
import { MongoRepository } from '../MongoRepository';
import { ProductEntity } from '../../../domain/product/ProductEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ObjectId } from 'mongodb';

export class ProductRepository extends MongoRepository implements ProductConfig  {
    private readonly onlineStoreHouse = "662fe69b9ba1d8b3cfcd3634";
    constructor(protected ProductModel: Model<any>) {
        super(ProductModel);
    }

    async findProduct(query: Object): Promise<ProductEntity | null> {
        return await this.findOneItem(query);
    }

    async findAndUpdateProduct(_id: String, updated: object): Promise<ProductEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async AllProducts(): Promise<ProductEntity[] | null> {
        return await this.findAll();
    }

    async createProduct(body: Object): Promise<ProductEntity | null> {
        return await this.createOne(body);
    }
    async updateImagesAndSlug(slug: string, images:[string], _id: string): Promise<ProductEntity | null > {
        return await this.findAndUpdateProduct(_id,{images:images, slug:slug})
    }
    
    async getProductsByCategory(query:any, populateConfig1?:any): Promise<ProductEntity[] | ErrorHandler | null > {
        return await this.MODEL.find({...query}).populate(populateConfig1)
    }
    async startDeleteImageDetail(id: string, imageId: string): Promise<ProductEntity | ErrorHandler | null> {
        try {
            // Busca el producto por su ID
            const product: any = await this.ProductModel.findById(id);
            
            // Verifica si el producto existe
            if (!product) {
                return new ErrorHandler('Product not found', 404);
            }
    
            // Filtra las imágenes y elimina la que coincide con imageId
            const imagesUpdated = product.images.filter((i: any) => !i._id.equals(imageId));
    
            // Actualiza el producto con el nuevo arreglo de imágenes y devuelve el documento actualizado
            const updatedProduct = await this.ProductModel.findOneAndUpdate(
                { _id: id }, 
                { images: imagesUpdated }, 
                { new: true } // Devuelve el producto actualizado
            );
    
            // Retorna el producto actualizado o null si no se encuentra
            return updatedProduct ? updatedProduct : null;
        } catch (error) {
            // Maneja cualquier error inesperado
            return new ErrorHandler('Error while updating product', 500);
        }
    }
    
    async startDeleteVideoDetail(id: string, video_id: string): Promise<ProductEntity | ErrorHandler | null> {
      try {
          // Busca el producto por su ID
          const product: any = await this.ProductModel.findById(id);
          
          // Verifica si el producto existe
          if (!product) {
              return new ErrorHandler('Product not found', 404);
          }
  
          // Filtra las imágenes y elimina la que coincide con imageId
          const videosUpdated = product.videos.filter((i: any) => !i._id.equals(video_id));
  
          // Actualiza el producto con el nuevo arreglo de imágenes y devuelve el documento actualizado
          const updatedProduct = await this.ProductModel.findOneAndUpdate(
              { _id: id }, 
              { videos: videosUpdated }, 
              { new: true } // Devuelve el producto actualizado
          );
  
          // Retorna el producto actualizado o null si no se encuentra
          return updatedProduct ? updatedProduct : null;
      } catch (error) {
          // Maneja cualquier error inesperado
          return new ErrorHandler('Error while updating product', 500);
      }
  }
  
    
   async  findDetailProductById(id:string, populateCofig1?:any, populateConfig2?:any, populateConfig3?:any): Promise<ProductEntity| ErrorHandler | null> {
    return await this.MODEL.findById(id).populate(populateCofig1).populate(populateConfig2).populate(populateConfig3)
    // return await this.MODEL.aggregate([
        
    // ]).
   }

   async findSearchProducts(search: string, page: number): Promise<any> {
    const PAGESIZE = 30;
    const storehouseId = new ObjectId(this.onlineStoreHouse);
  
    // Limpia espacios innecesarios en el término de búsqueda
    const cleanSearch = search.trim().toLocaleLowerCase();    
    
    // Verificar y crear índice de texto si no existe
    const indexes = await this.MODEL.collection.indexes();
    const hasTextIndex = indexes.some(index => Object.values(index.key).includes("text"));

    if (!hasTextIndex) {
      console.log("Creando índice de texto...");
      await this.MODEL.collection.createIndex(
        { name: "text" }, // Ajusta los campos según tu modelo
        // { name: "TextIndex" } // Nombre opcional del índice
      );
    }

  
  //  return 
    const result = await this.MODEL.aggregate([
      {
        $match: { $text: { $search: cleanSearch } }         
      },
      {
        $lookup: {
          from: "storehousestocks",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$product_id", "$$productId"] },
                    { $eq: ["$StoreHouse_id", storehouseId] },
                  ],
                },
              },
            },
          ],
          as: "storehouseStock",
        },
      },
      {
        $addFields: {
          stock: { $ifNull: [{ $arrayElemAt: ["$storehouseStock.stock", 0] }, 0] },
        },
      },
      {
        $facet: {
          products: [
            { $skip: (page - 1) * PAGESIZE },
            { $limit: PAGESIZE },
          ],
          total: [{ $count: "total" }],
        },
      },
    ]);
  
    return {
      products: result[0]?.products || [],
      total: result[0]?.total[0]?.total || 0,
    };
  }
  
  
  
  
  

  async findVideoProducts(): Promise<ProductEntity[] | ErrorHandler | null> {
    const result = await this.MODEL.aggregate([
        {
            $match: {
                status: true,
                videos: { 
                    $exists: true, 
                    $ne: [], 
                    $elemMatch: { type: 'vertical' } 
                }
            }
        },
        { $limit: 10 }
    ]);
    return result;
}


   async findRandomProductsByCategory(categoryId : any, skiproduct:any , storehouse: any ): Promise<ProductEntity[] | ErrorHandler | null> {
    const storehouseId = new ObjectId(storehouse);  
     const result = await this.MODEL.aggregate([
         {$match: {
             status: true,
             category: categoryId,
             _id: { $ne: skiproduct }, 
         }},
         {$sample: {size: 20}},
         {
            $lookup: {
                from: "storehousestocks",
                let: { productId: '$_id' },
                pipeline: [{
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$product_id', '$$productId'] },
                          { $eq: ['$StoreHouse_id', storehouseId] } // Filtrar por el ID de almacén específico
                        ]
                      }
              }}],
                as: "stock"
              },
              
         },
         {
            $addFields: {
              // stock: { $arrayElemAt: ['$stock.stock', 0] } // Obtener el campo 'stock' del array resultante
              stock: { $ifNull: [{ $arrayElemAt: ['$stock.stock', 0] }, 0] } // Obtener el campo 'stock' del array resultante
            }
          }
     ]) 
     return result;
   }

   async findProductsByCategory(categoryId : MongooseObjectId, storehouse: string, qparams: any ): Promise<ProductEntity[] | ErrorHandler | null> {    
     const page = Number(qparams.page) || 1;
     let matchStage: any = {};         
     if(qparams.subcategory){
        matchStage.subCategory = new ObjectId(qparams.subcategory)
     }
     if(qparams.minPrice || qparams.maxPrice) {
      matchStage.price = {};  
      if (qparams.minPrice) {
        matchStage.price.$gte = Number(qparams.minPrice); // Si existe minPrice, lo añadimos
      }    
      if (qparams.maxPrice) {
        matchStage.price.$lte = Number(qparams.maxPrice); // Si existe maxPrice, lo añadimos
      }
     }    
    
    const storehouseId = new ObjectId(storehouse);
    const PAGESIZE = 30;
    const result = await this.MODEL.aggregate([
        {$match: {
            status: true,
            category: categoryId,
            ...matchStage
        }},       
        {
          $lookup: {
              from: "storehousestocks",
              let: { productId: '$_id' },
              pipeline: [{
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$product_id', '$$productId'] },
                        { $eq: ['$StoreHouse_id', storehouseId] } // Filtrar por el ID de almacén específico
                      ]
                    }
            }}],
              as: "stock"
            },           
        },
        {
          $addFields: {
            // stock: { $arrayElemAt: ['$stock.stock', 0] } // Obtener el campo 'stock' del array resultante
            stock: { $ifNull: [{ $arrayElemAt: ['$stock.stock', 0] }, 0] } // Obtener el campo 'stock' del array resultante
          }
        },
        {
          $facet: {
            products: [ { $skip: (page - 1) * PAGESIZE }, // Obtener productos para la página actual
              { $limit: PAGESIZE },],
            total: [{$count: "total"}],
          }
        }
       
    ]) 
    
    return {
      products: result[0].products,
      total: result[0]?.total[0]?.total || 0
    };;

   }

   async findProductsBySubCategory(subcategoryId : MongooseObjectId, storehouse: string, qparams: any ): Promise<ProductEntity[] | ErrorHandler | null> {
    const page = Number(qparams.page) || 1;
    let matchStage: any = {};         

    if(qparams.minPrice || qparams.maxPrice) {
     matchStage.price = {};  
     if (qparams.minPrice) {
       matchStage.price.$gte = Number(qparams.minPrice); // Si existe minPrice, lo añadimos
     }    
     if (qparams.maxPrice) {
       matchStage.price.$lte = Number(qparams.maxPrice); // Si existe maxPrice, lo añadimos
     }
    }    
    const storehouseId = new ObjectId(storehouse);
    const PAGESIZE = 30;
    const result = await this.MODEL.aggregate([
        {$match: {
            status: true,
            subCategory: subcategoryId,
            ...matchStage
        }},       
        {
          $lookup: {
              from: "storehousestocks",
              let: { productId: '$_id' },
              pipeline: [{
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$product_id', '$$productId'] },
                        { $eq: ['$StoreHouse_id', storehouseId] } // Filtrar por el ID de almacén específico
                      ]
                    }
            }}],
              as: "stock"
            },           
        },
        {
          $addFields: {
            // stock: { $arrayElemAt: ['$stock.stock', 0] } // Obtener el campo 'stock' del array resultante
            stock: { $ifNull: [{ $arrayElemAt: ['$stock.stock', 0] }, 0] } // Obtener el campo 'stock' del array resultante
          }
        },
        {
          $facet: {
            products: [ { $skip: (page - 1) * PAGESIZE }, // Obtener productos para la página actual
              { $limit: PAGESIZE },],
            total: [{$count: "total"}],
          }
        }
       
    ]) 
    
    return {
      products: result[0].products,
      total: result[0]?.total[0]?.total || 0
    };

   }

}