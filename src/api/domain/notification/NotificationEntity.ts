import mongoose, { Schema } from "mongoose";
import { UserEntity } from "../user/UserEntity";



 export interface NotificationEntity  {
  uuid      ?: string;
  user_id   ?: UserEntity,
  message   ?: string;
  status    ?: boolean;
  read      ?: boolean;
  type      ?: string;
  products  ?: object;

  
}

export interface INotification {
    from: mongoose.Schema.Types.ObjectId | null;
    channel: "email" | "sms" | "inApp";
    type: string;
    resource_id: Schema.Types.ObjectId ;
    message: string;
    readed: boolean;
    user_id: Schema.Types.ObjectId;
    status?: boolean;
}



