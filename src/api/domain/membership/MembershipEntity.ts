import mongoose, {  Schema } from "mongoose";

import MongooseDelete = require("mongoose-delete");
import { TypeCarEntity } from "../typeCar/TypeCarEntity";


export interface MembershipEntity extends MongooseDelete.SoftDeleteDocument {
  name: string;
  price_standard: number;
  discount_porcent?: number,
  discount_products?:number,
  price_discount?: number;
  service_quantity?: [ServiceQuantity];
  type_cars ?:[string]
  

}

export interface ServiceQuantity {
  service_id: {
    type: Schema.Types.ObjectId;
    ref: "Services";
  };
  quantity: {
    type: number;
  };
}

export interface MembershipBenefits extends MongooseDelete.SoftDeleteDocument  {

  membership_id: {
    type: Schema.Types.ObjectId;
    ref: "Memberships";
  };
  service_id: {
    type: Schema.Types.ObjectId;
    ref: "Services";
  };
  client_id: {
    type: Schema.Types.ObjectId;
    ref: "Customers";
  };
  quantity: {
    type: number;
    required: true;
  };
  start_date: {
    type: Date;
    required: true;
  };
  end_date: {
    type: Date;
    required: true;
  };
  status: {
    type?: boolean;
   
  };
  // membership_history:{}[]
}
export interface MembershipHistory extends MongooseDelete.SoftDeleteDocument {

    date_service:{
        type:Date;
        required:false   
    }
    membershipBenefit_id:{
      type: mongoose.ObjectId;
    }
    
}