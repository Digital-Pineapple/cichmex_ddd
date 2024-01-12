
import MongooseDelete = require("mongoose-delete");
export interface UserEntity extends MongooseDelete.SoftDeleteInterface {
    _id             :   string;
    fullname        :   string;
    email           :   string;
    password        :   string;
    profile_image   : string;
    createdAt       :   NativeDate;
    updatedAt       :   NativeDate;
}