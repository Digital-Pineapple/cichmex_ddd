import mongoose, {model, Schema } from "mongoose";
import { StockStoreHouseEntity } from '../../../domain/storehouse/stockStoreHouseEntity';

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


const StockStoreHouseModel = model<StockStoreHouseEntity>(
  'StoreHouseStocks',
  StockStoreHouseSchema
);

export default StockStoreHouseModel;

