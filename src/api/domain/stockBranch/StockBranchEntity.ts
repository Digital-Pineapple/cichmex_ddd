
import MongooseDelete = require("mongoose-delete");
import { ProductEntity } from "../product/ProductEntity";
import { BranchOfficeEntity } from "../branch_office/BranchOfficeEntity";
import { UserEntity } from "../user/UserEntity";

export interface StockBranchEntity extends MongooseDelete.SoftDeleteInterface {
  _id: string;
  branch_id: BranchOfficeEntity;
  product_id: ProductEntity;
  stock: number;
  inputs: IProductInput[];
  outputs: IProductOutput[];
  returns:IProductReturn[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface IProductInput extends MongooseDelete.SoftDeleteInterface{
  stock_id: StockBranchEntity,
  quantity: number,
  newQuantity: number
  createdAt: NativeDate;
}
export interface IProductOutput extends MongooseDelete.SoftDeleteInterface{
  stock_id:StockBranchEntity
  quantity: number,
  newQuantity: number,
  responsible?:  UserEntity,
  createdAt: NativeDate;
}

export interface IProductReturn extends MongooseDelete.SoftDeleteInterface{
  stock_id: StockBranchEntity
  quantity: number,
  newQuantity: number,
  responsible_id: UserEntity,
  createdAt: NativeDate;
}
