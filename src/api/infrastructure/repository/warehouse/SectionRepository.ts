import mongoose, { Model } from 'mongoose';
import { sectionRepository as SectionConfig} from '../../../domain/warehouse/sectionRepository';
import { MongoRepository } from '../MongoRepository';
import { ISection } from '../../../domain/warehouse/sectionEntity';



export class SectionRepository extends MongoRepository implements SectionConfig {

    constructor(protected SectionModel: Model<any>) {
        super(SectionModel)
    }


public async findProductInSections(productId: string) : Promise<ISection[] | null>{
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('ID de producto no válido');
    }
    console.log(productId,'id del producto');
    

    const objectId = new mongoose.Types.ObjectId(productId);

    const result = await this.SectionModel.aggregate([
        { $match: { "stock.product": objectId } }, // Filtrar secciones que contienen el producto
        { 
            $lookup: { 
                from: "products", 
                localField: "stock.product", 
                foreignField: "_id", 
                as: "productDetails" 
            } 
        },
        { 
            $lookup: { 
                from: "aisles", 
                localField: "aisle", 
                foreignField: "_id", 
                as: "aisleDetails" 
            } 
        },
        { 
            $lookup: { 
                from: "zones", 
                localField: "aisleDetails.zone", 
                foreignField: "_id", 
                as: "zoneDetails" 
            } 
        },
        { 
            $project: {
                _id: 1,
                name: 1,
                "stock.quantity": 1,
                "productDetails.name": 1,
                "productDetails.sku": 1,
                "aisleDetails.name": 1,
                "zoneDetails.name": 1
            } 
        }
    ]);

    return result;
}


}