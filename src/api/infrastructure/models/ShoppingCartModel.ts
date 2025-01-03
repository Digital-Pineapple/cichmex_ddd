import { Schema, model } from 'mongoose';

import { ShoppingCartEntity } from '../../domain/shoppingCart/shoppingCartEntity';

const ShoppingCartSchema = new Schema<ShoppingCartEntity>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    products: [
        {
          item: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product' // Apunta al modelo de productos
          },
          variant: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'Variant' // Apunta al modelo de variantes
          },
          quantity: {
            type: Number,
            required: true,
            min: 1
          }
        }
      ],       
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
