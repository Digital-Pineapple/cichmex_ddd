import mongoose, { model,  Schema } from "mongoose";
import {  storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';
import { AttributesVariantEntity, VariantProductEntity } from "../../../domain/variantProduct/variantProductEntity";

const AttributesSchema = new mongoose.Schema<AttributesVariantEntity>(
    {
      
        color: {
            type: String,
            required: false,
        },
        size: {
            type: String,
            default: false

        }, material: {
            type: String,
            default: false

        },

    },
    {
        versionKey: false,
        timestamps: true
    }

);
const variantProductSchema = new mongoose.Schema<VariantProductEntity>(
    {
        _id: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId
        },
        sku: {
            type: String,
            required: true,
        },
        attributes: {
            type: AttributesSchema,
            required: false,
        },
        design: {
            type: String,
            required: false,
        },

        stock: {
            type: mongoose.Types.ObjectId,
            ref: 'StoreHouseStocks',
            required: false,
        },
        status:{
            type:Boolean,
            required:false,
        }

    },
    {
        versionKey: false,
        timestamps: true
    }

);


export const VariantProductModel = model<VariantProductEntity>(
    'variant-product',
    variantProductSchema
);



