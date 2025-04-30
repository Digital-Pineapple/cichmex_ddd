import mongoose from "mongoose";

export interface ISection extends Document {
  storehouse: mongoose.Types.ObjectId;
  name: string;
  aisle: mongoose.Types.ObjectId; // Relación con Pasillo
  capacity: number;
  locations: [LocationProduct];
  status?: boolean;
}
export interface LocationProduct {
  id: string;
  product?: mongoose.Types.ObjectId;
  variant?: mongoose.Types.ObjectId;
  quantity: number;
  type: string;
}
