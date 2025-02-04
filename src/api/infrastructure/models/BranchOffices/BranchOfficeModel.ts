import mongoose, { model, Mongoose, Schema } from "mongoose";
import { BranchOfficeEntity, ILocation, ISchedules } from '../../../domain/branch_office/BranchOfficeEntity';
import { ProductImageEntity } from "../../../domain/product/ProductEntity";

enum TypeBranch {
  CARWASH = "carwash",
  DELIVERYPOINT = "deliverypoint",
}

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
const BranchOfficeImageSchema = new Schema<ProductImageEntity>(
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
const BranchOfficeSchema = new mongoose.Schema<BranchOfficeEntity>(
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
    activated: {
      type: Boolean,
      default: false
    },
    phone_number: {
      type: String,
      required: false,
    },
    images: [BranchOfficeImageSchema],
    type: {
      type: String,
      enum: [TypeBranch.CARWASH, TypeBranch.DELIVERYPOINT],  
      required: true,
    },
    schedules: {
      type: Array,      
      required: false,
    },
    opening_time: {
      type: String,
      required: false,
    },
    closing_time: {
      type: String,
      required: false
    },
    location: {type:locationSchema},
    services: {
      type: Array,
      required: false
    },
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


const BranchOfficeModel = mongoose.model<BranchOfficeEntity>(
  'BranchOffices',
  BranchOfficeSchema
);

export default BranchOfficeModel;

