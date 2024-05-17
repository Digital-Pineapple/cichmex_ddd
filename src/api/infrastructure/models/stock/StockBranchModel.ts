import mongoose, {model, Schema } from "mongoose";
import { StockBranchEntity, IProductInput, IProductOutput, IProductReturn } from '../../../domain/stockBranch/StockBranchEntity';


  const BranchOfficeSchema = new Schema<StockBranchEntity>(
    {
       branch_id: {
        type: mongoose.Types.ObjectId, ref:"branchOffices",
        required:true,
      },
      product_id: {
        type: mongoose.Types.ObjectId, ref: "products",
        required:true,
      },
      stock:{
          type:Number,
          required:false,
      },
      status:{
        type:Boolean,
        required:false,
        default:true,
      }
      
    },
     
    {
        timestamps: true,
        versionKey: false
    }
  );


const StockBranchModel = model<StockBranchEntity>(
  'StockInBranches',
  BranchOfficeSchema
);

export default StockBranchModel;

