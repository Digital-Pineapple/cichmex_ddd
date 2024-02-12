import mongoose, {model, Schema } from "mongoose";
import { StockStoreHouseEntity } from '../../../domain/storehouse/stockStoreHouseEntity';


import MongooseDelete = require("mongoose-delete");

  const StockStoreHouseSchema = new Schema<StockStoreHouseEntity>(
    {

      StoreHouse_id:{
        type: mongoose.Types.ObjectId,
        ref:'StoreHouses',
        required: true,
      },
      product_id: {
        type: mongoose.Types.ObjectId, ref: "products",
        required:true,
      },
      stock:{
          type:Number,
          required:false,
      },
      status:{
        type:Boolean,
        default:true,
        required:false
      },

      
    },
     
    {
        timestamps: true,
        versionKey: false
    }
  );

  StockStoreHouseSchema.plugin(MongooseDelete, { overrideMethods :true });

const StockStoreHouseModel = model<Document & StockStoreHouseEntity>(
  'StoreHouseStocks',
  StockStoreHouseSchema
);

export default StockStoreHouseModel;

