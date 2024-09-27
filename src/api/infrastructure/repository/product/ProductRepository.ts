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
    
    
   async  findDetailProductById(id:string, populateCofig1?:any, populateConfig2?:any, populateConfig3?:any): Promise<ProductEntity| ErrorHandler | null> {
    return await this.MODEL.findById(id).populate(populateCofig1).populate(populateConfig2).populate(populateConfig3)
    // return await this.MODEL.aggregate([
        
    // ]).
   }

    async findSearchProducts(search: string, page: number): Promise<any> {
    // Clean up the search term by removing special characters
    const noSpecialCharacters = search.replace(
      /[`~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/]/gi,
      ""
    );
  
    const storehouseId = new ObjectId(this.onlineStoreHouse);
    const PAGESIZE = 30; 
    // Use aggregation to find products and join with the storehouse
    const result = await this.MODEL.aggregate([
      {
        $match: {
          // Find products that match the search criteria
          slug: { $regex: ".*" + noSpecialCharacters + ".*", $options: "i" },
        },
      },
      {
        // Join with the storehouse data
        $lookup: {
          from: "storehousestocks", // The collection containing storehouse stocks
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$product_id", "$$productId"] }, // Match product ID
                    { $eq: ["$StoreHouse_id", storehouseId] }, // Match specific storehouse ID
                  ],
                },
              },
            },
          ],
          as: "storehouseStock", // Alias for the joined data
        },
      },
      {
        // Optionally, you can add fields or transform data here
        $addFields: {
        //   stock: { $arrayElemAt: ["$storehouseStock.stock", 0] }, // Extract stock value if needed
        stock: { $ifNull: [{ $arrayElemAt: ['$storehouseStock.stock', 0] }, 0] } // Obtener el campo 'stock' del array resultante
        },
      },
      {
        $facet: {
          products: [ { $skip: (page - 1) * PAGESIZE }, // Obtener productos para la página actual
            { $limit: PAGESIZE },],
          total: [{$count: "total"}],
        }
      }
    ]);
  
    return {
      products: result[0].products,
      total: result[0]?.total[0]?.total || 0
    };
    // return result;
  }

   async findVideoProducts(): Promise<ProductEntity[] | ErrorHandler | null> {
    const result = await this.MODEL.aggregate([
        {$match: {
            status: true,
            videos: { $exists: true, $ne: [] } // Asegura que el campo "video" exista y no sea nulo
        }},
        {$limit: 10}
    ])    
    return result
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

   async findProductsByCategory(categoryId : MongooseObjectId, storehouse: string, page: number = 1 ): Promise<ProductEntity[] | ErrorHandler | null> {
    const storehouseId = new ObjectId(storehouse);
    const PAGESIZE = 30;
    const result = await this.MODEL.aggregate([
        {$match: {
            status: true,
            category: categoryId,
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
    
    return result;

   }

   async findProductsBySubCategory(subcategoryId : MongooseObjectId, storehouse: string, page: number = 1 ): Promise<ProductEntity[] | ErrorHandler | null> {
    const storehouseId = new ObjectId(storehouse);
    const PAGESIZE = 30;
    const result = await this.MODEL.aggregate([
        {$match: {
            status: true,
            subCategory: subcategoryId,
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
    
    return result;

   }

}