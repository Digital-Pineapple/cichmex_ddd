import { UserEntity } from "../user/UserEntity";



 export interface PaymentEntity  {
  uuid?: string;
  user_id?: UserEntity,
  MP_info?: object;
  status?:boolean;
  payment_status?: string
  system?: string,
  products?: object,
  ticket?: ticketVerify,
}

export interface ticketVerify {
  image?: string,
  verified?: boolean,
  verifiedAt ?: string,
  note?: string,
  amount?: string,
  reference?: string
}



