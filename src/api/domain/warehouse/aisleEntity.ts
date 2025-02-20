import mongoose from "mongoose";

 export interface IAisle  {
    name: string;
    zone: mongoose.Types.ObjectId; // Relación con Zona
    sections: mongoose.Types.ObjectId[]; 
    status?: boolean;
  }