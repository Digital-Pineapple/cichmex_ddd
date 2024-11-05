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
import { AddressRepository } from '../../repository/address/AddressRepository';
import AddressModel from '../../models/AddressModel';
import { AddressUseCase } from '../../../application/address/AddressUseCase';

const userRouter = Router();

const userPhoneRepository = new UserPhoneRepository(PhoneModel);
const userRepository = new UserRepository(UserModel)
const typeUserRepository = new TypeUsersRepository(TypeUserModel)
const shoppingCartRepository = new ShoppingCartRepository(ShoppingCartModel)
const adressRepository = new AddressRepository(AddressModel)

const userPhoneserUseCase = new UserPhoneUseCase(userPhoneRepository);
const userUseCase = new UserUseCase(userRepository);
const addressUseCase = new AddressUseCase(adressRepository)
const typeUserUseCase = new TypeUserUseCase(typeUserRepository)
const shoppingCartUseCase = new ShoppingCartUseCase(shoppingCartRepository)
const s3Service = new S3Service()
const userValidations = new UserValidations()

const twilioService = new TwilioService();
const userController = new UserController(userPhoneserUseCase, userUseCase, typeUserUseCase,shoppingCartUseCase,  addressUseCase, twilioService, s3Service);

userRouter
    .get('/',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), userController.allUsers)
    .get('/phones', userValidations.authTypeUserValidation(['SUPER-ADMIN']), userController.allPhones)
    .get('/phone/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), userController.onePhone)
    .get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', "PARTNER", "CUSTOMER"]), userController.getUser)
    .get('/getVerifyEmail/:id', userController.getVerifyEmail)
    .get('/carrier-driver/all',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), userController.getAllCarrierDrivers)
    .get('/carrier-driver/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), userController.getOneCarrierDriver)
    .post('/send-code', userController.sendCode)
    .post ('/whatsapp/send-code', userController.sendCodeWhatsapp)
    .put('/validate/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), userController.validateUser)
    .post ('/resend-code/:id', userController.resendCode)
    .post ('/update/:id', userValidations.ImageValidation, userController.updateUser)
    .post ('/verify-phone/:id', userController.verifyPhone)
    .post ('/verify-email/:id', userController.verifyEmail)
    .post ('/registerbyPhone', userController.signUpByPhone)
    .post ('/registerPartnerbyPhone', userController.signUpPartnerByPhone)
    .post('/loginByPhone', userController.loginPhone)
    .post('/loginByPhonePartner', userController.loginPhonePartner)
    .post('/collection-point/update/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER","CUSTOMER"]),userController.updateCollectionPoint)
    .post('/carrier-driver',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), userController.RegisterCarrierDriver)
    .post('/carrier-driver/update/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), userController.UpdateCarrierDriver)
    .delete('/phone-delete/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN"]), userController.deletePhone)
    .delete('/phone-delete-1/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN"]), userController.physicalDeletePhone)
    .delete('/delete-user/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN"]), userController.deleteUser)
    .post('/create/address', userValidations.authTypeUserValidation(["CUSTOMER"]), userController.createAddress)
    .delete('/delete/address/:id', userValidations.authTypeUserValidation(["CUSTOMER"]), userController.deleteAddress)
    .put('/update/address/:id', userValidations.authTypeUserValidation(["CUSTOMER"]), userController.updateAddress)
    .get('/addresses/ok', userValidations.authTypeUserValidation(["CUSTOMER"]), userController.getAddresses) 
    .delete('/carrier-driver/:id', userValidations.authTypeUserValidation(["SUPER-ADMIN","ADMIN"]), userController.deleteCarrierDriver)


export default userRouter;
