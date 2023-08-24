import { Schema, model } from 'mongoose';
import {ServiceCustomer } from '../../domain/servicesCustomer/ServicesCustomerEntity'
const ServicesCustomerSchema = new Schema<ServiceCustomer>(
    {
    service :{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    customer : {
        type: Schema.Types.ObjectId,
    ref: 'Customer'
    },
    
}) 