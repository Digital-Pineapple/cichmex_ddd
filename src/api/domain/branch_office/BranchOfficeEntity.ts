
import { UserEntity } from "../user/UserEntity";
import MongooseDelete = require("mongoose-delete");

export interface BranchOfficeEntity  {
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
  services?: string[];
  status?:boolean;
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;

}


export interface ILocation  {
  state_id?:string;
  state?: string;
  municipality_id?:string;
  municipality?: string;
  lat?: number;
  lgt?: number;
  direction ?: string;
}

export interface BranchOfficeEntityICR {
  images?: string[];
}

export interface BranchOfficeResponse{
  _id: string;
  name?: string;
  description?: string;
  phone_number?: number;
}

