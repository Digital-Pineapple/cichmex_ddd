import { Router } from 'express';

import { ServicesInBranchUseCase } from '../../../application/servicesInBranch/ServicesInBranchUseCase';
import { ServicesInBranchController } from '../../controllers/servicesInBranchController/ServicesInBranchController';
import { ServicesInBranchRepository } from '../../repository/servicesInBranch/ServicesInBranchRepository'; 
import ServicesInBranchModel from '../../models/BranchOffices/ServicesInBranchModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const servicesInBranchRouter = Router();

const servicesInBranchRepository    = new ServicesInBranchRepository(ServicesInBranchModel);
const servicesInBranchUseCase      = new ServicesInBranchUseCase(servicesInBranchRepository);

const servicesInBranchController   = new ServicesInBranchController(servicesInBranchUseCase);

const userValidations = new UserValidations();

servicesInBranchRouter
    .get('/', servicesInBranchController.getAllServicesInBranch)
    .get('/:id', servicesInBranchController.getServiceInBranchDetail)
    .get('/branch/:id', servicesInBranchController.getServicesInBranchByBranch)
    .post('/', servicesInBranchController.createServiceInBranch)
    .post('/:id',servicesInBranchController.updateServiceInBranch )
    .delete('/:id', servicesInBranchController.deleteServiceInBranch)
    

export default servicesInBranchRouter;

