import mongoose from "mongoose";
import { IZone } from "./zoneEntity";
import { IAisle } from "./aisleEntity";
import { ISection } from "./sectionEntity";

export interface LocationProductEntity {
  _id: mongoose.Types.ObjectId;
  name: string;
  product?: mongoose.Types.ObjectId;
  variant?: mongoose.Types.ObjectId;
  section?: ISection;
  aisle?: IAisle;
  zone?: IZone;
  quantity: number;
  type: string;
}