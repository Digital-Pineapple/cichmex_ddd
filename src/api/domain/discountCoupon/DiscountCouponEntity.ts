import { ObjectId } from "mongoose";
import { UserEntity } from "../user/UserEntity";

export interface DiscountCouponEntity {
    _id: ObjectId;
    uuid: string;
    code: string;
    porcent?: number;
    fixed_amount?: number;
    free_shipping?: boolean;
    unlimited?: boolean;
    first_buy?: boolean;
    expiration_date?: string;
    min_cart_amount?: number;
    max_cart_amount?: number;
    categories?: string[];
    creator_id?:ObjectId;
    for_creators?: boolean;
    status: boolean;
    maxUses: number;
    // usedCount
}

export interface ConsumeCouponEntity{
    _id: ObjectId;
    uuid: string;
    user : string,
    discount_coupon: string,
    status?: boolean;
    subtotal_amount_sale?: number;
    discount_applied?: number;
    total_amount_sale?: number;
    valid_sale ?: boolean;
}