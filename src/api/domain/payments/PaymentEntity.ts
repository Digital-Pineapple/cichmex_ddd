
import { SoftDeleteDocument } from 'mongoose-delete';


 export interface PaymentEntity extends SoftDeleteDocument {

  MP_info: object;
  
}



