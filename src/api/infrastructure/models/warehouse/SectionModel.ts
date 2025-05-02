import mongoose, { Schema } from "mongoose";
import { ISection } from "../../../domain/warehouse/sectionEntity";


const SectionSchema = new Schema<ISection>({
    storehouse: {type: Schema.Types.ObjectId, ref: 'storehouses', required:true},
    name: { type: String, required: true },
    aisle: { type: Schema.Types.ObjectId, ref: 'Aisle', required: true },
    capacity: { type: Number, default: 100 },
    locations: [{ type: Schema.Types.ObjectId, ref: 'LocationProduct' }],
    status:{ type: Boolean, required: false, default: true}
  },  {
    timestamps: true,
    versionKey: false,
});
  
  export const SectionModel = mongoose.model<ISection>('Section', SectionSchema);