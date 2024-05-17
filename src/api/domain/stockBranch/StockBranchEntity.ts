
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
  status?:boolean;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface IProductInput extends MongooseDelete.SoftDeleteInterface{
  stock_id: StockBranchEntity,
  quantity: number,
  newQuantity: number
  status?:boolean;
  createdAt: NativeDate;
}
export interface IProductOutput extends MongooseDelete.SoftDeleteInterface{
  stock_id:StockBranchEntity
  quantity: number,
  newQuantity: number,
  responsible?:  UserEntity,
  status?:boolean;
  createdAt: NativeDate;
}

export interface IProductReturn extends MongooseDelete.SoftDeleteInterface{
  stock_id: StockBranchEntity
  quantity: number,
  newQuantity: number,
  responsible_id: UserEntity,
  status?:boolean;
  createdAt: NativeDate;
}
