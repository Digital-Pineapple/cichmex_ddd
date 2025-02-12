
import mongoose from "mongoose";
import { DiscountCouponEntity } from "../discountCoupon/DiscountCouponEntity";

export interface BannerEntity  {

  _id?: mongoose.Types.ObjectId ;
  is_active?: boolean;
  no_slide?: number;
  for_discount?: boolean;
  discount?: DiscountCouponEntity;
  title ?: string;
  description?: string;
  type_event?: string;
  image_slide?: string;
  image_slide_movil?: string;
  status?:boolean;
  // createdAt        :   NativeDate;
  // updatedAt        :   NativeDate;

}
