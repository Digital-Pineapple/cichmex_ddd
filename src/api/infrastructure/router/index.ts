import { Router } from 'express';

import authRouter from './auth/';
import authAdminRouter from './authAdmin';
import customerRouter from './customer/';
import serviceRouter from './services';
import typeCarRouter from './typeCar';
import typeCustomer from './typeCustomer';
import categoryRouter from './Category';
import subCategoryRouter from './subCategory';
import commissionRouter from './commission';
import documentationRouter from './documentation';
import serviceCustomerRouter from './serviceCustomer';
import carDetailRouter from './carDetail';
import membershipRouter from './membership';

export const apiRouter = (): Router => {

    const apiRouter = Router();

    apiRouter.use('/auth', authRouter);
    apiRouter.use('/auth/admin', authAdminRouter);
    apiRouter.use('/customer', customerRouter);
    apiRouter.use('/services', serviceRouter);
    apiRouter.use('/type-car', typeCarRouter)
    apiRouter.use('/type-customer', typeCustomer)
    apiRouter.use('/category', categoryRouter)
    apiRouter.use('/sub-category', subCategoryRouter)
    apiRouter.use('/commission', commissionRouter)
    apiRouter.use('/documentation', documentationRouter)
    apiRouter.use('/service-customer', serviceCustomerRouter)
    apiRouter.use('/car_detail', carDetailRouter)
    apiRouter.use('/memberships', membershipRouter)



    return apiRouter;
}
const apiRouterx = Router();

apiRouterx.use('/auth', authRouter);
apiRouterx.use('/auth/admin', authAdminRouter);
apiRouterx.use('/customer', customerRouter);
apiRouterx.use('/services', serviceRouter);
apiRouterx.use('/type-car', typeCarRouter)
apiRouterx.use('/type-customer', typeCustomer)
apiRouterx.use('/category', categoryRouter)
apiRouterx.use('/sub-category', subCategoryRouter)
apiRouterx.use('/commission',commissionRouter)
apiRouterx.use('/documentation',documentationRouter)
apiRouterx.use('/service-customer', serviceCustomerRouter)
apiRouterx.use('/car-detail', carDetailRouter)
apiRouterx.use('/memberships', membershipRouter)

export default apiRouter