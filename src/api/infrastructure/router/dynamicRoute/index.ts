import { Router } from 'express';
import { DynamicRouteRepository } from '../../repository/dynamicRoute/DynamicRouteRepository';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { DynamicRouteUseCase } from '../../../application/dynamicRoutes/DynamicRouteUseCase';
import { DynamicRouteController } from '../../controllers/dynamicRoute/DynamicRouteController';
import DynamicRoutesModel from '../../models/dynamicRoute/DynamicRoute';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const dynamicRouteRouter = Router();

const dynamicRouteRepository = new DynamicRouteRepository(DynamicRoutesModel);
const dynamicRouteUseCase = new DynamicRouteUseCase(dynamicRouteRepository);
const dynamicRouteController = new DynamicRouteController(dynamicRouteUseCase);
const userValidations = new UserValidations();

dynamicRouteRouter
    .get('/all', userValidations.authTypeUserValidation(['SUPER-ADMIN']), dynamicRouteController.getAllRoutes)
    .get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), dynamicRouteController.getOneRoute)
    .get('/links/all', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN', 'CARRIER-DRIVER', "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), dynamicRouteController.getRoutes)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, dynamicRouteController.CreateRoute)
    .put('/update/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, dynamicRouteController.UpdateRoute)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, dynamicRouteController.DeleteRoute)
export default dynamicRouteRouter;