import { Router } from 'express';
import { CarDetailUseCase } from '../../../application/carDetail/CarDetailUseCase';
import { CarDetailController } from '../../controllers/carDetail/CarDetailController';
import { CategoryRepository } from '../../repository/carDetail/CarDetailRepository';
import CarDetailModel from '../../models/CarDetailModel'

import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { CarDetailValidations } from '../../../../shared/infrastructure/validation/CarDetail/CarDetailValidation';

const carDetailRouter = Router();

const carDetailRepository     = new CategoryRepository(CarDetailModel);
const carDetailUseCase        = new CarDetailUseCase(carDetailRepository);
const s3Service          = new S3Service();
const carDetailValidations    = new CarDetailValidations();
const carDetailController     = new CarDetailController(carDetailUseCase, s3Service);

carDetailRouter
.get('/', carDetailController.getAllCarDetails)
.get('/:id', carDetailController.getCarDetail)
.post('/', carDetailController.createCarDetail)
.post('/:id',carDetailValidations.carDetailPhotoValidation, carDetailController.updateCarDetail)
.delete('/:id', carDetailController.deleteCarDetail)

export default carDetailRouter;