
import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { CustomerEntity, IPhone } from '../../domain/customer/CustomerEntity';
import MongooseDelete = require("mongoose-delete");

const VerifyPhoneNumberSchema = new Schema<IPhone> ({
    code: {
        type    : Number,
        required: false,
    },
    prefix: {
        type    : String,
        required: false,
    },
    phone_number: {
        type    : Number,
        required: false,
    },
    expiration_date: {
        type    : Date,
        required: false,
    },
    verified: {
        type    : Boolean,
        required: true,
        default : false
    },
},
    {
        timestamps: true
    }
);

const CustomerSchema = new Schema<CustomerEntity> ({
    fullname: {
        type    : String,
        required: true,
    },
    privacity: {
        type    : Boolean,
        default: true,
    },
    email: {
        type    : String,
        required: true,
    },
    password: {
        type    : String,
        required: false,
    },
    stripe_customer: {
        type    : String,
        required: false
    },
    type_customer: {
        type    :   String,
        enum    :   ['0', '1','2','3'],
        default:    '0',
    },
    profile_image: {
        type    : String,
        required: false,
    },
    google: {
        type    : Boolean,
        default : false
    },
    phone: VerifyPhoneNumberSchema,
    accountVerify: {
        type    : Boolean,
        default : false,
    },
    // email_verified: {
    //     type: Boolean,
    //     default: true
    // },
    facturapi_id: {
        type    : String,
        required: false
    },
    
},
    {
        timestamps: true,
        versionKey: false,
    },
);

CustomerSchema.method('toJSON', function () {
    const { password, ...customer } = this.toObject();
    return customer;
});

CustomerSchema.plugin(mongoosePaginate);
CustomerSchema.plugin(MongooseDelete,{overrideMethods:true})
const CustomerModel = model('Customer', CustomerSchema);

export default CustomerModel;


