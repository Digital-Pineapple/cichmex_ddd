import { ObjectId } from "mongoose";
import { UserEntity } from "../user/UserEntity";
import { ProductEntity } from "../product/ProductEntity";

export interface PaymentEntity {
  _id?:ObjectId;
  uuid?: string;
  user_id?: UserEntity;
  MP_info?: Record<string, any>;   
  status?: boolean;
  payment_status?: string;
  system?: string;
  products?: ProductEntity[];         
  verification?: VerificationDetail;
  order_id?: ObjectId;
}

export interface VerificationDetail {
  last_verification_time?: Date;   
  signature?: string;
  payment_vouchers?: PaymentVoucher[];
}

export interface PaymentVoucher {
  url: string;
  reference: string;
  amount : number;
  status: string;
  notes: string;
  createdAt: Date;                 
  verification_responsible: string;
  verification_time: Date;        
}




