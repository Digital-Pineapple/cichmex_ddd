import mongoose from "mongoose";
import { ProductEntity, ProductImageEntity } from "../product/ProductEntity";
export interface VariantProductEntity {
  _id: mongoose.Types.ObjectId,
  product_id: ProductEntity,
  sku: String,
  attributes: AttributesVariantEntity,
  design: String,
  images: ProductImageEntity[],
  price: number,
  discountPrice?: number;
  porcentDiscount?: number;
  dimensions?: string;
  currency?: string;
  status?: boolean;
  weight?: number;
  rating?: number;
  tag: String;
  is_main?: boolean;
  purchase_price?: number; 
}

export interface AttributesVariantEntity {
  color?: String,
  size?: String,
  material?: String,
}