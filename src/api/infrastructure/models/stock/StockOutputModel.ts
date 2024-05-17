import mongoose, {model, Schema } from "mongoose";
import { IProductOutput,  } from '../../../domain/stockBranch/StockBranchEntity';


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


const StockOutputModel = model< IProductOutput>(
  'StockOutputs',
  StockOutputSchema
);

export default StockOutputModel;