import mongoose, { model, Schema } from "mongoose";
import { ProductEntity, ProductImageEntity, ProductVideoEntity } from "../../../domain/product/ProductEntity";

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

const ProductVideoSchema = new Schema<ProductVideoEntity>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId
    },
    url: {
      type: String,
      required: false
    },
    type:{
      type: String,
      required:false,
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
      unique:false,
    },
    price: {
      type: Number,
      required: false,
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
      required: false,
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
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    weight: {
      type: Number,
      required: false,
    },
    videos: [ProductVideoSchema],
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
    },
    condition:{
      type:String,
      required : false,
    },
    size_guide:{
      type: mongoose.Types.ObjectId,
      ref: 'sizeguides',
      required: false
    },
    gender:{
      type:String,
      required:false,
    },
    model:{
      type:String,
      required:false,
    },
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

