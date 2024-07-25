import { Model } from 'mongoose';
import { DiscountCouponRepository as DiscountCouponConfig } from '../../../domain/discountCoupon/DiscountCouponRepository';
import { MongoRepository } from '../MongoRepository';


export class DiscountCouponRepository extends MongoRepository implements DiscountCouponConfig {

    constructor(protected DiscountCouponModel: Model<any>) {
        super(DiscountCouponModel)
    }

   
}