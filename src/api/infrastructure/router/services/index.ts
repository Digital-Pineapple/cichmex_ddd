import { Router } from 'express';

import { ServicesUseCase } from '../../../application/services/ServicesUseCase';
import { ServicesController } from '../../controllers/services/ServiceController';
import { ServiceRepository } from '../../repository/services/ServiceRepository'; 
import ServiceModel from '../../models/ServicesModel';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ServiceValidations } from '../../../../shared/infrastructure/validation/Service/ServiceValidation';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const serviceRouter = Router();

const serviceRepository    = new ServiceRepository(ServiceModel);
const servicesUseCase      = new ServicesUseCase(serviceRepository, serviceRepository);
const s3Service            = new S3Service();
const serviceValidations   = new ServiceValidations();
const servicesController   = new ServicesController(servicesUseCase, s3Service);
const userValidations = new UserValidations();

serviceRouter
    .get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER','CUSTOMER']), servicesController.getAllServices)
    .get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER','CUSTOMER']), servicesController.getService)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER']),serviceValidations.servicePhotoValidation, servicesController.createService)
    .post('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),serviceValidations.servicePhotoValidation, servicesController.updateService )
    .delete('/:id', userValidations.authTypeUserValidation(['PARTNER']), servicesController.deleteService)
    .get('/search/search', userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER','CUSTOMER']), servicesController.searchService)
    

export default serviceRouter;

