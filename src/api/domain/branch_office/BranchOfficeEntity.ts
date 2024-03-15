
import { UserEntity } from "../user/UserEntity";
import MongooseDelete = require("mongoose-delete");

export interface BranchOfficeEntity extends MongooseDelete.SoftDeleteDocument {
  _id: string;
  user_id: UserEntity ;
  name?: string;
  description?: string;
  activated?: boolean;
  phone_number?: number;
  images ?: string[];
  opening_time?: string;
  closing_time?: string;
  location ?: ILocation;
  services?: string[]
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;

}


export interface ILocation extends MongooseDelete.SoftDeleteDocument{
  state_id?:string;
  state?: string;
  municipality_id?:string;
  municipality?: string;
  lat?: number;
  lgt?: number;
  direction ?: string;
}

export interface BranchOfficeEntityICR extends MongooseDelete.SoftDeleteDocument {
  images?: string[];
}

