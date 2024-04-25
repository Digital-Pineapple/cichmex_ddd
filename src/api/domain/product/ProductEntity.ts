

import mongoose from "mongoose";
import MongooseDelete = require("mongoose-delete");

export interface ProductEntity extends MongooseDelete.SoftDeleteDocument {

  name: string;
  price: number;
  description?: string;
  slug?: string;
  size?: string;
  tag: string;
  images?: string[];
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;
}

export interface ProductImage extends MongooseDelete.SoftDeleteDocument {
   
    url: string;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
  }

  export interface ProductShopping  {
   
    item ?: mongoose.Types.ObjectId,
      
    quantity? :number
   
  }

