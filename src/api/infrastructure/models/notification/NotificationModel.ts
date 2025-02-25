import mongoose, { Schema } from "mongoose";
import { INotification } from "../../../domain/notification/NotificationEntity";

const notificationSchema = new mongoose.Schema<INotification>(
   {
    from: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    channel : {
        type: String,
        enum: ["email", "sms", "inApp"],
        default: "inApp",
        required: true
    }, 
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["promotion", "order", "payment"]
    },   
    resource_id: {
        type: Schema.Types.ObjectId,
        required: false,        
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,   
    },
    readed: {
        type: Boolean,
        required: true,
        default: false,
    },
    status: {
        type: Boolean,
        required: false,
        default: true,
    }, 
},
{
    versionKey: false,
    timestamps: true
  }     
);
const NotificationModel = mongoose.model<any>(
    'Notifications',
    notificationSchema
);
  
export default NotificationModel;