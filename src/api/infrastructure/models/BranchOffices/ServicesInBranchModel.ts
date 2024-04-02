import mongoose, {model, mongo,  } from "mongoose";
import { ServicesInBranchEntity } from "../../../domain/servicesInBranch/servicesInBranchEntity";


import MongooseDelete = require("mongoose-delete");

  const ServicesInBranchSchema = new mongoose.Schema<ServicesInBranchEntity>(
    {
      branch_id:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'BranchOffices'
      },
      service_id: {
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'Services'
      },
      typeCar_id:{
          type:mongoose.Types.ObjectId,
          required:true,
          ref:'TypeCar'
      },
      price:{
          type:Number,
          required:true
      },
      description:{
        type:String,
        required:false
      }
    },
    {
        timestamps: false
    }
  );

  ServicesInBranchSchema.plugin(MongooseDelete, { overrideMethods:true });

const ServicesInBranchModel = model<Document & ServicesInBranchEntity>(
  'ServicesInBranch',
  ServicesInBranchSchema
);

export default ServicesInBranchModel;

