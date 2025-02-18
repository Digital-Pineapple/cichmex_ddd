
import { ObjectId } from "mongoose";
import { ILocation } from "../branch_office/BranchOfficeEntity";
import { UserEntity } from "../user/UserEntity";

export interface storeHouseEntity  {
  _id: string;
  user_id?: UserEntity ;
  name?: string;
  description?: string;
  phone_number?: number;
  opening_time?: string;
  closing_time?: string;
  images ?: ImageEntity[];
  status?: boolean;
  tag?: string;
  location ?: ILocation;
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;

}


export interface ImageEntity {
  _id: ObjectId,
  url: string;
  status: boolean;
}


