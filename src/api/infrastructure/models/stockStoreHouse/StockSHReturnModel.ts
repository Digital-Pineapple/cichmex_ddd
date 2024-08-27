import mongoose, {model, Schema } from "mongoose";
import { SHProductReturn } from '../../../domain/storehouse/stockStoreHouseEntity';


const StockSHReturnSchema = new Schema<SHProductReturn> ({
    SHStock_id:{
        type : mongoose.Types.ObjectId, ref:'StoreHouseStocks',
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
      type    : mongoose.Types.ObjectId,
       ref :'users',
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
 


const StockSHReturnModel = model< SHProductReturn>(
  'SHStockReturns',
  StockSHReturnSchema
);

export default StockSHReturnModel;


