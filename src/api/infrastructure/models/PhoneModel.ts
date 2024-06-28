import { IPhone } from '../../domain/user/UserEntity';
import { Mongoose, Schema,model } from 'mongoose';
import MongooseDelete = require("mongoose-delete");

const PhoneSchema = new Schema<IPhone>  ({
    code: {
        type    : String,
        required: false,
    },
    prefix: {
        type    : String,
        required: true,
    },
    phone_number: {
        type    : Number,
        required: true,
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
    status:{
        type:Boolean,
        required:false,
        default:true,
       }
},
    {
        timestamps: true,
        versionKey: false,
    }
);


const PhoneModel = model('Phone', PhoneSchema);

export default PhoneModel;