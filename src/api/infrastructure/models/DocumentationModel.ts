import { Schema, model } from 'mongoose';
import { IFile } from '../../domain/documentation/DocumentationsEntity';

const FileSchema = new Schema<IFile>(
    {
        
        name: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: false,
        },
        status: {
            type: Boolean,
            required: true,

        },
        url: {
            type: String,
            required: true,
        },
        verify :{
            type: Boolean,
            required: true,

        },
        customer_id: {
            type: Schema.Types.ObjectId,
            ref: 'Customer'

        },


    },
    {
        versionKey: false,
        timestamps: true,
    }
);
 const FileModel = model('FileModel', FileSchema);

 export default FileModel;
