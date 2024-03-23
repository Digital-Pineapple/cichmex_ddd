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

const userRouter = Router();

const userPhoneRepository = new UserPhoneRepository(PhoneModel);
const userRepository = new UserRepository(UserModel)
const typeUserRepository = new TypeUsersRepository(TypeUserModel)

const userPhoneserUseCase = new UserPhoneUseCase(userPhoneRepository);
const userUseCase = new UserUseCase(userRepository);
const typeUserUseCase = new TypeUserUseCase(typeUserRepository)
const s3Service = new S3Service()
const userValidations = new UserValidations()

const twilioService = new TwilioService();
const userController = new UserController(userPhoneserUseCase, userUseCase, typeUserUseCase, twilioService, s3Service)

userRouter
    .get('/',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.allUsers)
    .get('/phones', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.allPhones)
    .get('/phone/:id', userController.onePhone)
    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.getUser)
    .get('/getVerifyEmail/:id', userController.getVerifyEmail)
    .post('/send-code', userController.sendCode)
    .post ('/resend-code/:id', userController.resendCode)
    .post ('/update/:id', userValidations.ImageValidation, userController.updateUser)
    .post ('/verify-phone/:id', userController.verifyPhone)
    .post ('/verify-email/:id', userController.verifyEmail)
    .post ('/registerbyPhone', userController.signUpByPhone)
    .post ('/registerPartnerbyPhone', userController.signUpPartnerByPhone)
    .post('/loginByPhone', userController.loginPhone)
    .delete('/phone-delete/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.deletePhone)
    .delete('/phone-delete-1/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.physicalDeletePhone)

    .delete('/delete-user/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), userController.deleteUser)

export default userRouter;
