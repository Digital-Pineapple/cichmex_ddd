import mongoose, { model, Schema } from "mongoose";
import { ProductEntity } from "../../../domain/product/ProductEntity";


const ProductSchema = new Schema<ProductEntity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    tag: {
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Categories',
      required: false
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: 'SubCategory',
      required: false
    },
    images: {
      type: Array,
      required: false,
    },
    status:{
      type:Boolean,
      required:false,
      default:true,
     },
     weight:{
      type:Number,
      required:false,
     },
     video:{
      type:String,
      required:false
     },
     product_key:{
      type:String,
      required:true
     }

  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const ProductModel = model<ProductEntity>(
  'Product',
  ProductSchema
);

export default ProductModel;

