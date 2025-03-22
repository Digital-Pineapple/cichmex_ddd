import mongoose, { model, Schema } from "mongoose";
const MetadataSchema = new Schema<any>(
  {  
    data: {
      type: Object,
      required: true,      
    },   
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const MetadataModel = model<any>(
  'Metadata',
  MetadataSchema
  
);

export default MetadataModel;
