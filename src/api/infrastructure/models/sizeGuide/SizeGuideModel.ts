import mongoose, { model, Schema } from "mongoose";
import { SizeGuideEntity } from "../../../domain/sizeGuide/SizeGuideEntity";

// Definir el esquema de Mongoose
const SizeGuideSchema = new Schema<SizeGuideEntity>({
    _id:{
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    name:{
        type:String,
        required:true
    },
    dimensions:[],
    user_id:{
        type: String,
        required: true,
    },
    region:{
        type: String,
        default:'Mx'
    },
    unit:{
        type:String,
        default: 'cm'
    },
    typePackage:{
        type:String,
        required: false,
    },
    status:{
        type: Boolean,
        default: true,
    },
    type:{
        type: String,
        required: true
    }
   
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
  
 
const SizeGuideModel = model<SizeGuideEntity>(
    'sizeguides',
    SizeGuideSchema
  );
  
  export default SizeGuideModel;