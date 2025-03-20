import mongoose, { model, Schema } from "mongoose";
import { ProductOrderEntity } from "../../../domain/product/ProductEntity";
/*
order_status : {
 0: 'pendiente pago',
 1: 'verificar pago',
 2: 'preparar orden',
 3: "surtido en almacén",
 4: "cargada por transportista",
 5: "Enviado a punto de entrega"
 6: 'en punto entrega,
 7: 'enviado a domicilio',
 8: 'entregado',
 9: 'cancelado',  

}
*/
const ProductOrderSchema = new Schema<ProductOrderEntity>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    order_id: {
      type: String,
      required: true,
      unique: true
    },
    payment: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Payment'
    },
    payment_status:{
      type:String,
      required:true
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Users'
    },
    products: {
      type: Array,
      required: false
    },
    discount: {
      type: Number,
      required: false,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    shipping_cost: {
      type: Number,
      required: false,
    },
    branch: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'BranchOffices'
    },
    storeHouseStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
    supply_detail: {
      type: Array,
      required: false,
    },
    route_detail: {
      type: Object,
      required: false,
    },
    deliveryStatus: {
      type: Boolean,
      required: false,
      default: false
    },
    deliveryLocation: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'Address'
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    download_ticket: {
      type: String,
      required: false,
    },
    route_status: {
      type: Boolean,
      default: false,
      required: false,
    },
    point_pickup_status: {
      type: Boolean,
      required: false,
    },
    paymentType: {
      type: Object,
      required: false,
    },
    typeDelivery: {
      type: String,
      enum: ['homedelivery', 'pickup'],
      required: true
    },
    origin: {
      type: String,
      required: false,
      enum: ['web', 'mobile']
    },
    requiredTax: {
      type: Boolean,
      required: false,
      default: false
    },
    facturapi_tax_id: {
      type: String,
      required: false,      
    },
    tax_expiration_date: {
      type: Date,
      required: false
    },
    order_status: {
      type: Number,
      required: true,      
      default: 0,
    },
    coupon: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    verification:{
      type: Object,
      required:false
    }     
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const ProductOrderModel = model<ProductOrderEntity>(
  'ProductOrders',
  ProductOrderSchema
);

export default ProductOrderModel;
