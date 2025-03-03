import mongoose, { Schema } from "mongoose";
import { IZone } from "../../../domain/warehouse/zoneEntity";

const ZoneSchema = new Schema<IZone>({
    storehouse: {type: Schema.Types.ObjectId, ref: 'storehouses', required:true},
    name: { type: String, required: true },
    type: { type: String, enum: ['storage_zone', 'picking_zone', 'loading_dock'], required: true },
    aisles: [{ type: Schema.Types.ObjectId, ref: 'Aisle' }],
    status: {type: Boolean, default:true, required: false}

  },  {
    timestamps: true,
    versionKey: false,
});

  export const ZoneModel = mongoose.model<IZone>('Zone', ZoneSchema);