import mongoose, {  Schema } from "mongoose";

import MongooseDelete = require("mongoose-delete");
import { TypeCarEntity } from "../typeCar/TypeCarEntity";


export interface MembershipEntity{
  name: string;
  price_standard: number;
  discount_porcent?: number,
  discount_products?:number,
  price_discount?: number;
  service_quantity?: [ServiceQuantity];
  type_cars ?:[TypeCarEntity];
  status?: boolean;
  

}

export interface MembershipInfoResponse  {
  _id:string,
  name: string;
  price_standard: number;
  price_discount?: number;
  discount_porcent?: number;
}

export interface QrValidatedResponse  {
  _id:string,
  name: string;
  activated: boolean;
  service_id?: string;
  service_name?: string;
  typeCars : [string]
  user_id: string

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

export interface MembershipBenefits {

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
    ref: "User";
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
  activated: {
    type: boolean;
  };
  status?:Boolean
}
export interface MembershipHistory  {

  membershipBenefit_id:{
    type: mongoose.ObjectId;
  },
    date_service:{
        type:string;
        required:false   
    },
    typeCar_id:{
      type:Schema.Types.ObjectId;
      ref:'TypeCar',
      required:false,
    },
    car_color:{
      type:string,
      required: false,
    },
    plate_number:{
      type: string,
      required: false,
    },
    branch_office_id:{
      type:Schema.Types.ObjectId;
      ref:'BranchOffices',
      required:false,
    }
    service:{
      type:Schema.Types.ObjectId,
      ref: 'Services',
      required:false,
    },
    status:{
      type:boolean,
      required:false
    }

  
    
}