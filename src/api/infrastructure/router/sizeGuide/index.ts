import { Router } from 'express';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import SizeGuideModel from '../../models/sizeGuide/SizeGuideModel';
import { SizeGuideRepository } from '../../repository/sizeGuide/SizeGuideRepository';
import { SizeGuideUseCase } from '../../../application/sizeGuide/SizeGuideUseCase';
import { SizeGuideController } from '../../controllers/sizeGuide/SizeGuideController';

const sizeGuideRouter = Router();

const sizeGuideRepository = new SizeGuideRepository(SizeGuideModel);
const sizeGuideUseCase = new SizeGuideUseCase(sizeGuideRepository);
const sizeGuideController = new SizeGuideController(sizeGuideUseCase);
const userValidations = new UserValidations();

sizeGuideRouter
    .get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), sizeGuideController.getMySizeGuides)
    .get('/allGuides', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), sizeGuideController.getMySizeGuides)
    .get('/:id', sizeGuideController.getOneGuide)
    .post('/addOne', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), sizeGuideController.createOneGuide)
    .put('/update/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN,ADMIN']), sizeGuideController.updateOneGuide)
    .delete('/id', userValidations.authTypeUserValidation(['SUPER-ADMIN,ADMIN']), sizeGuideController.deleteOneGuide)



export default sizeGuideRouter;
