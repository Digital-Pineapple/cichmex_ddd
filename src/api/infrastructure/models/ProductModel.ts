import mongoose, { model, Schema } from "mongoose";

import MongooseDelete = require("mongoose-delete");
import { ProductEntity, ProductImage } from "../../domain/product/ProductEntity";



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
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: 'SubCategory',
      required: false
    },
    images: {
      type: Array,
      required: false,
    }

  },
  {
    versionKey: false,
    timestamps: true,
  }
);

ProductSchema.plugin(MongooseDelete, { overrideMethods: true });

const ProductModel = model<Document & ProductEntity>(
  'Products',
  ProductSchema
);

export default ProductModel;

