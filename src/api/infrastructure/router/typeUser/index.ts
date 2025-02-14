import { Router } from 'express';

import { TypeUsersRepository } from '../../repository/typeUser/TypeUsersRepository';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';
import { TypeUserController  } from '../../controllers/typeUser/TypeUserController';
import TypeUserModel from '../../models/TypeUserModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const typeUserRouter = Router();

const typeUserRepository     = new TypeUsersRepository(TypeUserModel);
const typeUserUseCase        = new TypeUserUseCase(typeUserRepository);
const typeUserController     = new TypeUserController(typeUserUseCase);
const userValidations = new UserValidations();

typeUserRouter
    .get('/',userValidations.authTypeUserValidation(['SUPER-ADMIN']), typeUserController.getAllTypeUser)
    .get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), typeUserController.getTypeUser)
    .post('/',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, typeUserController.createTypeUser)
    .post('/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, typeUserController.updateTypeUser)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger,  typeUserController.deleteTypeUser)
    // .get ('/seed/ok', typeUserController.TypeUserSeed)

export default typeUserRouter;
