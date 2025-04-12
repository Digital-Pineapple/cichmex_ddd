import { Router } from 'express';
import { MunicipalitiesRepository } from '../../repository/municipalities/MunicipalitiesRepository';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import MunicipalitiesModel from '../../models/municipalities/MunicipalitiesModel';
import { MunicipalitiesUseCase } from '../../../application/municipalities/MunicipalitiesUseCase';
import { MunicipalitiesController } from '../../controllers/municipalities/MunicipalitiesController';

const municipalitiesRouter = Router();

const municipalitiesRepository = new MunicipalitiesRepository(MunicipalitiesModel);
const municipalitiesUseCase = new MunicipalitiesUseCase(municipalitiesRepository);
const municipalitiesController = new MunicipalitiesController(municipalitiesUseCase);
const userValidations = new UserValidations();

municipalitiesRouter
    // .get('/', municipalitiesController.getAllMunicipalities)
    .get('/:id', municipalitiesController.getOneMunicipality)
    .get('/state/:stateId', municipalitiesController.getMunicipalitiesByState)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), municipalitiesController.createMunicipality)
    .put('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), municipalitiesController.updateMunicipality)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), municipalitiesController.deleteMunicipality);

export default municipalitiesRouter;
