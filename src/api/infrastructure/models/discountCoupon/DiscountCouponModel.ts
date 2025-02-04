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
    name:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required: false,
    },
    code: {
        type: String,
        required: false
    },
    percent: {
        type: Number,
        required: false
    },
    fixed_amount: {
        type: Number,
        required: false,
    },
    type_discount:{
        type: String,
        required: true,
        enum: ['free_shipping', 'first_buy', 'for_creators','is_amount','is_percent'],

    },
    unlimited: {
        type: Boolean,
        required: false
    },
    start_date:{
        type: Date,
        required: true,
    },
    expiration_date: {
        type: Date,
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
    for_all_products:{
        type:Boolean,
        required: true,
    },
    products:{
        type: [Schema.Types.ObjectId],
        ref:'Products',
        required: false,
    },
   
    creator_id:{
        type: Schema.Types.ObjectId,
        required: false,
    },
     status: {
        type: Boolean,
        required: false,
        default:true,
    },
    is_active:{
        type: Boolean,
        required: false,
        default: true, 
    },
    maxUses:{
        type:Number,
        required:false
    },

}, {
    versionKey: false,
    timestamps: true,
});

const DiscountCouponModel = model('discountcoupons', DiscountCouponSchema);

export default DiscountCouponModel;