
import { SoftDeleteDocument } from 'mongoose-delete';


 export interface PaymentEntity extends SoftDeleteDocument {

  id: string;
  quantity?: number;
  title: string;
  unit_price: number;
  category_id?: string;
  currency_id?: string;
  description?: string;
  picture_url?: string;
  
}



export interface TicketMPEntity extends SoftDeleteDocument {
    collection_id: string;
    collection_status: string;
    payment_id: string;
    payment_type: string;
    merchant_order_id: string;
    preference_id: string;
    site_id: string;
    processig_mode: string;
    merchant_account_id: string;


}
