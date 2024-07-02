import mongoose, { Schema, model } from 'mongoose';import { TypeUserEntity } from '../../domain/typeUser/TypeUserEntity';


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
        required : false,
 
    },
    status:{
        type:Boolean,
        required:false,
        default:true,
       }

}, {
    versionKey: false,
    timestamps: true,
});

const TypeUserModel =  model('TypeUser', TypeUserSchema);

export default TypeUserModel;