
import { UserEntity } from "../user/UserEntity";

export interface storeHouseEntity  {
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


export interface SHLocation {
  state_id?:string;
  state?: string;
  municipality_id?:string;
  municipality?: string;
  direction ?: string;
}


