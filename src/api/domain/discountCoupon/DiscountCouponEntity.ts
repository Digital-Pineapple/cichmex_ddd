import { ObjectId } from "mongoose";
import { UserEntity } from "../user/UserEntity";

export interface DiscountCouponEntity {
    _id: ObjectId;
    uuid: string;
    name: string;
    description?: string;
    code?: string;
    percent?: number;
    fixed_amount?: number;
    type_discount : string;
    unlimited?: boolean;
    start_date ?: Date;
    expiration_date?: Date;
    min_cart_amount?: number;
    max_cart_amount?: number;
    for_all_products : boolean; 
    products?: ObjectId[]
    creator_id?:ObjectId;
    maxUses?: number;
    is_active?: boolean;
    status: boolean;
}

export interface ConsumeCouponEntity{
    _id: ObjectId;
    uuid: string;
    user : string,
    discount_coupon: ObjectId,
    status?: boolean;
    subtotal_amount_sale?: number;
    discount_applied?: number;
    total_amount_sale?: number;
    valid_sale ?: boolean;
}