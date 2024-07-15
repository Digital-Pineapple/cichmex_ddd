import { Router } from 'express';

import { UserPhoneRepository } from '../../repository/user/UserPhoneRepository';
import { UserPhoneUseCase } from '../../../application/user/UserPhoneUseCase';
import { UserUseCase } from '../../../application/user/UserUseCase';

import { UserController } from '../../controllers/user/UserController';
import PhoneModel from '../../models/PhoneModel';
import UserModel from '../../models/UserModel';
import { TwilioService } from '../../../../shared/infrastructure/twilio/TwilioService';
import { UserRepository } from '../../repository/user/UserRepository';
import { TypeUsersRepository } from '../../repository/typeUser/TypeUsersRepository';
import TypeUserModel from '../../models/TypeUserModel';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import { ShoppingCartRepository } from '../../repository/shoppingCart/ShoppingCartRepository';
import ShoppingCartModel from '../../models/ShoppingCartModel';

const userRouter = Router();

const userPhoneRepository = new UserPhoneRepository(PhoneModel);
const userRepository = new UserRepository(UserModel)
const typeUserRepository = new TypeUsersRepository(TypeUserModel)
const shoppingCartRepository = new ShoppingCartRepository(ShoppingCartModel)

const userPhoneserUseCase = new UserPhoneUseCase(userPhoneRepository);
const userUseCase = new UserUseCase(userRepository);
const typeUserUseCase = new TypeUserUseCase(typeUserRepository)
const shoppingCartUseCase = new ShoppingCartUseCase(shoppingCartRepository)
const s3Service = new S3Service()
const userValidations = new UserValidations()

const twilioService = new TwilioService();
const userController = new UserController(userPhoneserUseCase, userUseCase, typeUserUseCase,shoppingCartUseCase, twilioService, s3Service)

userRouter
    .get('/',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.allUsers)
    .get('/phones', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.allPhones)
    .get('/phone/:id', userController.onePhone)
    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), userController.getUser)
    .get('/getVerifyEmail/:id', userController.getVerifyEmail)
    .get('/carrier-driver/all',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.getAllCarrierDrivers)
    .post('/send-code', userController.sendCode)
    .put('/validate/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.validateUser)
    .post ('/resend-code/:id', userController.resendCode)
    .post ('/update/:id', userValidations.ImageValidation, userController.updateUser)
    .post ('/verify-phone/:id', userController.verifyPhone)
    .post ('/verify-email/:id', userController.verifyEmail)
    .post ('/registerbyPhone', userController.signUpByPhone)
    .post ('/registerPartnerbyPhone', userController.signUpPartnerByPhone)
    .post('/loginByPhone', userController.loginPhone)
    .post('/loginByPhonePartner', userController.loginPhonePartner)
    .post('/collection-point/update/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']),userController.updateCollectionPoint)
    .post('/carrier-driver',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.RegisterCarrierDriver)
    .delete('/phone-delete/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.deletePhone)
    .delete('/phone-delete-1/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.physicalDeletePhone)
    .delete('/delete-user/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.deleteUser)

export default userRouter;
