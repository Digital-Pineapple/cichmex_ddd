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
import { ShoppingCartRepository } from '../../repository/shoppingCart/ShoppingCartRepository';
import ShoppingCartModel from '../../models/ShoppingCartModel';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import { ProductOrderRepository } from '../../repository/product/ProductOrderRepository';
import ProductOrderModel from '../../models/products/ProductOrderModel';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';


const discountCouponRouter = Router();
const momentService = new MomentService()

const discountCouponRepository    = new DiscountCouponRepository(DiscountCouponModel);
const consumeCouponRepository    = new ConsumeCouponRepository(ConsumeCouponModel);
const shoppingCartRespository = new ShoppingCartRepository(ShoppingCartModel)
const productOrderRepository = new ProductOrderRepository(ProductOrderModel)

const discountCouponUseCase      = new DiscountCouponUseCase (discountCouponRepository, momentService); 
const consumeCouponUseCase       = new ConsumeCouponUseCase(consumeCouponRepository);
const shoppingCartUseCase   = new ShoppingCartUseCase(shoppingCartRespository)
const productOrderUseCase = new ProductOrderUseCase(productOrderRepository)

const discountCouponController   = new DiscountCouponController(discountCouponUseCase, consumeCouponUseCase, shoppingCartUseCase, productOrderUseCase);

const userValidations = new UserValidations();

discountCouponRouter

    // .get('/all', userValidations.authTypeUserValidation(['SUPER-ADMIN']), discountCouponController.getAllDiscountCoupons)
    .get('/all', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), discountCouponController.getAllDiscountCoupons)
    .get('/',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), discountCouponController.getAllDiscountCoupons)
    .get('/get_one/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), discountCouponController.getOneDiscountDetail)
    .post('/find',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN', 'CUSTOMER']), discountCouponController.findCoupon )
    // .post('/',  userValidations.authTypeUserValidation(['SUPER-ADMIN']), discountCouponController.createDiscountCoupon)
    .post('/',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, discountCouponController.createDiscountCoupon)
    .post('/consume',  userValidations.authTypeUserValidation(['CUSTOMER']), discountCouponController.consumeOneCoupon)
    .put('/update/:id',  userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger,  discountCouponController.updateDiscountCoupon)
    .put('/changeActive/:id',  userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, discountCouponController.changeActiveDiscount)
    .delete('/:id',  userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, discountCouponController.deleteDiscountCoupon)

export default discountCouponRouter;

