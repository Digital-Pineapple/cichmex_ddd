import mongoose, { model, Schema } from "mongoose";
import { ColorProductEntity } from "../../../domain/colorProduct/ColorProductEntity";

const ColorProductSchema = new Schema<ColorProductEntity>({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    name: {
        type: String,  
        required:true,
    },
    hex: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true,
});

const ColorProductModel = model('colorProducts', ColorProductSchema);

export default ColorProductModel;