import { Router } from 'express';

import validateAuthentication from '../../../../shared/infrastructure/validation/ValidateAuthentication';
import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';
import { AuthController } from '../../controllers/auth/AuthController';
import { AuthRepository } from '../../repository/auth/AuthRepository';

import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { TwilioService } from '../../../../shared/infrastructure/twilio/TwilioService';
import { AuthValidations } from '../../../../shared/infrastructure/validation/Auth/AuthValidatons';
import { TypeUsersRepository } from '../../repository/typeUser/TypeUsersRepository';
import TypeUserModel from '../../models/TypeUserModel';
import UserModel from '../../models/UserModel';
import { MPService } from '../../../../shared/infrastructure/mercadopago/MPService';

const authRouter = Router();

const authRepository = new AuthRepository(UserModel);
const authUseCase = new AuthUseCase(authRepository);

const typeUserRepository = new TypeUsersRepository(TypeUserModel)
const typeUserUseCase = new TypeUserUseCase(typeUserRepository)

const s3Service = new S3Service();
const mpService = new MPService()
const twilioService = new TwilioService();
const authValidations = new AuthValidations();
const authController = new AuthController(authUseCase, typeUserUseCase, s3Service, twilioService, mpService);

authRouter

    .get('/user', validateAuthentication, authController.revalidateToken)
    .post('/login', authValidations.loginValidation, authController.login)
    .post('/login/admin', authValidations.loginValidation, authController.loginAdmin)
    .post('/register', authValidations.registerValidation, authController.register)
    .post('/registerAdmin/seed', authValidations.registerValidation, authController.registerAdmin)
    .post('/google', authValidations.googleLoginValidations, authController.loginWithGoogle)
    .post('/registerByGoogle', authValidations.googleLoginValidations, authController.registerByGoogle)
    .post('/change-password', validateAuthentication, authController.changePassword)
    .post('/upload/profile-photo/:id', authValidations.profilePhotoValidation, authController.uploadProfilePhoto)
    .post('/verify-code', validateAuthentication, authController.verifyCode)
    .post('/verify-phone', authController.savePhone)
    .post('/mercadoPago', authController.MercadoPagoPayment )
export default authRouter;

