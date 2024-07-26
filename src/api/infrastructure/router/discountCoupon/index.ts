import { Router } from 'express';
import { DiscountCouponRepository } from '../../repository/discountCoupon/DiscountCouponRepository';
import { DiscountCouponUseCase } from '../../../application/discountCoupon/DiscountCouponUseCase';
import { DiscountCouponController } from '../../controllers/discountCoupon/DiscountCouponController';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import DiscountCouponModel from '../../models/discountCoupon/DiscountCouponModel';
import { ConsumeCouponRepository } from '../../repository/discountCoupon/ConsumeCouponRepository';
import ConsumeCouponModel from '../../models/discountCoupon/ConsumeCouponModel';
import { ConsumeCouponUseCase } from '../../../application/discountCoupon/ConsumeCouponUseCase';
import { MomentService } from '../../../../shared/infrastructure/moment/MomentService';


const discountCouponRouter = Router();
const momentService = new MomentService()

const discountCouponRepository    = new DiscountCouponRepository(DiscountCouponModel);
const consumeCouponRepository    = new ConsumeCouponRepository(ConsumeCouponModel)

const discountCouponUseCase      = new DiscountCouponUseCase (discountCouponRepository, momentService); 
const consumeCouponUseCase       = new ConsumeCouponUseCase(consumeCouponRepository)

const discountCouponController   = new DiscountCouponController(discountCouponUseCase, consumeCouponUseCase);

const userValidations = new UserValidations();

discountCouponRouter

    .get('/', discountCouponController.getAllDiscountCoupons)
    .post('/find',userValidations.authTypeUserValidation(['CUSTOMER']), discountCouponController.findCoupon )
    .post('/',  userValidations.authTypeUserValidation(['SUPER-ADMIN']), discountCouponController.createDiscountCoupon)
    .post('/consume',  userValidations.authTypeUserValidation(['CUSTOMER']), discountCouponController.consumeOneCoupon)
    .put('/:id',  userValidations.authTypeUserValidation(['SUPER-ADMIN']), discountCouponController.updateDiscountCoupon)
    .delete('/:id',  userValidations.authTypeUserValidation(['SUPER-ADMIN']), discountCouponController.deleteDiscountCoupon)

export default discountCouponRouter;

