import { Router } from 'express';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { SocketUseCase } from '../../../application/socket/socketUseCase';
import { SocketController } from '../../controllers/sockets/users';

const socketsRouter = Router();

const socketUseCase = new SocketUseCase(); // Instancia de SocketUseCase
const socketController = new SocketController(socketUseCase); // Instancia de SocketController con SocketUseCase
const userValidations = new UserValidations();

socketsRouter.post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']), socketController.addUser);

export default socketsRouter;
