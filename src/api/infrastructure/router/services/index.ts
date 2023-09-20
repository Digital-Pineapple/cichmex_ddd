import { Router } from 'express';

import { ServicesUseCase } from '../../../application/services/ServicesUseCase';
import { ServicesController } from '../../controllers/services/ServiceController';
import { ServiceRepository } from '../../repository/services/ServiceRepository'; 
import ServiceModel from '../../models/ServicesModel';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ServiceValidations } from '../../../../shared/infrastructure/validation/Service/ServiceValidation';

const serviceRouter = Router();

const serviceRepository    = new ServiceRepository(ServiceModel);
const servicesUseCase      = new ServicesUseCase(serviceRepository, serviceRepository);
const s3Service            = new S3Service();
const serviceValidations   = new ServiceValidations();
const servicesController   = new ServicesController(servicesUseCase, s3Service);

serviceRouter
    .get('/', servicesController.getAllServices)
    .get('/:id', servicesController.getService)
    .post('/', servicesController.createService)
    .post('/:id', serviceValidations.servicePhotoValidation, servicesController.updateService )
    .delete('/:id', servicesController.deleteService)
    .get('/search/search', servicesController.searchService)
    

export default serviceRouter;

