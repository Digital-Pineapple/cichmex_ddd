import mongoose, { model, Schema } from "mongoose";
import { SHProductInput } from '../../../domain/storehouse/stockStoreHouseEntity';



const StockSHinputSchema = new Schema<SHProductInput>({
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


const StockSHinputModel = model<SHProductInput>(
  'SHStockInputs',
  StockSHinputSchema
);

export default StockSHinputModel;

