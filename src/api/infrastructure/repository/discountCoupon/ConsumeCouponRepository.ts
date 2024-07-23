import { Model } from 'mongoose';
import { ConsumeCouponRepository as ConsumeCouponConfig } from '../../../domain/discountCoupon/DiscountCouponRepository';
import { MongoRepository } from '../MongoRepository';
import { ConsumeCouponEntity } from '../../../domain/discountCoupon/DiscountCouponEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';


export class ConsumeCouponRepository extends MongoRepository implements ConsumeCouponConfig {

    constructor(protected DiscountCouponModel: Model<any>) {
        super(DiscountCouponModel)
    }

    async findOneConsumeCoupon(user_id: any, coupon_id:any): Promise<ConsumeCouponEntity | ErrorHandler | null>{
        const noRepeat = await this.DiscountCouponModel.find({user: user_id, coupon_discount: coupon_id})  
        if (noRepeat) {
            return new ErrorHandler('Codigo canjeado', 500)
        }
        return noRepeat
       }
   
}