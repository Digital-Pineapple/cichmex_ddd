import { Router } from 'express';

import authRouter from './auth/';
import serviceRouter from './services';
import typeCarRouter from './typeCar';
import categoryRouter from './Category';
import subCategoryRouter from './subCategory';
import commissionRouter from './commission';
import documentationRouter from './documentation';
import carDetailRouter from './carDetail';
import membershipRouter from './membership';
import membershipBenefitRouter from './membershipBenefit';
import branchOfficeRouter from './branchOffice';
import productRouter from './product';
import stockBranchRouter from './StockBranch';
import typeUserRouter from './typeUser';
import userRouter from './user';
import servicesInBranchRouter from './servicesInBranch';
import paymentRouter from './payments';
import shoppingCartRouter from './shoppingCart.ts';
import stockStoreHouseRouter from './stockStoreHouse';
import storeHouseRouter from './storeHouse';
import productOrderRouter from './productOrder';
import shippingCostRouter from './shippingCost';
import discountCouponRouter from './discountCoupon';
import socketsRouter from './sockets';
import dynamicRouteRouter from './dynamicRoute';
import regionRouter from './region';

export const apiRouter = (): Router => {

    const apiRouter = Router();

    apiRouter.use('/auth', authRouter);
    apiRouter.use('/dynamic-route', dynamicRouteRouter)
    apiRouter.use('/user', userRouter);
    apiRouter.use('/services', serviceRouter);
    apiRouter.use('/services-branch', servicesInBranchRouter);
    apiRouter.use('/type-car', typeCarRouter)
    apiRouter.use('/type-user', typeUserRouter)
    apiRouter.use('/category', categoryRouter)
    apiRouter.use('/sub-category', subCategoryRouter)
    apiRouter.use('/commission', commissionRouter)
    apiRouter.use('/documentation', documentationRouter)
    apiRouter.use('/car-detail', carDetailRouter)
    apiRouter.use('/memberships', membershipRouter)
    apiRouter.use('/membership-benefits', membershipBenefitRouter)
    apiRouter.use('/branch-offices', branchOfficeRouter)
    apiRouter.use('/product', productRouter)
    apiRouter.use('/product-order', productOrderRouter)
    apiRouter.use('/stock-branch', stockBranchRouter)
    apiRouter.use('/payments', paymentRouter)
    apiRouter.use('/region', regionRouter)
    apiRouter.use('/shipping-cost', shippingCostRouter)
    apiRouter.use('/shopping-cart', shoppingCartRouter)
    apiRouter.use('/stock-StoreHouse', stockStoreHouseRouter)
    apiRouter.use('/storehouse', storeHouseRouter)
    apiRouter.use('/coupons', discountCouponRouter)
    apiRouter.use('/socket', socketsRouter)

    return apiRouter;
}
const apiRouterx = Router();

apiRouterx.use('/auth', authRouter);
apiRouterx.use('/services', serviceRouter);
apiRouterx.use('/services-branch', servicesInBranchRouter)
apiRouterx.use('/type-car', typeCarRouter)
apiRouterx.use('/type-user', typeUserRouter)
apiRouterx.use('/category', categoryRouter)
apiRouterx.use('/sub-category', subCategoryRouter)
apiRouterx.use('/commission', commissionRouter)
apiRouterx.use('/documentation', documentationRouter)
apiRouterx.use('/car-detail', carDetailRouter)
apiRouterx.use('/memberships', membershipRouter)
apiRouterx.use('/membership-benefit', membershipBenefitRouter)
apiRouterx.use('/branch-offices', branchOfficeRouter)
apiRouterx.use('/product', productRouter)
apiRouterx.use('/product-order', productOrderRouter)
apiRouterx.use('/payments', paymentRouter)
apiRouterx.use('/dynamic-route', dynamicRouteRouter)
apiRouterx.use('/region', regionRouter)
apiRouterx.use('/stock-branch', stockBranchRouter)
apiRouterx.use('/shipping-cost', shippingCostRouter)
apiRouterx.use('/shopping-cart', shoppingCartRouter)

apiRouterx.use('/stock-StoreHouse', stockStoreHouseRouter)
apiRouterx.use('/storehouse', storeHouseRouter)
apiRouterx.use('/coupons', discountCouponRouter)



export default apiRouter