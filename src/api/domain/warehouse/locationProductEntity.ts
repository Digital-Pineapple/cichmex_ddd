import mongoose from "mongoose";

export interface LocationProductEntity {
  _id: mongoose.Types.ObjectId;
  name: string;
  product?: mongoose.Types.ObjectId;
  variant?: mongoose.Types.ObjectId;
  section?: mongoose.Types.ObjectId;
  aisle?: mongoose.Types.ObjectId;
  zone?: mongoose.Types.ObjectId;
  quantity: number;
  type: string;
}