import mongoose, {model, Schema } from "mongoose";
import { StockBranchEntity } from '../../domain/stockBranch/StockBranchEntity';


import MongooseDelete = require("mongoose-delete");

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
          required:true,
      },
    },
     
    {
        timestamps: true,
        versionKey: false
    }
  );

  BranchOfficeSchema.plugin(MongooseDelete, { overrideMethods :true });

const StockBranchModel = model<Document & StockBranchEntity>(
  'StockInBranch',
  BranchOfficeSchema
);

export default StockBranchModel;

