import mongoose, {model, Schema } from "mongoose";
import { BranchOfficeEntity, ILocation } from '../../domain/branch_office/BranchOfficeEntity';


import MongooseDelete = require("mongoose-delete");


const IlocationSchema = new mongoose.Schema<ILocation>(
    {
       state: {
        type: String,
        required:false,
      },
      municipality: {
        type: String,
        required:false,
      },
      lat:{
        type:String,
        required:false
      },
      lgt:{
        type:String,
        required:false,
      },
      direction:{
        type:String,
        required:true,
      }
   
     
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  const BranchOfficeSchema = new mongoose.Schema<BranchOfficeEntity>(
    {
       customer_id: {
        type: mongoose.Types.ObjectId,
        required:true,
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
          required:true,
      },
      location:IlocationSchema
     
    },
    {
        timestamps: true
    }
  );

  BranchOfficeSchema.plugin(MongooseDelete, { deletedAt:true });

const BranchOfficeModel = model<Document & BranchOfficeEntity>(
  'BranchOffices',
  BranchOfficeSchema
);

export default BranchOfficeModel;

