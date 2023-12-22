import mongoose, {  Schema } from "mongoose";


export interface MembershipEntity {
  name: string;
  price_standard: number;
  price_discount?: number;
  service_quantity?: [ServiceQuantity];
  status?: boolean;
}

export interface ServiceQuantity {
  service_id: {
    type: Schema.Types.ObjectId;
    ref: "Service";
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
export interface MembershipHistory{
  _id :{
    _id:string
  }

    date_service:{
        type:Date;
        required:false   
    }
    status:{
        type:boolean;
        required: true;
    },
    membershipBenefit_id:{
      type: mongoose.ObjectId;
    }
    
}