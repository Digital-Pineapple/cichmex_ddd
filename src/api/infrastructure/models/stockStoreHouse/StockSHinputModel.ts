import mongoose, { model, Schema } from "mongoose";
import { SHProductInput } from '../../../domain/storehouse/stockStoreHouseEntity';


import MongooseDelete = require("mongoose-delete");
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
},
  {
    timestamps: true,
    versionKey: false
  }
);
StockSHinputSchema.plugin(MongooseDelete, { overrideMethods: true });

const StockSHinputModel = model<Document & SHProductInput>(
  'SHStockInputs',
  StockSHinputSchema
);

export default StockSHinputModel;

