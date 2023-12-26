import { CustomerEntity } from '../customer/CustomerEntity';

import MongooseDelete = require("mongoose-delete");

export interface BranchOfficeEntity extends MongooseDelete.SoftDeleteDocument {
  _id: string;
  customer_id: CustomerEntity ;
  name?: string;
  description?: string;
  activated?: boolean;
  phone_number?: number;
  location ?: ILocation;
  createdAt        :   NativeDate;
  updatedAt        :   NativeDate;

}

export interface ILocation extends MongooseDelete.SoftDeleteDocument{
  location_map: string;
  state?: string;
  municipality?: string;
  createdAt       ?:   NativeDate;
  updatedAt       ?:   NativeDate;
}

