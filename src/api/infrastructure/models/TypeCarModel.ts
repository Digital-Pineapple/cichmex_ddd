import { Schema, model } from 'mongoose';
import { TypeCarEntity } from '../../domain/typeCar/TypeCarEntity';


const TypeCarSchema = new Schema<TypeCarEntity>({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    typeCar_image: {
        type: String,
        required: false
    },

}, {
    versionKey: false,
    timestamps: true,
});

const TypeCarModel = model('TypeCar', TypeCarSchema);

export default TypeCarModel;