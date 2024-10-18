import mongoose, { model, Schema } from "mongoose";
import { ProductEntity, ProductImageEntity } from "../../../domain/product/ProductEntity";

const ProductImageSchema = new Schema<ProductImageEntity>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId
    },
    url: {
      type: String,
      required: false
    }
  },

  {
    versionKey: false,
    timestamps: true,
  }

)


const ProductSchema = new Schema<ProductEntity>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    porcentDiscount: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    shortDescription: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    dimensions: {
      type: String,
      required: false,
    },
    brand: {
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
    currency: {
      type: String,
      default: 'MX'
    },
    images: [ProductImageSchema],
    thumbnail: {
      type: String,
      required: false,
    },
    variants: {
      type: Array,
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    weight: {
      type: Number,
      required: false,
    },
    videos: {
      type: Array,
      required: false
    },
    rating: {
      type: Number,
      required: false
    },
    product_key: {
      type: String,
      required: false
    },
    seoDescription: {
      type: String,
      required: false
    },
    seoKeywords: {
      type: Array,
      required: false,
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

