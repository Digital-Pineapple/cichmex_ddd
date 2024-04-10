import { Schema, model } from 'mongoose';

import MongooseDelete = require('mongoose-delete')
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
}, {
    versionKey: false,
    timestamps: true,
},

);
ShoppingCartSchema.plugin(MongooseDelete,{overrideMethods:true})

const ShoppingCartModel = model('ShoppingCart', ShoppingCartSchema);

export default ShoppingCartModel;
