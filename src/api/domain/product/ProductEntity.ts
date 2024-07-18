import mongoose from "mongoose";
import { SubCategory } from "../subCategory/SubCategoryEntity";
import { Category } from "../category/CategoryEntity";
import { PaymentEntity } from "../payments/PaymentEntity";
import { BranchOfficeEntity, ILocation } from "../branch_office/BranchOfficeEntity";
import { UserEntity } from "../user/UserEntity";

export interface ProductEntity {

  name: string;
  price: number;
  description?: string;
  slug?: string;
  size?: string;
  tag: string;
  category?: Category;
  subCategory?: SubCategory;
  images?: string[];
  status?:boolean;
  weight ?: string;
  video ?: string;
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;
}

export interface ProductImage  {
   
    url: string;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
  }

  export interface ProductShopping  {
   
    item ?: mongoose.Types.ObjectId,
      
    quantity? :number
   
  }

  export interface ProductOrderEntity{
    order_id: string,
    payment: PaymentEntity;
    payment_status ?: string; 
    user_id:UserEntity
    products?: [ProductEntity];
    discount?: number;
    subTotal?: number;
    total?: number;
    branch?: BranchOfficeEntity;
    deliveryLocation?:ILocation;
    storeHouseStatus?:boolean;
    route_status?: boolean;
    point_pickup_status?: boolean;
    deliveryStatus: boolean;
    status?:boolean;
    paymentType?: string;
    download_ticket?:string;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
  }

  export interface ILocationOrder {
    state_id?: string;
    state?: string;
    municipality_id?: string;
    municipality?: string;
    lat?: number;
    lgt?: number;
    address?: string;
    intNumber?:number;
    extNumber?:number
    references?:string;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
  }

  export interface ProductOrderResume {
    ordersDay ?: number
    ordersMonth?: number
    cashDay ?: number,
    cashMonth ?: number
  }
