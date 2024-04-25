import mongoose, {model, Schema } from "mongoose";
import { SHProductReturn } from '../../../domain/storehouse/stockStoreHouseEntity';


import MongooseDelete = require("mongoose-delete");

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
      type    : mongoose.Types.ObjectId, ref :'users',
      required: true,
  },
},
  {
      timestamps: true,
      versionKey: false
  }
);
 

StockSHReturnSchema.plugin(MongooseDelete, { overrideMethods :true });

const StockSHReturnModel = model<Document & SHProductReturn>(
  'SHStockReturns',
  StockSHReturnSchema
);

export default StockSHReturnModel;


