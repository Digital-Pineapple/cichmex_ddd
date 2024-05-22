import mongoose, { model, Schema } from "mongoose";
import { ProductOrderEntity } from "../../../domain/product/ProductEntity";


const ProductOrderSchema = new Schema<ProductOrderEntity>(
  {
    payment: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref:'Payment'
    },
    products: {
      type: Array,
      required:false
    },
    discount: {
      type: Number,
      required: false,
    },
    subTotal: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: false,
    },
    branch:{
      type: mongoose.Types.ObjectId,
      required:false,
      ref:'BranchOffices'
    },
    deliveryStatus: {
      type: Boolean,
      required: false,
      default: false
    },
    status:{
      type:Boolean,
      required:false,
      default:true,
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
