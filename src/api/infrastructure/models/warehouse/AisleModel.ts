import mongoose, { Schema } from "mongoose";
import { IAisle } from "../../../domain/warehouse/aisleEntity";

const AisleSchema = new Schema<IAisle>({
    name: { type: String, required: true },
    zone: { type: Schema.Types.ObjectId, ref: 'zones', required: true },
    sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
    status:{type:Boolean, default: true, required: false},
   

  }, {
    timestamps: true,
    versionKey: false,
});
  
  export const AisleModel = mongoose.model<IAisle>('Aisle', AisleSchema);