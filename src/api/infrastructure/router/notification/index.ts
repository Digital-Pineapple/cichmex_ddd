

import { Router } from 'express';
import { NotificationController } from '../../controllers/notifications/NotificationController';
import UserModel from '../../models/UserModel';
import { UserRepository } from '../../repository/user/UserRepository';
import { NotificationRepository } from '../../repository/notifications/NotificationRepository';
import NotificationModel from '../../models/notification/NotificationModel';
import { NotificationUseCase } from '../../../application/Notifications/NotificationUseCase';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const notificationsRouter = Router();
const userRepository = new UserRepository(UserModel);
const notificationRepository = new NotificationRepository(NotificationModel)
const notificationUseCase = new NotificationUseCase(notificationRepository, userRepository);
const notificationController = new NotificationController(notificationUseCase);
const userValidations = new UserValidations();

notificationsRouter
    .get('/testingSocket', notificationController.sendEvent)
    .get('/user', userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN','SUPER-ADMIN','CUSTOMER', "CARRIER-DRIVER", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), notificationController.getByUser)
    .post('/', notificationController.create)    
    .put('/:id/markAsRead',userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN','SUPER-ADMIN','CUSTOMER', "CARRIER-DRIVER", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), notificationController.markAsRead)   
    .put('/markAllAsReaded',userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN','SUPER-ADMIN','CUSTOMER', "CARRIER-DRIVER", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), notificationController.markAllAsReaded)   
    .delete('/:id', notificationController.delete)
    
    export default notificationsRouter;
