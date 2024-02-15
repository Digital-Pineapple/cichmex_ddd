import { Router } from 'express';
import { CustomerUseCase } from '../../../application/customer/CustomerUseCase';
import { CustomerController } from '../../controllers/customer/CustomerController';
import { CustomerRepository } from '../../repository/customer/CustomerRepository';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import {AuthValidations} from '../../../../shared/infrastructure/validation/Auth/AuthValidatons'
import UserModel from '../../models/UserModel';
const customerRouter = Router();

const customerRepository = new CustomerRepository(UserModel);
const customerUserCase   = new CustomerUseCase(customerRepository);
const s3Service          = new S3Service();
const customerValidations = new AuthValidations();
const customerController = new CustomerController(customerUserCase, s3Service);

customerRouter
    .get('/', customerController.getAllCustomers)
    .get('/:id', customerController.getCustomerDetail)
    .post('/', customerController.createCustomer)
    .post('/update/:id',customerValidations.profilePhotoValidation, customerController.updateCustomer)
    .post('/validate/:id', customerController.validateCustomer)
    // .delete('/:id', customerController.deleteCustomer)

export default customerRouter;

