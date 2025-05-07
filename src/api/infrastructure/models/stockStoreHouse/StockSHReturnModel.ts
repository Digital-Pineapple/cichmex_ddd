import { UserEntity } from './../../../domain/user/UserEntity';
import mongoose, {model, Schema } from "mongoose";
import { SHProductReturn } from '../../../domain/storehouse/stockStoreHouseEntity';


const StockSHReturnSchema = new Schema<SHProductReturn> ({
    folio:{
      type: String,
      required: false,
    },

  order_id: {
      type: String,
  },
  SHStock_id: {
      type: mongoose.Types.ObjectId,
      ref: 'stockstorehouses',
  },
  quantity: {
      type: Number,
      required: true,
  },
  newQuantity: {
      type: Number,
      required: true,
  },

  user_received: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
  },

  user_delivery: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
  },
  responsible: {
      type: Object,
  },
  product_detail: {
      type: Object,
  },
  reason: {
      type: String,
      required: false,
  },
  status: {
      type: Boolean,
      default: true,
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


