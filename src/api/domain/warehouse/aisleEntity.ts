import mongoose from "mongoose";

export interface IAisle {
  _id : mongoose.Types.ObjectId,
  storehouse: mongoose.Types.ObjectId,
  name: string;
  zone: mongoose.Types.ObjectId; // Relación con Zona
  sections: mongoose.Types.ObjectId[];
  status?: boolean;
}