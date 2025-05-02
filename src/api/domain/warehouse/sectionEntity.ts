import mongoose from "mongoose";
import { LocationProductEntity } from "./locationProductEntity";
import { IAisle } from "./aisleEntity";
import { storeHouseEntity } from "../storehouse/storeHouseEntity";

export interface ISection extends Document {
  storehouse: storeHouseEntity;
  name: string;
  aisle: IAisle; // Relación con Pasillo
  capacity: number;
  locations: [LocationProductEntity];
  status?: boolean;
}
