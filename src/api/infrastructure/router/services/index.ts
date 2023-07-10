import { Router } from 'express';

import { ServicesUseCase } from '../../../application/services/ServicesUseCase';
import { ServicesController } from '../../controllers/services/ServiceController';
import { ServiceRepository } from '../../repository/services/ServiceRepository';

import ServiceModel from '../../models/ServicesModel';

const serviceRouter = Router();

const serviceRepository    = new ServiceRepository(ServiceModel);
const servicesUseCase      = new ServicesUseCase(serviceRepository);
const servicesController   = new ServicesController(servicesUseCase);

serviceRouter
    .get('/', servicesController.getAllServices)
    .get('/:id', servicesController.getService)
    .post('/', servicesController.createService)
    .patch('/:id', servicesController.updateService)
    .delete('/:id', servicesController.deleteService)
    .get('/search/search', servicesController.searchService)
    

export default serviceRouter;

