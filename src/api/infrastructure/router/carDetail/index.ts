import { Router } from 'express';
import { CarDetailUseCase } from '../../../application/carDetail/CarDetailUseCase';
import { CarDetailController } from '../../controllers/carDetail/CarDetailController';
import { CategoryRepository } from '../../repository/carDetail/CarDetailRepository';
import CarDetailModel from '../../models/CarDetailModel'

import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { CarDetailValidations } from '../../../../shared/infrastructure/validation/CarDetail/CarDetailValidation';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const carDetailRouter = Router();

const carDetailRepository     = new CategoryRepository(CarDetailModel);
const carDetailUseCase        = new CarDetailUseCase(carDetailRepository);
const s3Service          = new S3Service();
const carDetailVAlidations = new CarDetailValidations()
const carDetailController     = new CarDetailController(carDetailUseCase, s3Service);
const userValidations = new UserValidations();

carDetailRouter

.get('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), carDetailController.getAllCarDetails)
.get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc59']) ,carDetailController.getCarDetail)
.get('/customer/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc59']), carDetailController.getCarDetailByCustomer)
.post('/', carDetailVAlidations.carDetailPhotoValidation,carDetailController.createCarDetail )
.post('/:id', carDetailVAlidations.carDetailPhotoValidation, carDetailController.updateCarDetail)
.delete('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc59']), carDetailController.deleteCarDetail)


export default carDetailRouter;