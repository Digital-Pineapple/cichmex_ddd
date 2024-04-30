import mongoose, { model, Schema } from "mongoose";
import { SHLocation, storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';


import MongooseDelete = require("mongoose-delete");


const SHlocationSchema = new mongoose.Schema<SHLocation>(
    {
        state_id: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false,
        },
        municipality_id: {
            type: String,
            required: false

        },
        municipality: {
            type: String,
            required: false,
        },
        direction: {
            type: String,
            required: true,
        }


    },
    {
        versionKey: false,
    }
);
const StoreHouseSchema = new mongoose.Schema<storeHouseEntity>(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: false,
        },
        images: {
            type: Array,
            required: false,
        },

        location: {
            type: SHlocationSchema,
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

StoreHouseSchema.plugin(MongooseDelete, { overrideMethods: 'all' });

export const StoreHouseModel = model<storeHouseEntity>(
    'StoreHouses',
    StoreHouseSchema
);



