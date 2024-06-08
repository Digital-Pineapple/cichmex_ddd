import mongoose from "mongoose";
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



