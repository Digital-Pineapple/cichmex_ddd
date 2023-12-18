import { Router } from 'express';
import { ServicesCustomerRepository } from '../../repository/ServicesCustomer/ServicesCustomerRepository';
import { ServiceCustomerUseCase } from '../../../application/servicesCustomer/ServiceCustomerUseCase';
import { ServicesCustomerController } from '../../controllers/servicesCustomer/ServicesCustomerController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import ServiceCustomerModel from '../../models/ServicesCustomerModel';
import { ServicesCustomerValidations } from '../../../../shared/infrastructure/validation/ServicesCustomer/ServiceCustomerValidation';

const serviceCustomerRouter = Router();

const serviceCustomerRepository    = new ServicesCustomerRepository(ServiceCustomerModel);
const serviceCustomerUseCase      = new ServiceCustomerUseCase (serviceCustomerRepository);
const s3Service                   = new S3Service()
const servicesCustomerVAlidations = new ServicesCustomerValidations() 
const serviceCustomerController   = new ServicesCustomerController(serviceCustomerUseCase, s3Service);

serviceCustomerRouter

    .get('/', serviceCustomerController.getAllServicesCustomer)
    .get('/customer/:id', serviceCustomerController.getServicesCustomerDetailByCustomer)
    .get('/:id', serviceCustomerController.getServiceCustomerDetail)
    .post('/', serviceCustomerController.createServiceCustomer)
    .post('/edit/:id',servicesCustomerVAlidations.servicePhotoValidation, serviceCustomerController.updateServiceCustomer)
    .post('/edit/SC/:id', serviceCustomerController.updateTypeCarSC)
    .delete('/:id', serviceCustomerController.deleteServiceCustomer)
    .delete('/SC/:id', serviceCustomerController.deleteOneSC)
    

export default serviceCustomerRouter;

