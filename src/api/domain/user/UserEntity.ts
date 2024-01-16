
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
export interface UserEntity extends MongooseDelete.SoftDeleteInterface {
    _id              :   string;
    fullname        ?:   string;
    privacity       ?:   boolean;
    email            :   string;
    password        ?:   string;
    stripe_user     ?:   string;
    type_user        :   string;
    profile_image   ?:   string;
    google          ?:   Boolean;
    facebook        ?:   Boolean;
    phone           ?:   IPhone;
    accountVerify    :   Boolean;
    facturapi_id    ?:   string;
    createdAt        :   NativeDate;
    updatedAt        :   NativeDate;
}
