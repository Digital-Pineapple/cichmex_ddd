import mongoose, { model, Schema } from "mongoose";
import { RegionEntity } from "../../../domain/regions/RegionEntity";

// Definir el esquema de Mongoose
const RegionSchema = new Schema<RegionEntity>({
    _id:{
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    name:{
        type:String,
        required:true,
    },
    regionCode:{
        type:String,
        required:true
    },
    type: {
      type: String,
      enum: ['polygon', 'circle', 'rectangle'],  // Restringe los tipos
      required: true
    },
    path: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    ], 
    radius: {
      type: Number,
      required:false
    },
    center: {
      lat: {
        type: Number,
        required:false
      },
      lng: {
        type: Number,
        required:false
        
      }
    },
    status:{
        type: Boolean,
        default: true,
    }
   
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
  
 
const RegionModel = model<RegionEntity>(
    'Regions',
    RegionSchema
  );
  
  export default RegionModel;