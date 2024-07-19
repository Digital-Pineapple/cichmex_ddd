import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { CategoriesRepository as CategoryConfig } from '../../../domain/category/CategoriesRepository'

import { MongoRepository } from '../MongoRepository';
import { Category } from '../../../domain/category/CategoryEntity';


export class CategoryRepository extends MongoRepository implements CategoryConfig {
    

    constructor(protected CategoryModel: Model<any>) {
        super(CategoryModel);
    }

    async findOneCategory(query: Object): Promise<Category | null> {
        return await this.findOneItem(query);
    }

    async findByEmailCategory(email: String): Promise<Category | null> {
        return await this.findOneItem({ email });
    }

    async findByIdCategory(_id: String): Promise<Category | null> {
        return await this.findById(_id);
    }
    async findAndUpdateCategory(_id: String, updated: object): Promise<Category | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllCategorys(): Promise<Category[] | null> {
        return await this.findAll();
    }

    async createOneCategory(body: Object): Promise<Category | null> {
        return await this.createOne(body);
    }
    async searchCategory(body: Object): Promise<Category| null> {
        return await this.createOne(body);
    }

    async findCategoriesAndSubCategories (): Promise<Category[]  | null>{
        const result = await this.MODEL.aggregate([
            { $lookup: { from: "subcategories", localField: "_id", foreignField: "category_id", as: "SubCategories" } },
          ]);
          return result;
    }
    async findCategoriesAndProducts (storehouse: string): Promise<Category[]  | null>{
        const storehouseId = new ObjectId(storehouse);       
        const result = await this.MODEL.aggregate([
            { $limit: 4 },
            {
              $lookup: {                
                from: "products",
                let: { categoryId: '$_id'},                                           
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$category', '$$categoryId'] },
                      status: true
                    }
                  },
                  { $limit: 10 },
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
                    }
                  },
                  {
                    $addFields: {
                      stock: { $arrayElemAt: ['$stock.stock', 0] } // Obtener el campo 'stock' del array resultante
                    }
                  }
                ],
                as: "products"
              }
            }
          ]);
                 
          return result;
    }
   async findProductsByCategory(category_id: any, storehouse:any): Promise<Category[] | null> {
    const storehouseId = new ObjectId(storehouse);  
    const result = await this.MODEL.aggregate([
      { $match: { _id: category_id } }, // Filtro por el ID de la categoría
      {
        $lookup: {
          from: 'products', // Nombre de la colección de productos
          let: { categoriaId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$category', '$$categoriaId'] },
                status: true
              }
            },
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
              }
            },
            {
              $addFields: {
                stock: { $arrayElemAt: ['$stock.stock', 0] } // Obtener el campo 'stock' del array resultante
              }
            }
          ],
          as: 'products'
      }
      }])

    return result;
   }

}
 


 