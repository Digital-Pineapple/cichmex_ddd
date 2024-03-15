import mongoose, {model, Schema } from "mongoose";
import { BranchOfficeEntity, ILocation } from '../../../domain/branch_office/BranchOfficeEntity';


import MongooseDelete = require("mongoose-delete");


const IlocationSchema = new mongoose.Schema<ILocation>(
    {
       state_id:{
        type: String,
        required:false
       },
       state: {
        type: String,
        required:false,
      },
      municipality_id:{
        type:String,
        required:false

      },
      municipality: {
        type: String,
        required:false,
      },
      lat:{
        type:Number,
        required:false
      },
      lgt:{
        type:Number,
        required:false,
      },
      direction:{
        type:String,
        required:true,
      }
   
     
    },
    {
      versionKey: false,
    }
  );
  const BranchOfficeSchema = new mongoose.Schema<BranchOfficeEntity>(
    {
       user_id: {
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'User'
      },
      name: {
        type: String,
        required:true,
      },
      description:{
          type:String,
          required:false,
      },
      activated:{
          type:Boolean,
          default:false
      },
      phone_number:{
        type:String,
        required:false,
      },
      images:{
        type : Array,
        required:false,
      },
      opening_time:{
        type:String,
        required:false,
      },
      closing_time:{
        type:String,
        required:false
      },
      location:IlocationSchema,
      services :{
        type: Array,
        required:false
      }
     
    },
    {
      versionKey: false,
      timestamps:true
    }

  );

  BranchOfficeSchema.plugin(MongooseDelete, { deletedAt:true });

const BranchOfficeModel = model<Document & BranchOfficeEntity>(
  'BranchOffices',
  BranchOfficeSchema
);

export default BranchOfficeModel;

