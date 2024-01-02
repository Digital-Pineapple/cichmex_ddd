
import MongooseDelete = require("mongoose-delete");
export interface IPhone {
    code             :   number;
    prefix           :   string;
    phone_number     :   number;
    expiration_date  :   NativeDate;
    verified         :   boolean;
    createdAt       ?:   NativeDate;
    updatedAt       ?:   NativeDate;
}


export interface CustomerEntity extends MongooseDelete.SoftDeleteInterface {
    _id              :   string;
    fullname         :   string;
    privacity        :   boolean;
    email            :   string;
    password         :   string;
    stripe_customer ?:   string;
    type_customer    :   string;
    profile_image    :   string;
    google          ?:   Boolean;
    phone            :   IPhone;
    status           :   Boolean;
    accountVerify    :   Boolean;
    facturapi_id    ?:   string;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
}