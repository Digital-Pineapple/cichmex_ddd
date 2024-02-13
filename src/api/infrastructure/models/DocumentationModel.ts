import { Schema, model } from 'mongoose';
import { IFile } from '../../domain/documentation/DocumentationsEntity';
import MongooseDelete from 'mongoose-delete';

const FileSchema = new Schema<IFile>  (
    {
        
        name: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: true,
        },
        verify :{
            type: Boolean,
            required: true,

        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'Customer'

        },


    },
    {
        versionKey: false,
        timestamps: true,
    }
);

FileSchema.plugin(MongooseDelete, { overrideMethods:'all' });
 const FileModel = model('Files', FileSchema);

 export default FileModel;
