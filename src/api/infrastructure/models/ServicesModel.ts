import { Schema, model } from 'mongoose';
import { ServicesEntity } from '../../domain/services/ServicesEntity';

import MongooseDelete = require('mongoose-delete')

const ServiceSchema = new Schema<ServicesEntity>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false

    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'

    }
}, {
    versionKey: false,
    timestamps: true,
},

);
ServiceSchema.plugin(MongooseDelete,{overrideMethods:true})

const ServiceModel = model('Services', ServiceSchema);

export default ServiceModel;
