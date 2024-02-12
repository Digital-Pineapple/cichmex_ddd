import { Model } from 'mongoose';
import { SubCategoriesRepository as SubCategoryConfig } from '../../../domain/subCategory/SubCategoriesRepository'
import { ObjectId } from 'mongodb';
import { MongoRepository } from '../MongoRepository';
import { SubCategory } from '../../../domain/subCategory/SubCategoryEntity';


export class SubCategoryRepository extends MongoRepository implements SubCategoryConfig {
    

    constructor(protected SubCategoryModel: Model<any>) {
        super(SubCategoryModel);
    }

    async findOneSubCategory(query: Object): Promise<SubCategory | null> {
        return await this.findOneItem(query);
    }

    async findByIdSubCategory(_id: String): Promise<SubCategory | null> {
        return await this.findById(_id);
    }
    async findAndUpdateSubCategory(_id: String, updated: object): Promise<SubCategory | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllSubCategories(): Promise<SubCategory[] | null> {
        return await this.findAll();
    }

    async createOneSubCategory(body: Object): Promise<SubCategory | null> {
        return await this.createOne(body);
    }
    async searchSubCategory(body: Object): Promise<SubCategory| null> {
        return await this.createOne(body);
    }
    async findProductsBySubCategory(subcat_id: any, storehouse:any): Promise<SubCategory[] | null> {        
        const storehouseId = new ObjectId(storehouse);  
        const result = await this.MODEL.aggregate([
          { $match: { _id: subcat_id } }, // Filtro por el ID de la sucategoría
          {
            $lookup: {
              from: 'products', // Nombre de la colección de productos
              let: { subcat_id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$subCategory', '$$subcat_id'] },
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