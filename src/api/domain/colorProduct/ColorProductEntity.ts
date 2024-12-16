import mongoose from "mongoose";

 export interface ColorProductEntity {
    _id  : mongoose.Types.ObjectId
    name     : String,
    hex   : String,
    createdAt: NativeDate;
    updatedAt: NativeDate;

}