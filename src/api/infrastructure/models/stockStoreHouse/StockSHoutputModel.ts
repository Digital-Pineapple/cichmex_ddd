import mongoose, { model, Schema } from "mongoose";
import { SHProductOutput } from '../../../domain/storehouse/stockStoreHouseEntity';


const StockSHoutputChema = new Schema<SHProductOutput>({
  folio:{
    type:String,
    required:false
  },
  order_id: {
    type: String,
    required: true,
  },
  SHStock_id: {
    type: mongoose.Types.ObjectId,
    ref: 'StoreHouseStocks',
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
  status: {
    type: Boolean,
    required: false,
    default: true,
  },
  responsible: {
    type: Object,
    required: false,

  },
  reason: {
    type: String,
    required: false,
  },
  user_received: {
    type: String,
    required: false,
  },
  user_delivery: {
    type: String,
    required: false
  },
  product_detail: {
    type: Object,
    required: true,
  }
},
  {
    timestamps: true,
    versionKey: false
  }
);

const StockSHoutputModel = model< SHProductOutput>(
  'SHStockOutputs',
  StockSHoutputChema
);

export default StockSHoutputModel;
