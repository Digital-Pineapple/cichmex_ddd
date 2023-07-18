import { Router } from 'express';

import authRouter from './auth/';
import authAdminRouter from './authAdmin';
import customerRouter from './customer/';
import servicesRouter from './services';
import typeCarRouter from './typeCar';
import typeCustomer from './typeCustomer';
import categoryRouter from './Category';
import subCategoryRouter from './subCategory';
import commissionRouter from './commission';

export const apiRouter = (): Router => {

    const apiRouter = Router();

    apiRouter.use('/auth', authRouter);
    apiRouter.use('/auth/admin', authAdminRouter);
    apiRouter.use('/customer', customerRouter);
    apiRouter.use('/services', servicesRouter);
    apiRouter.use('/type-car', typeCarRouter)
    apiRouter.use('/type-customer', typeCustomer)
    apiRouter.use('/category', categoryRouter)
    apiRouter.use('/sub-category', subCategoryRouter)
    apiRouter.use('/commission', commissionRouter)


    return apiRouter;
}
const apiRouterx = Router();

apiRouterx.use('/auth', authRouter);
apiRouterx.use('/auth/admin', authAdminRouter);
apiRouterx.use('/customer', customerRouter);
apiRouterx.use('/services', servicesRouter);
apiRouterx.use('/type-car', typeCarRouter)
apiRouterx.use('/type-customer', typeCustomer)
apiRouterx.use('/category', categoryRouter)
apiRouterx.use('/sub-category', subCategoryRouter)
apiRouterx.use('/commission',commissionRouter)

export default apiRouter