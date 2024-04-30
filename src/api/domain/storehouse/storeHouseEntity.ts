
import { UserEntity } from "../user/UserEntity";
import MongooseDelete = require("mongoose-delete");

export interface storeHouseEntity extends MongooseDelete.SoftDeleteDocument {
  _id: string;
  user_id: UserEntity ;
  name?: string;
  phone_number?: number;
  images ?: string[];
  status?: boolean;
  location ?: SHLocation;
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;

}


export interface SHLocation extends MongooseDelete.SoftDeleteDocument{
  state_id?:string;
  state?: string;
  municipality_id?:string;
  municipality?: string;
  direction ?: string;
}


