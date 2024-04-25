
import MongooseDelete = require("mongoose-delete");
import { ProductEntity } from "../product/ProductEntity";
import { BranchOfficeEntity } from "../branch_office/BranchOfficeEntity";
import { UserEntity } from "../user/UserEntity";

export interface StockStoreHouseEntity extends MongooseDelete.SoftDeleteInterface {
  _id: string;
  product_id: ProductEntity;
  stock: number;
  inputs?: SHProductInput[];
  outputs?: SHProductOutput[];
  returns?:SHProductReturn[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface SHProductInput extends MongooseDelete.SoftDeleteInterface{
    SHStock_id ?: string,
    quantity: number,
    newQuantity: number
    createdAt: NativeDate;
  }
  export interface SHProductOutput extends MongooseDelete.SoftDeleteInterface{
    SHStock_id ?: string,
    quantity: number,
    newQuantity: number,
    responsible?:  UserEntity,
    createdAt: NativeDate;
  }
  export interface SHProductReturn extends MongooseDelete.SoftDeleteInterface{
    SHStock_id ?: string,
    quantity: number,
    newQuantity: number,
    responsible_id: UserEntity,
    createdAt: NativeDate;
  }
  