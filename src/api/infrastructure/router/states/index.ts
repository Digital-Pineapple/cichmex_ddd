import { Router } from 'express';
import { StateRepository } from '../../repository/states/StateRepository';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import StateModel from '../../models/states/StateModel';
import { StateUseCase } from '../../../application/states/StateUseCase';
import { StateController } from '../../controllers/states/StateController';

const statesRouter = Router();

const stateRepository = new StateRepository(StateModel);
const stateUseCase = new StateUseCase(stateRepository);
const stateController = new StateController(stateUseCase);
const userValidations = new UserValidations();

statesRouter
    .get('/', stateController.getAllStates)
    .get('/:id', stateController.getOneState)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), stateController.createState)
    .put('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), stateController.updateState)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), stateController.deleteState);

export default statesRouter;
