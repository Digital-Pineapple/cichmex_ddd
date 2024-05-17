import mongoose, { model, Schema } from "mongoose";
import { SHProductOutput } from '../../../domain/storehouse/stockStoreHouseEntity';



const StockSHoutputChema = new Schema<SHProductOutput>({
  SHStock_id: {
    type: mongoose.Types.ObjectId, ref: 'StoreHouseStocks',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  newQuantity: {
    type: Number,
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


const StockSHoutputModel = model<Document & SHProductOutput>(
  'SHStockOutputs',
  StockSHoutputChema
);

export default StockSHoutputModel;
