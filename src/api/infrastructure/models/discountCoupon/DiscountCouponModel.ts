import mongoose, { model, Schema } from "mongoose";
import { DiscountCouponEntity } from "../../../domain/discountCoupon/DiscountCouponEntity";

const DiscountCouponSchema = new Schema<DiscountCouponEntity>({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    uuid: {
        type: String,
        unique: true,
    },
    code: {
        type: String,
        required: true
    },
    porcent: {
        type: Number,
        required: false
    },
    fixed_amount: {
        type: Number,
        required: false,
    },
    free_shipping: {
        type: Boolean,
        required: false
    },
    unlimited: {
        type: Boolean,
        required: false
    },
    applications:{
        type: Number,
        required:false,
    },
    first_buy: {
        type: Boolean,
        required: false
    },
    expiration_date: {
        type: String,
        required: false
    },
    min_cart_amount: {
        type: Number,
        required: false
    }, 
    max_cart_amount: {
        type: Number,
        required: false
    }, 
    categories: {
        type: Array,
        required: false
    }, 
     status: {
        type: Boolean,
        required: false,
        default:true,
    },

}, {
    versionKey: false,
    timestamps: true,
});

const DiscountCouponModel = model('discountcoupons', DiscountCouponSchema);

export default DiscountCouponModel;