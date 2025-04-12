import mongoose, { Schema, Document } from 'mongoose';

export interface IState extends Document {
    name: string;
    country: string;
    status: boolean;
}

const StateSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        country: { type: String, required: true, default: "MX" },
        status: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IState>('State', StateSchema);
