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
    applications?: number,
    first_buy?: boolean;
    expiration_date?: string;
    min_cart_amount?: number;
    max_cart_amount?: number;
    categories?: string[];
    status?: boolean;
}

export interface ConsumeCouponEntity{
    _id: ObjectId;
    uuid: string;
    user : string,
    discount_coupon: string,
    status?: boolean;
}