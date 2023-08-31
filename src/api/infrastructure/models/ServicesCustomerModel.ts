import { Schema, model } from 'mongoose';
import { ServiceCustomer, IServices } from '../../domain/servicesCustomer/ServicesCustomerEntity';


const MyServicesCustomerSchema = new Schema<IServices>({
    _id :{
        type:String,
        required: true,
    },
    name: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        required: true,
    },
    service_image: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    SubCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'

    }
})



const ServicesCustomerSchema = new Schema<ServiceCustomer>(
    {
        
        customer_id: {
            type: Schema.Types.ObjectId,
            ref: 'CustomerEntity'
        },
        services: [MyServicesCustomerSchema],
        status:{
            type:Boolean,
            default: true,
        }
        
       
    }, {
    versionKey: false,
    timestamps: true,
})

const ServiceCustomerModel = model('ServiceCustomer', ServicesCustomerSchema)

export default ServiceCustomerModel;