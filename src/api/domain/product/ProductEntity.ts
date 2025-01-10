import mongoose, { ObjectId } from "mongoose";
import { SubCategory } from "../subCategory/SubCategoryEntity";
import { Category } from "../category/CategoryEntity";
import { PaymentEntity } from "../payments/PaymentEntity";
import { BranchOfficeEntity, ILocation } from "../branch_office/BranchOfficeEntity";
import { UserEntity } from "../user/UserEntity";
import { SizeGuideEntity } from "../sizeGuide/SizeGuideEntity";
import { VariantProductEntity } from "../variantProduct/variantProductEntity";
import { Size } from "aws-sdk/clients/s3";


export interface ProductEntity {
  _id: ObjectId,
  name: string;
  price?: number;
  discountPrice?: number;
  porcentDiscount?: number;
  description?: string;
  shortDescription?: string;
  slug?: string;
  dimensions?: string;
  brand?: string;
  tag?: string;
  category?: Category;
  subCategory?: SubCategory;
  currency?: string;
  images?: ProductImageEntity[];
  thumbnail?: string;
  status?: boolean;
  weight?: string;
  videos?: ProductVideoEntity[];
  rating?: number;
  product_key?: string;
  model?: string;
  gender?: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  seoDescription?: string,
  seoKeywords?: string[],
  condition ?: string,
  size_guide ?: SizeGuideEntity,
}

export interface ProductImageEntity {
  _id: ObjectId,
  url: string;
  color?: string;
  status: boolean;
}
export interface ProductVideoEntity {
  _id: ObjectId,
  url: string;
  type:string;
  status: boolean;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface ProductShopping {
  _id: mongoose.Types.ObjectId,
  item: mongoose.Types.ObjectId,
  variant?: mongoose.Types.ObjectId, 
  quantity?: number
}

export interface ProductOrderEntity {
  _id: ObjectId,
  folio: number,
  order_id: string,
  payment: PaymentEntity;
  payment_status: string;
  user_id: UserEntity
  products?: ProductEntity[];
  discount?: number;
  subTotal?: number;
  total?: number;
  shipping_cost?: number;
  branch?: BranchOfficeEntity;
  deliveryLocation?: ILocation;
  storeHouseStatus?: boolean;
  supply_detail: ProductOrderSupply;
  route_status?: boolean;
  route_detail?: PORouteDetail
  point_pickup_status?: boolean;
  deliveryStatus?: boolean;
  status?: boolean;
  paymentType?: string;
  download_ticket?: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  typeDelivery?: string;
}

export interface ILocationOrder {
  state_id?: string;
  state?: string;
  municipality_id?: string;
  municipality?: string;
  lat?: number;
  lgt?: number;
  address?: string;
  intNumber?: number;
  extNumber?: number
  references?: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface ProductOrderResume {
  ordersDay?: number,
  ordersWeek?: number,
  ordersMonth?: number
  ordersYear?: number,
  cashDay?: number,
  cashWeek?: number,
  cashMonth?: number,
  cashYear?: number,
  recivedCashDay?: number,
  recivedCashWeek?: number,
  recivedCashMonth?: number,
  recivedCashYear?: number,
  commissionPayedDay?: number,
  commissionPayedWeek?: number,
  commissionPayedMonth?: number,
  commissionPayedYear?: number
  salesDayByHour?: object,
  topProductsMonth?: any,
  lastTen?: any

}
export interface ProductOrderSupply {
  user: UserEntity,
  date: string,

}
export interface PORouteDetail {
  user: UserEntity,
  route_status?: string,
  deliveryDate?: string,
  guide?: string,
  shipping_company?: string
  guide_pdf ?: string,
}
