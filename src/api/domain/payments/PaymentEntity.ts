
import { SoftDeleteDocument } from 'mongoose-delete';


  interface PaymentEntity extends SoftDeleteDocument {

  id: string;
  quantity?: number;
  title: string;
  unit_price: number;
  category_id?: string;
  currency_id?: string;
  description?: string;
  picture_url?: string;
  
}

export default PaymentEntity


