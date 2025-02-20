import mongoose from "mongoose";

 export interface ISection extends Document {
    name: string;
    aisle: mongoose.Types.ObjectId; // Relación con Pasillo
    capacity: number;
    stock: [{
      product: mongoose.Types.ObjectId;
      quantity: number;
      code: string; // Código único por sección
    }];
    status?: boolean;
  }

  