import mongoose from "mongoose";
import { SubCategory } from "../subCategory/SubCategoryEntity";
import { Category } from "../category/CategoryEntity";
import { PaymentEntity } from "../payments/PaymentEntity";
import { BranchOfficeEntity } from "../branch_office/BranchOfficeEntity";

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

    payment: PaymentEntity;
    products?: [ProductEntity];
    discount?: number;
    subTotal?: number;
    total?: number;
    branch?: BranchOfficeEntity;
    deliveryStatus: boolean;
    status?:boolean;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
  }

