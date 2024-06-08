import { TypeUserEntity } from "../typeUser/TypeUserEntity";
import mongoose from "mongoose";
export interface IPhone  {
    code             ?:   string;
    prefix           :   string;
    phone_number     :   number;
    expiration_date  ?:   NativeDate;
    verified         ?:   boolean;
    status?: boolean;
    createdAt       ?:   NativeDate;
    updatedAt       ?:   NativeDate;
}

export interface IPhoneResponse  {
    phone_id              :   string;
    phone_number     :   number;
    verified         ?:   boolean;
}
export interface UserEntity {
    _id              :   string;
    fullname        ?:   string;
    privacity       ?:   boolean;
    email           ?:   string;
    email_verified  ?:   boolean;
    password        ?:   string;
    stripe_user     ?:   string;
    type_user       ?:   TypeUserEntity
    profile_image   ?:   string;
    google          ?:   Boolean;
    facebook        ?:   Boolean;
    phone_id        ?:   IPhone;
    accountVerify   ?:   boolean;
    verify_code     ?:   UserVerifyCodeEntity;
    facturapi_id    ?:   string;
    status          ?:   boolean;
    store           ?:   mongoose.Types.ObjectId;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
}

export interface UserVerifyCodeEntity{
    attempts    ?: number,
    code        ?:number,
 }
