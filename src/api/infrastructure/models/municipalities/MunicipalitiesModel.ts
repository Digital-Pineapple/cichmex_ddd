import mongoose, { Schema, Document } from 'mongoose';

export interface IMunicipality extends Document {
    name: string;
    state_id: string;
    status: boolean;
}

const MunicipalitySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        state_id: { type: mongoose.Types.ObjectId, required: true },
        status: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IMunicipality>('Municipality', MunicipalitySchema);
