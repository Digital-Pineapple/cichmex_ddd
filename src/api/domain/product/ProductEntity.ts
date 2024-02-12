

import mongoose from "mongoose";
import MongooseDelete = require("mongoose-delete");
import { SubCategory } from "../subCategory/SubCategoryEntity";
import { Category } from "../category/CategoryEntity";

export interface ProductEntity extends MongooseDelete.SoftDeleteDocument {

  name: string;
  price: number;
  description?: string;
  slug?: string;
  size?: string;
  tag: string;
  category: Category;
  subCategory?: SubCategory;
  images?: string[];
  status?:boolean;
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

