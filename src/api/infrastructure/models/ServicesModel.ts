import { Schema, model } from 'mongoose';
import { ServicesEntity } from '../../domain/services/ServicesEntity';

const ServiceSchema = new Schema<ServicesEntity>({
    name: {
        type    : String,
        required: true,
    },
    description: {
        type    : String,
        required: true,
    },
    status: {
        type    : Boolean,
        default : true,
    },
    subCategory:{
        type: Schema.Types.ObjectId,
        ref:'SubCategory'

      }
},{
    versionKey  : false,
    timestamps  : true,
},

);

const ServiceModel = model('Service', ServiceSchema);

export default ServiceModel;
