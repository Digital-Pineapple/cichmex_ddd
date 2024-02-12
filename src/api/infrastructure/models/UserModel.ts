import { Mongoose, Schema, model } from 'mongoose';
import { IPhone, UserEntity } from '../../domain/user/UserEntity';
import MongooseDelete = require("mongoose-delete");

const VerifyPhoneNumberSchema = new Schema<IPhone>({
    code: {
        type: String,
        required: false,
    },
    prefix: {
        type: String,
        required: false,
    },
    phone_number: {
        type: Number,
        required: false,
    },
    expiration_date: {
        type: Date,
        required: false,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
},
    {
        timestamps: true
    }
);

const UserSchema = new Schema<UserEntity>({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    privacity: {
        type: String,
        required: false,
    },
    stripe_user: {
        type: String,
        required: false,
    },
    type_user: {
        type: Schema.Types.ObjectId,
        ref: 'TypeUser',
        required: true

    },
    profile_image: {
        type: String,
        required: false,
    },
    google: {
        type: Boolean  ,
        required: false,
    },
    facebook: {
        type: Boolean,
        required: false
    },
    phone_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Phone',
        required: false
    },
    email_verified :{
        type:Boolean,
        required:false,
        default: false
    },
    accountVerify: {
        type: Boolean,
        required: false
    },
    facturapi_id: {
        type: String,
        required: false
    },
    store:{
        type: Schema.Types.ObjectId,
        required: false,
        ref:'BranchOffices'
    },
}, {
    timestamps: true,
    versionKey: false,
});
UserSchema.plugin(MongooseDelete, { overrideMethods: true })
UserSchema.method('toJSON', function () {
    const { password, ...user } = this.toObject();
    return user;
});

// UserSchema.plugin(mongoosePaginate);

const UserModel = model('User', UserSchema);

export default UserModel;