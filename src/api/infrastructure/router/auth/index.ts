import { Router } from 'express';

import validateAuthentication, { validateTokenRestorePassword } from '../../../../shared/infrastructure/validation/ValidateAuthentication';
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
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import { ShoppingCartRepository } from '../../repository/shoppingCart/ShoppingCartRepository';
import ShoppingCartModel from '../../models/ShoppingCartModel';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const authRouter = Router();

const authRepository = new AuthRepository(UserModel);
const authUseCase = new AuthUseCase(authRepository);
const shoppingCartRepository = new ShoppingCartRepository(ShoppingCartModel)
const typeUserRepository = new TypeUsersRepository(TypeUserModel)
const typeUserUseCase = new TypeUserUseCase(typeUserRepository)
const shoppingCartUseCase = new ShoppingCartUseCase(shoppingCartRepository)

const s3Service = new S3Service();
const mpService = new MPService()
const twilioService = new TwilioService();
const authValidations = new AuthValidations();
const userValidations = new UserValidations()
const authController = new AuthController(authUseCase, typeUserUseCase,shoppingCartUseCase, s3Service, twilioService, mpService);

authRouter

    .get('/user',  validateAuthentication, authController.revalidateToken)
    .post('/login', authValidations.loginValidation, authController.login)
    .post('/partner', authValidations.loginValidation, authController.loginPartner)
    .post('/admin/login',authValidations.loginValidation, authController.loginAdmin)
    .post('/register', authValidations.registerValidation, authController.register)
    .post('/register-Pay', authValidations.registerValidation, authController.registerAndPay)
    .post('/registerAdmin/seed', authValidations.registerValidation, authController.registerAdmin)
    .post('/google', authValidations.googleLoginValidations, authController.loginWithGoogle)
    .post('/google-Partner', authValidations.googleLoginValidations, authController.loginWithGooglePartner)
    .post('/registerByGoogle', authValidations.googleLoginValidations, authController.registerByGoogle)
    .post('/send-email-restore', authController.restorePasswordByEmail)
    .post('/verifyCodeRP', authController.verifyCodeByEmail)
    .post('/change-password/:id', validateAuthentication, authController.changePassword)
    .put('/change/password/admin', validateAuthentication, ActivityLogger, authController.changePasswordAdmin)
    .post('/restore-password', validateTokenRestorePassword, authController.restorePassword)
    .post('/upload/profile-photo/:id', authValidations.profilePhotoValidation, authController.uploadProfilePhoto)
    .post('/verify-code', validateAuthentication, authController.verifyCode)
    .post('/verify-phone', authController.savePhone)
    .post('/login-facebook', authController.loginFacebook)
    .post('/signup-facebook', authController.signupFacebook)
    .get('/login-tiktok/callback', authController.redirectTikTok)
    .post('/login-tiktok', authController.loginTikTok)
export default authRouter;

