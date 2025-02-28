import mongoose, { Model } from 'mongoose';
import { aisleRepository as AisleConfig} from '../../../domain/warehouse/aisleRepository';
import { MongoRepository } from '../MongoRepository';
import { IAisle } from '../../../domain/warehouse/aisleEntity';



export class AisleRepository extends MongoRepository implements AisleConfig {

    constructor(protected AisleModel: Model<any>) {
        super(AisleModel)
    }

    public async getAllDetailAisle(id: string): Promise<IAisle | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID no válido');
        }
    
        const objectId = new mongoose.Types.ObjectId(id);
    
        const result = await this.AisleModel.aggregate([
            { $match: { _id: objectId } },
            { 
                $lookup: { 
                    from: "zones", 
                    localField: "zone", 
                    foreignField: "_id", 
                    as: "zone" 
                } 
            },
            { 
                $lookup: { 
                    from: "sections", 
                    localField: "_id", 
                    foreignField: "aisle", 
                    as: "sections" 
                } 
            },
            { $unwind: { path: "$zone", preserveNullAndEmptyArrays: true } } // Opcional: si zona siempre es única
        ]);
    
        return result.length > 0 ? result[0] : null;
    }
    

}