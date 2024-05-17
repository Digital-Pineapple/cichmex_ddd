import mongoose, {model, mongo,  } from "mongoose";
import { ServicesInBranchEntity } from "../../../domain/servicesInBranch/servicesInBranchEntity";


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
      },
      status:{
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


const ServicesInBranchModel = model<ServicesInBranchEntity>(
  'ServicesInBranch',
  ServicesInBranchSchema
);

export default ServicesInBranchModel;

