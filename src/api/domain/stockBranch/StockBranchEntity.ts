
import MongooseDelete = require("mongoose-delete");
import { ProductEntity } from "../product/ProductEntity";
import { BranchOfficeEntity } from "../branch_office/BranchOfficeEntity";

export interface StockBranchEntity extends MongooseDelete.SoftDeleteDocument {
  _id: string;
  branch_id: BranchOfficeEntity;
  product_id: ProductEntity;
  stock: number;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
