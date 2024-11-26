import mongoose, { model, Schema } from "mongoose";
import { SHLocation, storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';
import { ProductImageEntity } from "../../../domain/product/ProductEntity";
import { VariantProductEntity } from "../../../domain/variantProduct/variantProductEntity";
import { StockStoreHouseEntity } from '../../../domain/storehouse/stockStoreHouseEntity'

const ProductImageSchema = new mongoose.Schema<ProductImageEntity>(
    {
        _id: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId
        },
        url: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true

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
            type: Object,
            required: false,
        },
        design: {
            type: String,
            required: false,
        },

        stock: {
            type: StockStoreHouseEntity,
            ref:
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


export const StoreHouseModel = model<storeHouseEntity>(
    'StoreHouses',
    StoreHouseSchema
);



