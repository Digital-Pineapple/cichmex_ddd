
import mongoose, {  Schema,  model, Document } from 'mongoose';
import  {PaymentEntity}  from '../../../domain/payments/PaymentEntity';
import MongooseDelete from 'mongoose-delete';


const PaymentSchema = new Schema<PaymentEntity>({
    MP_info: {
        type: Object,
        required:true
    }
   
}, {
    versionKey: false,
    timestamps: true,
});

PaymentSchema.plugin(MongooseDelete,{overrideMethods:'all'})

const PaymentModel = mongoose.model<PaymentEntity> ('Payment', PaymentSchema);
export default PaymentModel;
