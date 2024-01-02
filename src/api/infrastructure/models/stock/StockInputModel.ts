import mongoose, {model, Schema } from "mongoose";
import { IProductInput, IProductOutput } from '../../../domain/stockBranch/StockBranchEntity';


import MongooseDelete = require("mongoose-delete");
const StockInputSchema = new Schema<IProductInput> ({
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
StockInputSchema.plugin(MongooseDelete, { overrideMethods :true });

const StockInputModel = model<Document & IProductInput>(
  'StockInputs',
  StockInputSchema
);

export default StockInputModel;
