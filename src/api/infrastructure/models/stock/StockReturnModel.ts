import mongoose, {model, Schema } from "mongoose";
import { StockBranchEntity, IProductReturn } from '../../../domain/stockBranch/StockBranchEntity';


import MongooseDelete = require("mongoose-delete");

const StockReturnSchema = new Schema<IProductReturn> ({
    stock_id:{
        type : mongoose.Types.ObjectId, ref:'stockinbranches',
        required:true,
    },

  quantity: {
      type    : Number,
      required: true,
  },
  newQuantity: {
      type    : Number,
      required: true,
  },
  responsible_id: {
      type    : mongoose.Types.ObjectId, ref :'customers',
      required: true,
  },
},
  {
      timestamps: true,
      versionKey: false
  }
);
 

StockReturnSchema.plugin(MongooseDelete, { overrideMethods :true });

const StockBranchModel = model<Document & StockBranchEntity>(
  'StockReturns',
  StockReturnSchema
);

export default StockBranchModel;
