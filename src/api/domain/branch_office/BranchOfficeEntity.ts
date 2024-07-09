
import { UserEntity } from "../user/UserEntity";

export interface BranchOfficeEntity  {

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


export interface ILocation {
  state_id?: string;
  state?: string;
  municipality_id?: string;
  municipality?: string;
  lat?: number;
  lgt?: number;
  direction: string;
  neighborhood?: string;
  cp?:number;
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

