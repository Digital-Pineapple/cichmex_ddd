
import { UserEntity } from "../user/UserEntity";
import MongooseDelete = require("mongoose-delete");

export interface BranchOfficeEntity extends MongooseDelete.SoftDeleteDocument {
  _id: string;
  user_id: UserEntity ;
  name?: string;
  description?: string;
  activated?: boolean;
  phone_number?: number;
  image ?: string[];
  opening_time?: string;
  closing_time?: string;
  location ?: ILocation;
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;

}

export interface ILocation extends MongooseDelete.SoftDeleteDocument{
  lat: string;
  lgt:string;
  state?: string;
  municipality?: string;
  direction ?: string;
  createdAt       ?:   NativeDate;
  updatedAt       ?:   NativeDate;
}

export interface BranchOfficeEntityICR extends MongooseDelete.SoftDeleteDocument {
  image ?: string;
}