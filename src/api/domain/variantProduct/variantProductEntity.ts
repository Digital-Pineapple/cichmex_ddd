import mongoose from "mongoose";
import { ProductImageEntity } from "../product/ProductEntity";
import { SizeGuideEntity } from "../sizeGuide/SizeGuideEntity";
import { StockStoreHouseEntity } from "../storehouse/stockStoreHouseEntity";

export interface VariantProductEntity {
    _id : mongoose.Types.ObjectId,
    sku: String,
    attributes: AttributesVariantEntity,
    design: String,
    stock: StockStoreHouseEntity,
    images: [ProductImageEntity],
    thumbnail?: String;
    sizeGuide?: SizeGuideEntity,
    price: number,
    discountPrice: number;
    porcentDiscount: number;
    dimensions?: string;
    currency?: string;
    status?: boolean;
    weight?: string;
    rating?: number;
    product_key?: string;
 

  }

  export interface AttributesVariantEntity {
    color?: String,
    size?: String,
    material?: String,
  }