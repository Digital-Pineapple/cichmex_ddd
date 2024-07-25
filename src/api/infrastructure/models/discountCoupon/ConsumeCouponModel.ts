import mongoose, { model, Schema } from "mongoose";
import { ConsumeCouponEntity } from "../../../domain/discountCoupon/DiscountCouponEntity";

const ConsumeCouponSchema = new Schema<ConsumeCouponEntity>({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    uuid: {
        type: String,
        unique: true,
    },
    user: {
        type: String,
        ref:'users',
        required: true
    },
    discount_coupon: {
        type: String,
        ref:'discountcoupons',
        required: true
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

const ConsumeCouponModel = model('consumecoupons', ConsumeCouponSchema);

export default ConsumeCouponModel;