import mongoose, {model, Schema } from "mongoose";
import { IProductInput, IProductOutput } from '../../../domain/stockBranch/StockBranchEntity';

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

const StockInputModel = model<IProductInput>(
  'StockInputs',
  StockInputSchema
);

export default StockInputModel;
