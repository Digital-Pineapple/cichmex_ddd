import mongoose, {model, Schema } from "mongoose";
import { IProductOutput,  } from '../../../domain/stockBranch/StockBranchEntity';


import MongooseDelete = require("mongoose-delete");

const StockOutputSchema = new Schema<IProductOutput> ({
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
},
  {
      timestamps: true,
      versionKey: false
  }
);
StockOutputSchema.plugin(MongooseDelete, { overrideMethods :true });

const StockOutputModel = model<Document & IProductOutput>(
  'StockOutputs',
  StockOutputSchema
);

export default StockOutputModel;