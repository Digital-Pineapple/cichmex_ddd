import mongoose, { Schema } from "mongoose";
import { LocationProductEntity } from "../../../domain/warehouse/locationProductEntity";

const LocationProductSchema = new Schema<LocationProductEntity>({
  _id: { type: Schema.Types.ObjectId },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  variant: { type: Schema.Types.ObjectId, ref: 'Variants' },
  section: { type: Schema.Types.ObjectId, ref: 'Section' },
  aisle: { type: Schema.Types.ObjectId, ref: 'Aisle' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  quantity: { type: Number, default: 0 },
  type: { type: String, enum: ['unique_product', 'variant_product'], required: true },
},{
  versionKey: false,
  timestamps: false,
});

export const LocationProductModel = mongoose.model<LocationProductEntity>('LocationProduct', LocationProductSchema);
