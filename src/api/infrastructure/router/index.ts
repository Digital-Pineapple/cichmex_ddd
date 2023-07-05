import { Router } from 'express';

import authRouter from './auth/';
import authAdminRouter from './authAdmin';
import customerRouter from './customer/';
import servicesRouter from './services';
import typeCarRouter from './typeCar';
import typeCustomer from './typeCustomer';
import categoryRouter from './category';

export const apiRouter = (): Router => {

    const apiRouter = Router();

    apiRouter.use('/auth', authRouter);
    apiRouter.use('/auth/admin', authAdminRouter);
    apiRouter.use('/customer', customerRouter);
    apiRouter.use('/services', servicesRouter);
    apiRouter.use('/type-car', typeCarRouter)
    apiRouter.use('/type-customer', typeCustomer)
    apiRouter.use('/category', categoryRouter)


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

export default apiRouter