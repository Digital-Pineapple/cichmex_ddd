"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ValidateAuthentication_1 = __importStar(require("../../../../shared/infrastructure/validation/ValidateAuthentication"));
const AuthUseCase_1 = require("../../../application/auth/AuthUseCase");
const TypeUserUseCase_1 = require("../../../application/typeUser/TypeUserUseCase");
const AuthController_1 = require("../../controllers/auth/AuthController");
const AuthRepository_1 = require("../../repository/auth/AuthRepository");
const S3Service_1 = require("../../../../shared/infrastructure/aws/S3Service");
const TwilioService_1 = require("../../../../shared/infrastructure/twilio/TwilioService");
const AuthValidatons_1 = require("../../../../shared/infrastructure/validation/Auth/AuthValidatons");
const TypeUsersRepository_1 = require("../../repository/typeUser/TypeUsersRepository");
const TypeUserModel_1 = __importDefault(require("../../models/TypeUserModel"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const MPService_1 = require("../../../../shared/infrastructure/mercadopago/MPService");
const UserValidation_1 = require("../../../../shared/infrastructure/validation/User/UserValidation");
const ShoppingCartUseCase_1 = require("../../../application/shoppingCart.ts/ShoppingCartUseCase");
const ShoppingCartRepository_1 = require("../../repository/shoppingCart/ShoppingCartRepository");
const ShoppingCartModel_1 = __importDefault(require("../../models/ShoppingCartModel"));
const authRouter = (0, express_1.Router)();
const authRepository = new AuthRepository_1.AuthRepository(UserModel_1.default);
const authUseCase = new AuthUseCase_1.AuthUseCase(authRepository);
const shoppingCartRepository = new ShoppingCartRepository_1.ShoppingCartRepository(ShoppingCartModel_1.default);
const typeUserRepository = new TypeUsersRepository_1.TypeUsersRepository(TypeUserModel_1.default);
const typeUserUseCase = new TypeUserUseCase_1.TypeUserUseCase(typeUserRepository);
const shoppingCartUseCase = new ShoppingCartUseCase_1.ShoppingCartUseCase(shoppingCartRepository);
const s3Service = new S3Service_1.S3Service();
const mpService = new MPService_1.MPService();
const twilioService = new TwilioService_1.TwilioService();
const authValidations = new AuthValidatons_1.AuthValidations();
const userValidations = new UserValidation_1.UserValidations();
const authController = new AuthController_1.AuthController(authUseCase, typeUserUseCase, shoppingCartUseCase, s3Service, twilioService, mpService);
authRouter
    .get('/user', ValidateAuthentication_1.default, authController.revalidateToken)
    .post('/login', authValidations.loginValidation, authController.login)
    .post('/partner', authValidations.loginValidation, authController.loginPartner)
    // .post('/login/admin', authValidations.loginValidation, authController.loginAdmin)
    .post('/register', authValidations.registerValidation, authController.register)
    .post('/register-Pay', authValidations.registerValidation, authController.registerAndPay)
    .post('/registerAdmin/seed', authValidations.registerValidation, authController.registerAdmin)
    .post('/google', authValidations.googleLoginValidations, authController.loginWithGoogle)
    .post('/google-Partner', authValidations.googleLoginValidations, authController.loginWithGooglePartner)
    .post('/registerByGoogle', authValidations.googleLoginValidations, authController.registerByGoogle)
    .post('/send-email-restore', authController.restorePasswordByEmail)
    .post('/verifyCodeRP', authController.verifyCodeByEmail)
    .post('/change-password/:id', ValidateAuthentication_1.default, authController.changePassword)
    .post('/restore-password', ValidateAuthentication_1.validateTokenRestorePassword, authController.restorePassword)
    .post('/upload/profile-photo/:id', authValidations.profilePhotoValidation, authController.uploadProfilePhoto)
    .post('/verify-code', ValidateAuthentication_1.default, authController.verifyCode)
    .post('/verify-phone', authController.savePhone);
exports.default = authRouter;
