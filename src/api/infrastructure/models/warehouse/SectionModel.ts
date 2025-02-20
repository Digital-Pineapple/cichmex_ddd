import mongoose, { Schema } from "mongoose";
import { ISection } from "../../../domain/warehouse/sectionEntity";

const SectionSchema = new Schema<ISection>({
    name: { type: String, required: true },
    aisle: { type: Schema.Types.ObjectId, ref: 'Aisle', required: true },
    capacity: { type: Number, default: 100 },
    stock: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 0 },
      code: { type: String, required: true } // Código único para stock en la sección
    }],
    status:{ type: Boolean, required: false, default: true}
  },  {
    timestamps: true,
    versionKey: false,
});
  
  export const SectionModel = mongoose.model<ISection>('Section', SectionSchema);