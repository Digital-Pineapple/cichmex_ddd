import mongoose, { model, Schema } from "mongoose";
import { ImageEntity, storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';
import { ILocation } from "../../../domain/branch_office/BranchOfficeEntity";



const locationSchema = new mongoose.Schema<ILocation>(

  {
    
    state_id: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    municipality_id: {
      type: String,
      required: false
    },
    municipality: {
      type: String,
      required: false
    },
    neighborhood:{
      type: String,
      required: false
    },
    lat: {
      type: Number,
      required: false
    },
    lgt: {
      type: Number,
      required: false
    },
    direction: {
      type: String,
      required: true
    },    
    cp:{
      type:String,
      required:false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);
const ImageSchema = new Schema<ImageEntity>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId
    },
    url: {
      type: String,
      required: false
    },   
  },
  {
    versionKey: false,
    timestamps: true,
  }

)
const StoreHouseSchema = new mongoose.Schema<storeHouseEntity>(
    {
      
      user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
      phone_number : {
        type: String,
        required: false,
      },
      images: [ImageSchema],
      location: {type:locationSchema},
      status: {
        type:Boolean,
        required:false,
        default:true,
      }, 
      tag: {
        type: String,
        required: false,       
      }   
    
    },
    {
      versionKey: false,
      timestamps: true
    }
  

);


export const StoreHouseModel = model<storeHouseEntity>(
    'StoreHouses',
    StoreHouseSchema
);



