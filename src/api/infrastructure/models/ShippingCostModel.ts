import { Schema, model } from 'mongoose';
import { ShippingCostEntity } from '../../domain/shippingCost/ShippingCostEntity';

const ShippingCostSchema = new Schema<ShippingCostEntity>({
    uuid:{
        type:String,
        required:true,
    },
    starting_weight: {
        type: Number,
        required: false,
    },
    end_weight: {
        type: Number,
        required: false,
    },
    price_weight: {
        type: Number,
        required: false

    },
    status:{
        type:Boolean,
        default:true,
       }
}, {
    versionKey: false,
    timestamps: true,
},

);


const ShippingCostModel = model('ShippingCost', ShippingCostSchema);

export default ShippingCostModel;

