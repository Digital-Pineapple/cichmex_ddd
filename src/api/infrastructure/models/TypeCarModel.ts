import { Schema, model, plugin } from 'mongoose';
import { TypeCarEntity } from '../../domain/typeCar/TypeCarEntity';
import MongooseDelete = require("mongoose-delete");

const TypeCarSchema = new Schema<TypeCarEntity>({
    name: {
        type: String,
        required: true,
    },
    typeCar_image: {
        type: String,
        required: false
    },

}, {
    versionKey: false,
    timestamps: true,
});

TypeCarSchema.plugin(MongooseDelete, { overrideMethods: true})

const TypeCarModel = model('TypeCar', TypeCarSchema);

export default TypeCarModel;