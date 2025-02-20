import mongoose from "mongoose";

 export interface IZone  {
    name: string;
    type: 'storage_zone' | 'picking_zone' | 'loading_dock';
    aisles: mongoose.Types.ObjectId[];
    status?: boolean,
  }