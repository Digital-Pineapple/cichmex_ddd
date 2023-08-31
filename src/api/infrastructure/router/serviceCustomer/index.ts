import { Router } from 'express';
import { ServicesCustomerRepository } from '../../repository/ServicesCustomer/ServicesCustomerRepository';
import { ServiceCustomerUseCase } from '../../../application/servicesCustomer/ServiceCustomerUseCase';
import { ServicesCustomerController } from '../../controllers/servicesCustomer/ServicesCustomerController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import ServiceCustomerModel from '../../models/ServicesCustomerModel';


const serviceCustomerRouter = Router();

const serviceCustomerRepository    = new ServicesCustomerRepository(ServiceCustomerModel);
const serviceCustomerUseCase      = new ServiceCustomerUseCase (serviceCustomerRepository);
const s3Service                   = new S3Service(); 
const serviceCustomerController   = new ServicesCustomerController(serviceCustomerUseCase, s3Service);

serviceCustomerRouter

    .get('/', serviceCustomerController.getAllServicesCustomer)
    .get('/:id', serviceCustomerController.getServiceCustomerDetail)
    .post('/', serviceCustomerController.createServiceCustomer)
    .post('/edit/:id',serviceCustomerController.updateServiceCustomer)
    .delete('/:id', serviceCustomerController.deleteServiceCustomer)
    

export default serviceCustomerRouter;

