import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ConsumeCouponEntity } from '../../domain/discountCoupon/DiscountCouponEntity';
import { ConsumeCouponRepository } from '../../domain/discountCoupon/DiscountCouponRepository'

export class ConsumeCouponUseCase {

    constructor(private readonly consumeCouponRepository: ConsumeCouponRepository) { }

    public async findAllConsumeCoupons(): Promise<ConsumeCouponEntity[] | ErrorHandler | null> {
        return await this.consumeCouponRepository.findAll()
    }

    public async findOneConsumeCoupon(user:any,discount_coupon:any ): Promise<ConsumeCouponEntity[] | ErrorHandler | null> {
        return await this.consumeCouponRepository.findOneItem({user:user, discount_coupon:discount_coupon})
    }

    public async createConsumeCoupon( body: any): Promise<ConsumeCouponEntity | ErrorHandler | null> {
        
        const noRepeat = await this.consumeCouponRepository.findOneItem({user:body.user, discount_coupon:body.discount_coupon})
        if (noRepeat) {
            return new ErrorHandler('Cupón canjeado anteriormente',500)
        }
         return await this.consumeCouponRepository.createOne({...body})
    }

    public async updateDiscountCoupon( id: string, updated: any): Promise<ConsumeCouponEntity | ErrorHandler | null> {
        
        return await this.consumeCouponRepository.updateOne(id,{...updated})
    }
    public async deleteDiscountCoupon( id: string): Promise<ConsumeCouponEntity | ErrorHandler | null> {
        
        return await this.consumeCouponRepository.updateOne(id,{status:false})
    }

}