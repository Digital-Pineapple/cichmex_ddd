import { Schema, model } from 'mongoose';
import { ServicesEntity } from '../../domain/services/ServicesEntity';

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

    },
    status:{
        type:Boolean,
        required:false,
        default:true,
       }
}, {
    versionKey: false,
    timestamps: true,
},

);

const ServiceModel = model('Services', ServiceSchema);

export default ServiceModel;
