import { UserEntity } from "../user/UserEntity";
import MongooseDelete = require("mongoose-delete");

export interface IFile extends MongooseDelete.SoftDeleteInterface{
    _id: string;
    name: string;
    message?: string;
    user_id?: UserEntity;
    url: string;
    verify: boolean;
}

export interface IRespFile extends MongooseDelete.SoftDeleteInterface{
    _id ?: string; 
    name: string;
    message?: string;
    verify: boolean;
}