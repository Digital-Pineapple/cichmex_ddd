import { ProductEntity } from "../product/ProductEntity";
import { UserEntity } from "../user/UserEntity";
import { storeHouseEntity } from "./storeHouseEntity";

export interface StockStoreHouseEntity  {
  _id: string;
  StoreHouse_id : storeHouseEntity;
  product_id: ProductEntity;
  stock: number;
  status?: boolean;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface SHProductInput {
    folio: string,
    SHStock_id ?: string,
    quantity: number,
    newQuantity: number
    status?:boolean;
    responsible?:  UserEntity,
    user_received?: string,
    user_delivery?: string,
    product_detail:ProductEntity,
    createdAt: NativeDate;
  }
  export interface SHProductOutput {
    folio ?: string,
    order_id ?: string,
    SHStock_id ?: string,
    quantity: number,
    newQuantity: number,
    user_received?: string,
    user_delivery?: string,
    responsible?:  UserEntity,
    product_detail:ProductEntity,
    reason ?: string,
    createdAt: NativeDate;
    status?:boolean;
  }
  export interface SHProductReturn {
    SHStock_id ?: string,
    quantity: number,
    newQuantity: number,
    responsible_id: UserEntity,
    createdAt: NativeDate;
    status?:boolean;
  }
  