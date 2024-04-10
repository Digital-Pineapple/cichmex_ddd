

import mongoose from "mongoose";
import MongooseDelete = require("mongoose-delete");

export interface ProductEntity extends MongooseDelete.SoftDeleteDocument {

  name: string;
  price: number;
  description?: string;
  slug?: string;
  sizes?: string[];
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

  export interface ProductShopping extends MongooseDelete.SoftDeleteDocument {
   
    item ?: string;
    quantity? :number
   
  }

