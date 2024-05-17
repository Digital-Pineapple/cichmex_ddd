import { Schema, model } from 'mongoose';

import { ShoppingCartEntity } from '../../domain/shoppingCart/shoppingCartEntity';

const ShoppingCartSchema = new Schema<ShoppingCartEntity>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    products: {
        type: Array,
        required: false,
        ref:'Products',
    },
    memberships: {
        type: Array,
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
},

);


const ShoppingCartModel = model('ShoppingCart', ShoppingCartSchema);

export default ShoppingCartModel;
