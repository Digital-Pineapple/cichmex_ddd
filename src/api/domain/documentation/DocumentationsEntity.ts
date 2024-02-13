import { UserEntity } from "../user/UserEntity";
import MongooseDelete = require("mongoose-delete");

export interface IFile extends MongooseDelete.SoftDeleteInterface{
    name: string;
    message?: string;
    user_id?: UserEntity;
    url: string;
    verify: boolean;
}
