import mongoose, { Schema, model } from 'mongoose';import { TypeUserEntity } from '../../domain/typeUser/TypeUserEntity';

import MongooseDelete = require("mongoose-delete");

const TypeUserSchema = new Schema<TypeUserEntity> ({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
    name: {
        type   : String,
        required: true
    }, 
    type :{
        type:Number,
        required : true,
    }

}, {
    versionKey: false,
    timestamps: true,
});
TypeUserSchema.plugin(MongooseDelete, { overrideMethods:true });
const TypeUserModel =  model('TypeUser', TypeUserSchema);

export default TypeUserModel;