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
    .get('/', typeUserController.getAllTypeUser)
    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), typeUserController.getTypeUser)
    .post('/', typeUserController.createTypeUser)
    .post('/:id', typeUserController.updateTypeUser)
    .delete('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']),  typeUserController.deleteTypeUser)
    .get ('/seed/ok', typeUserController.TypeUserSeed)

export default typeUserRouter;
