
import MongooseDelete = require("mongoose-delete");
import {  ProductShopping } from "../product/ProductEntity";
import { UserEntity } from "../user/UserEntity";
import { MembershipInfoResponse } from "../membership/MembershipEntity";

export interface ShoppingCartEntity extends MongooseDelete.SoftDeleteDocument {
    user_id: UserEntity,
    products?: [ProductShopping]
    memberships?: [MembershipInfoResponse]
    createdAt: NativeDate;
    updatedAt: NativeDate;
    status?:boolean;
}

