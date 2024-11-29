import mongoose, { model, Schema } from "mongoose";
import { storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';
import { AttributesVariantEntity, VariantProductEntity } from "../../../domain/variantProduct/variantProductEntity";

const AttributesSchema = new mongoose.Schema<AttributesVariantEntity>(
    {

        color: {
            type: Object,
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
        product_id: {
            type: mongoose.Types.ObjectId,
            ref: 'products',
            required: true,
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
        status: {
            type: Boolean,
            required: false,
            default: true,
        },
        images: {
            type: Array,
            required: false,
        },
        price: { type: Number, required: true },
        discountPrice: { type: Number, required: false },
        porcentDiscount: { type: Number, required: false },
        dimensions: { type: String, required: false },
        currency: { type: String, required: false, default: 'MX' },
        weight: { type: Number, required: false },
        rating: { type: Number, required: false },

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



