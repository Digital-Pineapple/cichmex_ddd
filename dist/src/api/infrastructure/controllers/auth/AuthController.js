"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ErrorHandler_1 = require("../../../../shared/domain/ErrorHandler");
const ResponseData_1 = require("../../../../shared/infrastructure/validation/ResponseData");
const Utils_1 = require("../../../../shared/infrastructure/validation/Utils");
const emailer_1 = require("../../../../shared/infrastructure/nodemailer/emailer");
class AuthController extends ResponseData_1.ResponseData {
    constructor(authUseCase, typeUserUseCase, shoppingCartUseCase, s3Service, twilioService, mpService) {
        super();
        this.authUseCase = authUseCase;
        this.typeUserUseCase = typeUserUseCase;
        this.shoppingCartUseCase = shoppingCartUseCase;
        this.s3Service = s3Service;
        this.twilioService = twilioService;
        this.mpService = mpService;
        this.path = '/users';
        this.login = this.login.bind(this);
        this.loginAdmin = this.loginAdmin.bind(this);
        this.loginPartner = this.loginPartner.bind(this);
        this.register = this.register.bind(this);
        this.registerAndPay = this.registerAndPay.bind(this);
        this.registerAdmin = this.registerAdmin.bind(this);
        this.loginWithGoogle = this.loginWithGoogle.bind(this);
        this.loginWithGooglePartner = this.loginWithGooglePartner.bind(this);
        this.registerByGoogle = this.registerByGoogle.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this);
        this.revalidateToken = this.revalidateToken.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
        this.savePhone = this.savePhone.bind(this);
        this.restorePasswordByEmail = this.restorePasswordByEmail.bind(this);
        this.verifyCodeByEmail = this.verifyCodeByEmail.bind(this);
        this.restorePassword = this.restorePassword.bind(this);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const response = yield this.authUseCase.signIn(email, password);
                if (!(response instanceof ErrorHandler_1.ErrorHandler) && response.user.profile_image !== undefined) {
                    response.user.profile_image ?
                        response.user.profile_image = yield this.s3Service.getUrlObject(response.user.profile_image + ".jpg") :
                        'No hay imagen de perfil';
                }
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al iniciar sesión', 500));
            }
        });
    }
    loginPartner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const response = yield this.authUseCase.signInPartner(email, password);
                if (!(response instanceof ErrorHandler_1.ErrorHandler) && response.user.profile_image !== undefined) {
                    response.user.profile_image ?
                        response.user.profile_image = yield this.s3Service.getUrlObject(response.user.profile_image + ".jpg") :
                        'No hay imagen de perfil';
                }
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al iniciar sesión', 500));
            }
        });
    }
    loginAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const response = yield this.authUseCase.signInAdmin(email, password);
                // if (!(response instanceof ErrorHandler) && response.user.profile_image === undefined) {
                //     response.user.profile_image ?
                //         response.user.profile_image = await this.s3Service.getUrlObject(response.user.profile_image) :
                //         'No hay imagen de perfil'
                // }
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al iniciar sesión', 500));
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, fullname, phone } = req.body;
            try {
                const responsedefault = yield this.typeUserUseCase.getTypeUsers();
                const def = responsedefault === null || responsedefault === void 0 ? void 0 : responsedefault.filter(item => item.name === 'Customer');
                const TypeUser_id = def === null || def === void 0 ? void 0 : def.map(item => item._id);
                const response = yield this.authUseCase.signUp({ fullname, email, password, phone, type_user: TypeUser_id });
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler(`Error:${error}`, 500));
            }
        });
    }
    registerAndPay(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, fullname, system } = req.body;
            const uuid = (0, Utils_1.generateUUID)();
            try {
                const typeUser = yield this.typeUserUseCase.findTypeUser({ system: system, role: "CUSTOMER" });
                if (!(typeUser === null || typeUser === void 0 ? void 0 : typeUser._id)) {
                    return next(new ErrorHandler_1.ErrorHandler('No existe tipo de usuario', 500));
                }
                const response = yield this.authUseCase.signUp2({ fullname, email, password, type_user: typeUser === null || typeUser === void 0 ? void 0 : typeUser._id, uuid: uuid });
                if (response === null || response === void 0 ? void 0 : response.user._id) {
                    yield this.shoppingCartUseCase.createShoppingCart({ user_id: response === null || response === void 0 ? void 0 : response.user._id });
                }
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler(`Error:${error}`, 500));
            }
        });
    }
    registerAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, fullname, phone, type_user } = req.body;
            const uuid = (0, Utils_1.generateUUID)();
            try {
                const response = yield this.authUseCase.signUp({ fullname, email, password, phone, type_user: type_user, uuid: uuid });
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al iniciar sesión', 500));
            }
        });
    }
    loginWithGoogle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idToken } = req.body;
            try {
                const response = yield this.authUseCase.signInWithGoogle(idToken);
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Usuario no registrado', 500));
            }
        });
    }
    loginWithGooglePartner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idToken } = req.body;
            try {
                const response = yield this.authUseCase.signInWithGooglePartner(idToken);
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Usuario no registrado', 500));
            }
        });
    }
    registerByGoogle(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { idToken, system } = req.body;
            try {
                const response = yield this.authUseCase.signUpWithGoogle(idToken);
                const uuid = (0, Utils_1.generateUUID)();
                if (!(response instanceof ErrorHandler_1.ErrorHandler)) {
                    const typeUser = yield this.typeUserUseCase.findTypeUser({ system: system, role: "CUSTOMER" });
                    if (!(typeUser === null || typeUser === void 0 ? void 0 : typeUser._id)) {
                        return next(new ErrorHandler_1.ErrorHandler('No existe tipo de usuario', 500));
                    }
                    const response2 = yield this.authUseCase.signUpPlatform({
                        fullname: response === null || response === void 0 ? void 0 : response.fullname,
                        email: response === null || response === void 0 ? void 0 : response.email,
                        type_user: typeUser === null || typeUser === void 0 ? void 0 : typeUser._id,
                        uuid: uuid,
                        google: true
                    });
                    if ((_a = response2 === null || response2 === void 0 ? void 0 : response2.user) === null || _a === void 0 ? void 0 : _a._id) {
                        yield this.shoppingCartUseCase.createShoppingCart({ user_id: response2.user._id });
                        this.invoke(response2, 201, res, 'Registro Exitoso', next);
                    }
                    else {
                        next(new ErrorHandler_1.ErrorHandler("correo existente", 500));
                    }
                }
                else {
                    this.invoke(response, 200, res, '', next);
                }
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al registrar', 500));
            }
        });
    }
    restorePasswordByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const response = yield this.authUseCase.findUser(email);
                const newCode = parseInt((0, Utils_1.generateRandomCode)());
                const NoAttempts = 2;
                if (!response.verify_code) {
                    const { attemps } = (response.verify_code);
                    if (attemps >= 1) {
                        const newAttemps = attemps - 1;
                        try {
                            yield this.authUseCase.updateCodeUser(response._id, newCode, newAttemps);
                            const { success, message } = yield (0, emailer_1.sendCodeMail)(response.email, response.fullname, newCode);
                            this.invoke(success, 200, res, `${message}`, next);
                        }
                        catch (error) {
                            next(new ErrorHandler_1.ErrorHandler('Error', 500));
                        }
                    }
                    if (attemps === 0) {
                        next(new ErrorHandler_1.ErrorHandler('Has alcanzado el limite de intentos', 500));
                    }
                }
                else {
                    try {
                        yield this.authUseCase.updateCodeUser(response._id, newCode, NoAttempts);
                        const { success, message } = yield (0, emailer_1.sendCodeMail)(response.email, response.fullname, newCode);
                        this.invoke(success, 201, res, `${message}`, next);
                    }
                    catch (error) {
                        next(new ErrorHandler_1.ErrorHandler('Error', 500));
                    }
                }
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler(`No existe el usuario: ${email}`, 500));
            }
        });
    }
    verifyCodeByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, email } = req.body;
            try {
                const response = yield this.authUseCase.ValidateCodeEmail(email, code);
                this.invoke(response, 200, res, 'Código valido', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler(`No existe el usuario: ${email}`, 500));
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, new_password } = req.body;
            const { id } = req.params;
            try {
                const response = yield this.authUseCase.changePassword(password, new_password, id);
                this.invoke(response, 200, res, 'La contraseña se cambio con exito', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al cambiar la contraseña', 500));
            }
        });
    }
    uploadProfilePhoto(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const pathObject = `${this.path}/${id}/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.fieldname}`;
                const { url, success, message } = yield this.s3Service.uploadToS3AndGetUrl(pathObject + '.jpg', req.file, 'image/jpeg');
                if (!success)
                    return new ErrorHandler_1.ErrorHandler('Hubo un error al subir la imagen', 400);
                const response = yield this.authUseCase.updateProfilePhoto(pathObject, id);
                response.profile_image = url;
                this.invoke(response, 200, res, message, next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al subir la foto', 500));
            }
        });
    }
    revalidateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            try {
                const userInfo = yield this.authUseCase.findUser({ email: user.email, status: true });
                const url = yield this.s3Service.getUrlObject(userInfo.profile_image + ".jpg");
                userInfo.profile_image = url;
                const response = yield this.authUseCase.generateToken(userInfo, userInfo.uuid);
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al generar el token', 500));
            }
        });
    }
    savePhone(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone_number, prefix } = req.body;
            try {
                const code = (0, Utils_1.generateRandomCode)();
                const vcode = parseInt(code);
                // await this.twilioService.sendSMS(`Codigo de verificacion CarWash autolavado y más- ${code}`);
                const response = yield this.authUseCase.findPhone(phone_number);
                this.invoke(response, 200, res, 'El telefono se registro correctamente', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al guardar el telefono', 500));
            }
        });
    }
    verifyCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user.id;
            const { code } = req.body;
            try {
                const response = yield this.authUseCase.verifyPhoneNumber(user, +code);
                this.invoke(response, 200, res, 'El código de verificación se envió correctamente', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('El codigo no se ha enviado', 500));
            }
        });
    }
    restorePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { password } = req.body;
            console.log(user, password);
            const id = user.toString();
            try {
                yield this.authUseCase.restorePassword(id, password);
                this.invoke('', 200, res, 'Cambio la contraseña exitosamente', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Error al cambiar contraseña', 500));
            }
        });
    }
}
exports.AuthController = AuthController;
