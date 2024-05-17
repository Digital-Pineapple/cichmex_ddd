import { Schema, model, plugin } from 'mongoose';
import { TypeCarEntity } from '../../domain/typeCar/TypeCarEntity';

const TypeCarSchema = new Schema<TypeCarEntity>({
    name: {
        type: String,
        required: true,
    },
    typeCar_image: {
        type: String,
        required: false
    },
    status:{
        type:Boolean,
        required:false,
        default:true,
       }

}, {
    versionKey: false,
    timestamps: true,
});


const TypeCarModel = model('TypeCar', TypeCarSchema);

export default TypeCarModel;