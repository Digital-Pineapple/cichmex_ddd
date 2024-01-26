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
        required: false,
    },
    phone_number: {
        type    : Number,
        required: false,
        unique: true,
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
        timestamps: true,
        versionKey: false,
    }
);

PhoneSchema.plugin(MongooseDelete, {overrideMethods:true})

const PhoneModel = model('Phone', PhoneSchema);

export default PhoneModel;