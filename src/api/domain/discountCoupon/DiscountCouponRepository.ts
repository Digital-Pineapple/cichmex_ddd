import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { ConsumeCouponEntity } from "./DiscountCouponEntity"

export interface DiscountCouponRepository extends MongoRepository {

}

export interface ConsumeCouponRepository extends MongoRepository{
    findOneConsumeCoupon(user_id: any, coupon_id:any): Promise<ConsumeCouponEntity | ErrorHandler | null>

}