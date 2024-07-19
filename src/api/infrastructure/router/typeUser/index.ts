import { Router } from 'express';

import { TypeUsersRepository } from '../../repository/typeUser/TypeUsersRepository';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';
import { TypeUserController  } from '../../controllers/typeUser/TypeUserController';
import TypeUserModel from '../../models/TypeUserModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const typeUserRouter = Router();

const typeUserRepository     = new TypeUsersRepository(TypeUserModel);
const typeUserUseCase        = new TypeUserUseCase(typeUserRepository);
const typeUserController     = new TypeUserController(typeUserUseCase);
const userValidations = new UserValidations();

typeUserRouter
    .get('/',userValidations.authTypeUserValidation(['SUPER-ADMIN']), typeUserController.getAllTypeUser)
    .get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), typeUserController.getTypeUser)
    .post('/',userValidations.authTypeUserValidation(['SUPER-ADMIN']), typeUserController.createTypeUser)
    .post('/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']), typeUserController.updateTypeUser)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),  typeUserController.deleteTypeUser)
    // .get ('/seed/ok', typeUserController.TypeUserSeed)

export default typeUserRouter;
