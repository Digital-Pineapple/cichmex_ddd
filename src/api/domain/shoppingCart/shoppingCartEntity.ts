import {  ProductShopping } from "../product/ProductEntity";
import { UserEntity } from "../user/UserEntity";
import { MembershipInfoResponse } from "../membership/MembershipEntity";
import mongoose, { ObjectId } from "mongoose";

export interface ShoppingCartEntity{
    _id: ObjectId,
    user_id: UserEntity,
    products?: [ProductShopping]
    memberships?: [MembershipInfoResponse]
    createdAt: NativeDate;
    updatedAt: NativeDate;
    status?:boolean;
}

