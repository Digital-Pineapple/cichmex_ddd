
import mongoose, {  Schema,  model, Document } from 'mongoose';
import  {PaymentEntity}  from '../../../domain/payments/PaymentEntity';
import MongooseDelete, { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';


const PaymentSchema = new Schema<PaymentEntity>({
    id: {
        type: String
    },
    quantity: {
        type: Number,
        required: false,
    },
    title: {
        type: String,
    },
    unit_price: {
        type: Number,
    },
    category_id: {
        type: String,
        required: false,
    },
    currency_id: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    picture_url: {
        type: String,
        required: false,
    }
}, {
    versionKey: false,
    timestamps: true,
});

PaymentSchema.plugin(MongooseDelete,{overrideMethods:'all'})

const PaymentModel = mongoose.model<PaymentEntity> ('Payment', PaymentSchema);
export default PaymentModel;
