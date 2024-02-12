import { Router } from 'express';

import { TypeCarRepository } from '../../repository/typeCar/TypeCarRepository';
import { TypeCarUseCase } from '../../../application/typeCar/TypeCarUseCase';
import { TypeCarController } from '../../controllers/typeCar/TypeCarController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { TypeCarValidations } from '../../../../shared/infrastructure/validation/TypeCar/TypeCarValidation';
import TypeCarModel from '../../models/TypeCarModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const typeCarRouter = Router();

const typeCarRepository     = new TypeCarRepository(TypeCarModel);
const typeCarUseCase        = new TypeCarUseCase(typeCarRepository);
const s3Service             = new S3Service();
const typeCarValidations    = new TypeCarValidations();
const typeCarController     = new TypeCarController(typeCarUseCase,s3Service);
const userValidations = new UserValidations();

typeCarRouter
    .get('/', typeCarController.getAllTypeCars)
    .get('/:id', typeCarController.getTypeCar)
    .post('/', typeCarController.createTypeCar)
    .post('/:id', typeCarValidations.typeCarPhotoValidation, typeCarController.updateTypeCar)
    .delete('/:id', typeCarController.deleteTypeCar)

export default typeCarRouter;

