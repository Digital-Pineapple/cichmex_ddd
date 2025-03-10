import {  ProductShopping } from "../product/ProductEntity";
import { UserEntity } from "../user/UserEntity";
import { MembershipInfoResponse } from "../membership/MembershipEntity";
import mongoose, { ObjectId } from "mongoose";
import { ObjectId as ID } from 'mongodb';

export interface ShoppingCartEntity{
    _id: ObjectId,
    user_id: UserEntity,
    products?: [ProductShopping]
    memberships?: [MembershipInfoResponse]
    createdAt: NativeDate;
    updatedAt: NativeDate;
    status?:boolean;
}

export interface ProductCart {
    _id: string;
    item: ID;
    variant?: ID | null;
    quantity: number;
}

