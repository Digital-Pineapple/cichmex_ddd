import mongoose, { Schema } from "mongoose";
import { ISection } from "../../../domain/warehouse/sectionEntity";

const SectionSchema = new Schema<ISection>({
    storehouse: {type: Schema.Types.ObjectId, ref: 'storehouses', required:true},
    name: { type: String, required: true },
    aisle: { type: Schema.Types.ObjectId, ref: 'Aisle', required: true },
    capacity: { type: Number, default: 100 },
    stock: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      variant:{ type: Schema.Types.ObjectId, ref: 'Variants'},
      type: { type: String, enum: ['unique_product', 'variant_product'], required: true },
      quantity: { type: Number, default: 0 },
      code: { type: String, required: true } 
    }],
    status:{ type: Boolean, required: false, default: true}
  },  {
    timestamps: true,
    versionKey: false,
});
  
  export const SectionModel = mongoose.model<ISection>('Section', SectionSchema);