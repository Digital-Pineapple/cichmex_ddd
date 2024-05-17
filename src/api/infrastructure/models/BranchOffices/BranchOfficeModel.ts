import mongoose, { model, Mongoose, Schema } from "mongoose";
import { BranchOfficeEntity, ILocation } from '../../../domain/branch_office/BranchOfficeEntity';


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
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

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
    images: {
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

