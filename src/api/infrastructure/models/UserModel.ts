import { Mongoose, Schema, model } from 'mongoose';
import { IPhone, UserEntity } from '../../domain/user/UserEntity';


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
    verify_code:{
        type: Object,
        requred:false,
    },
    status:{
        type:Boolean,
        required:false,
        default:true,
       }
}, {
    timestamps: true,
    versionKey: false,
});

UserSchema.method('toJSON', function () {
    const { password, ...user } = this.toObject();
    return user;
});

// UserSchema.plugin(mongoosePaginate);

const UserModel = model('User', UserSchema);

export default UserModel;