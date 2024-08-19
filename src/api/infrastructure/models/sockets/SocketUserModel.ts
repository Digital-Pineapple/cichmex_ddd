import mongoose, {model, Schema } from "mongoose";
import { StockBranchEntity, IProductInput, IProductOutput, IProductReturn } from '../../../domain/stockBranch/StockBranchEntity';
import { SocketUser } from "../../../domain/socket/socketEntity";


  const SocketUserSchema = new Schema<SocketUser>(
    {
       id: {
        type:String,
        required:false,
      },
      name: {
        type: String,
        required:false,
      },
      lounge:{
          type:String,
          required:false,
      },
      
    },
     
    {
        timestamps: true,
        versionKey: false
    }
  );


const SocketUserModel = model<SocketUser>(
  'SocketsUsers',
  SocketUserSchema
);

export default SocketUserModel;

