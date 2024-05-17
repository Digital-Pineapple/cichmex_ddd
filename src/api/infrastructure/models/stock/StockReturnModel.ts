import mongoose, {model, Schema } from "mongoose";
import { StockBranchEntity, IProductReturn } from '../../../domain/stockBranch/StockBranchEntity';


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
  'StockReturns',
  StockReturnSchema
);

export default StockBranchModel;
