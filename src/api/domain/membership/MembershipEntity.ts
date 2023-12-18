import { bool } from "aws-sdk/clients/signer";
import { DateSchemaDefinition, Schema } from "mongoose";

export interface MembershipEntity {

    name             : string;
    price_standard   : number;
    price_discount  ?: number;
    service_quantity ?: [ServiceQuantity];
    status          ?: boolean;
    
}

export interface ServiceQuantity {
    service_id:{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    quantity:{
        type: number,
    }
}

export interface MembershipBenefits {
    membership_id:{
        type:Schema.Types.ObjectId,
        ref: 'Memberships'
    },
    service_id :{ 
        type: Schema.Types.ObjectId,
        ref:'Services'
    },
    client_id:{
        type: Schema.Types.ObjectId,
        ref: 'Customers'
    },
    quantity:{
        type: number,
        required: true
    },
    start_date:{
        type: Date,
        required: true,
    }
    end_date:{
        type: Date,
        required: true,
    }
    status:{
        type:boolean,
        required:false,
    }

    }
