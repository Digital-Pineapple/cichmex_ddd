import mongoose, { Schema, model } from 'mongoose';import { TypeUserEntity } from '../../domain/typeUser/TypeUserEntity';
import { generateUUID } from '../../../shared/infrastructure/validation/Utils';


const TypeUserSchema = new Schema<TypeUserEntity> ({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
    uuid:{
        type:String,
        unique:true,
    },
    system: {
        type   : [] ,
        required:true
      

    }, 
    role :{
        type:[],
        required:true
       
        
 
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