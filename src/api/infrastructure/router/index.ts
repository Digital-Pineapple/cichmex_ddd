import { Router } from 'express';

import authRouter from './auth/';
import authAdminRouter from './authAdmin';
import customerRouter from './customer/';
import serviceRouter from './services';
import typeCarRouter from './typeCar';
import categoryRouter from './Category';
import subCategoryRouter from './subCategory';
import commissionRouter from './commission';
import documentationRouter from './documentation';
import serviceCustomerRouter from './serviceCustomer';
import carDetailRouter from './carDetail';
import membershipRouter from './membership';
import membershipBenefitRouter from './membershipBenefit';
import branchOfficeRouter from './branchOffice';
import productRouter from './product';
import stockBranchRouter from './StockBranch';
import typeUserRouter from './typeUser';
import userRouter from './user';

export const apiRouter = (): Router => {

    const apiRouter = Router();

    apiRouter.use('/auth', authRouter);
    apiRouter.use('/user', userRouter);
    apiRouter.use('/auth/admin', authAdminRouter);
    // apiRouter.use('/customer', customerRouter);
    apiRouter.use('/services', serviceRouter);
    apiRouter.use('/type-car', typeCarRouter)
    apiRouter.use('/type-user', typeUserRouter)
    apiRouter.use('/category', categoryRouter)
    apiRouter.use('/sub-category', subCategoryRouter)
    apiRouter.use('/commission', commissionRouter)
    apiRouter.use('/documentation', documentationRouter)
    apiRouter.use('/service-customer', serviceCustomerRouter)
    apiRouter.use('/car_detail', carDetailRouter)
    apiRouter.use('/memberships', membershipRouter)
    apiRouter.use('/membership-benefits', membershipBenefitRouter )
    apiRouter.use('/branch-offices', branchOfficeRouter )
    apiRouter.use('/product', productRouter )
    apiRouter.use('/stock-branch', stockBranchRouter )



    return apiRouter;
}
const apiRouterx = Router();

apiRouterx.use('/auth', authRouter);
// apiRouterx.use('/auth/admin', authAdminRouter);
// apiRouterx.use('/customer', customerRouter);
apiRouterx.use('/services', serviceRouter);
apiRouterx.use('/type-car', typeCarRouter)
apiRouterx.use('/type-user', typeUserRouter)
apiRouterx.use('/category', categoryRouter)
apiRouterx.use('/sub-category', subCategoryRouter)
apiRouterx.use('/commission',commissionRouter)
apiRouterx.use('/documentation',documentationRouter)
apiRouterx.use('/service-customer', serviceCustomerRouter)
apiRouterx.use('/car-detail', carDetailRouter)
apiRouterx.use('/memberships', membershipRouter)
apiRouterx.use('/membership-benefit', membershipBenefitRouter)
apiRouterx.use('/branch-offices', branchOfficeRouter)
apiRouterx.use('/product', productRouter)
apiRouterx.use('/stock-branch', stockBranchRouter )


export default apiRouter