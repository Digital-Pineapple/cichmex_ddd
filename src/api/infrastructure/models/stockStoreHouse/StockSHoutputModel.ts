import mongoose, { model, Schema } from "mongoose";
import { SHProductOutput } from '../../../domain/storehouse/stockStoreHouseEntity';


import MongooseDelete = require("mongoose-delete");

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
},
  {
    timestamps: true,
    versionKey: false
  }
);
StockSHoutputChema.plugin(MongooseDelete, { overrideMethods: true });

const StockSHoutputModel = model<Document & SHProductOutput>(
  'SHStockOutputs',
  StockSHoutputChema
);

export default StockSHoutputModel;
