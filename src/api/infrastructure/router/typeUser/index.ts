import { Router } from 'express';

import { TypeUsersRepository } from '../../repository/typeUser/TypeUsersRepository';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';
import { TypeUserController  } from '../../controllers/typeUser/TypeUserController';
import TypeUserModel from '../../models/TypeUserModel';

const typeUserRouter = Router();

const typeUserRepository     = new TypeUsersRepository(TypeUserModel);
const typeUserUseCase        = new TypeUserUseCase(typeUserRepository);
const typeUserController     = new TypeUserController(typeUserUseCase);

typeUserRouter
    .get('/', typeUserController.getAllTypeUser)
    .get('/:id', typeUserController.getTypeUser)
    .post('/', typeUserController.createTypeUser)
    .post('/:id', typeUserController.updateTypeUser)
    .delete('/:id', typeUserController.deleteTypeUser)
    .get ('/seed/ok', typeUserController.TypeUserSeed)

export default typeUserRouter;
