import { Router } from 'express';
import { ServicesCustomerRepository } from '../../repository/ServicesCustomer/ServicesCustomerRepository';
import { ServiceCustomerUseCase } from '../../../application/servicesCustomer/ServiceCustomerUseCase';
import { ServicesCustomerController } from '../../controllers/servicesCustomer/ServicesCustomerController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import ServiceCustomerModel from '../../models/ServicesCustomerModel';
import { ServicesCustomerValidations } from '../../../../shared/infrastructure/validation/ServicesCustomer/ServiceCustomerValidation';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const serviceCustomerRouter = Router();

const serviceCustomerRepository    = new ServicesCustomerRepository(ServiceCustomerModel);
const serviceCustomerUseCase      = new ServiceCustomerUseCase (serviceCustomerRepository);
const s3Service                   = new S3Service()
const servicesCustomerVAlidations = new ServicesCustomerValidations() 
const serviceCustomerController   = new ServicesCustomerController(serviceCustomerUseCase, s3Service);
const userValidations = new UserValidations();

serviceCustomerRouter

    .get('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), serviceCustomerController.getAllServicesCustomer)
    .get('/customer/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), serviceCustomerController.getServicesCustomerDetailByCustomer)
    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), serviceCustomerController.getServiceCustomerDetail)
    .post('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc59']), serviceCustomerController.createServiceCustomer)
    .post('/edit/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), servicesCustomerVAlidations.servicePhotoValidation, serviceCustomerController.updateServiceCustomer)
    .post('/edit/SC/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), serviceCustomerController.updateTypeCarSC)
    // .delete('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), serviceCustomerController.deleteServiceCustomer)
    .delete('/SC/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), serviceCustomerController.deleteOneSC)
    

export default serviceCustomerRouter;

